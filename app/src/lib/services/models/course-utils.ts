import type { Composite, Course, IconNav, Lo, LoType, Topic } from "./lo-types";
import { filterByType, setShowHide } from "./lo-utils";

export function createToc(course: Course) {
  course.los.forEach((lo) => {
    if (lo.type == "topic") {
      const topic = lo as Topic;
      topic.toc = [];
      topic.toc.push(...topic.panels.panelVideos, ...topic.panels.panelTalks, ...topic.panels.panelNotes, ...topic.units.units, ...topic.units.standardLos, ...topic.units.sides);

      topic.toc.forEach((lo) => {
        lo.parentLo = course;
        lo.parentTopic = topic;
        if (lo.type === "unit" || lo.type === "side") {
          const composite = lo as Composite;
          composite.los.forEach((subLo) => {
            subLo.parentTopic = topic;
          });
        }
      });
    }
  });
}

export function createCompanions(course: Course) {
  course.companions = {
    show: true,
    bar: []
  };
  const companionsList = [
    { key: "slack", icon: "slack", target: "_blank", tip: "Go to module Slack channel" },
    { key: "zoom", icon: "zoom", target: "_blank", tip: "Go to module Zoom meeting" },
    { key: "moodle", icon: "moodle", target: "_blank", tip: "Go to module Moodle page" },
    { key: "youtube", icon: "youtube", target: "_blank", tip: "Go to module YouTube channel" },
    { key: "teams", icon: "teams", target: "_blank", tip: "Go to module Teams meeting" }
  ];
  companionsList.forEach((companionItem) => {
    const { key, icon, target, tip } = companionItem;
    if (course.properties[key]) {
      course.companions.bar.push({ link: course.properties[key], icon, target, tip });
    }
  });
  if (course.properties.companions) {
    for (const [key, value] of Object.entries(course.properties.companions)) {
      const companion: any = value;
      course.companions.bar.push({
        link: companion.link,
        icon: key,
        target: "_blank",
        tip: companion.title
      });
    }
  }
  course.companions.show = course.companions.bar.length > 0;
}

export function createWalls(course: Course) {
  course.walls = [];
  course.wallMap = new Map<string, Lo[]>();
  ["talk", "note", "lab", "web", "archive", "github"].forEach((type) => addWall(course, type as LoType));
  course.wallBar = {
    show: true,
    bar: []
  };
  course.walls?.forEach((wall) => {
    course.wallBar.bar.push(createWallLink(wall[0].type, course));
  });
}

function createWallLink(type: string, course: Course): IconNav {
  return {
    link: `/wall/${type}/${course.courseUrl}`,
    icon: type,
    tip: `${type}s`,
    target: ""
  };
}

function addWall(course: Course, type: LoType) {
  let los = filterByType(course.los, type);
  los = los.filter((lo) => lo.hide === false);
  if (los.length > 0) {
    course.walls?.push(filterByType(course.los, type));
  }
  if (los.length > 0) {
    course.wallMap?.set(type, los);
  }
}

export function loadPropertyFlags(course: Course) {
  course.isPortfolio = (course.properties?.portfolio as unknown as boolean) === true;
  course.areVideosHidden = (course.properties?.hideVideos as unknown as boolean) === true;
  course.areLabStepsAutoNumbered = (course.properties?.labStepsAutoNumber as unknown as boolean) === true;
  course.authLevel = course.properties.auth as unknown as number;
  course.hasEnrollment = false;
  course.hasWhiteList = false;
  course.ignorePin = course.properties?.ignorepin?.toString();
  if (course.properties?.icon) {
    // @ts-ignore
    course.icon = course.properties.icon;
  }
  course.los.forEach((lo) => {
    if (lo.hide) {
      setShowHide(lo, true);
    }
  });
}

export function initCalendar(course: Course) {
  const calendar = {
    title: "unknown",
    weeks: []
  };
  try {
    if (course.calendar) {
      const calendarObj = course.calendar;
      calendar.title = calendarObj.title;
      // @ts-ignore
      calendar.weeks = calendarObj.weeks.map((weekObj: any) => ({
        date: Object.keys(weekObj)[0],
        title: weekObj[Object.keys(weekObj)[0]].title,
        type: weekObj[Object.keys(weekObj)[0]].type,
        dateObj: new Date(Object.keys(weekObj)[0])
      }));

      const today = Date.now();
      // @ts-ignore
      const currentWeek = calendar.weeks.find((week, i) => today > Date.parse(week.date) && today <= Date.parse(calendar.weeks[i + 1]?.date));
      // @ts-ignore
      course.courseCalendar = {
        title: calendarObj.title,
        weeks: calendar.weeks,
        // @ts-ignore
        currentWeek: currentWeek
      };
    }
  } catch (e) {
    console.log("Error loading calendar");
  }
}
