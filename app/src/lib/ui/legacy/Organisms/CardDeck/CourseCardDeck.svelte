<script lang="ts">
  import { CourseCard } from "$lib/ui/legacy";
  import type { CourseSummary } from "$lib/services/utils/course";
  export let los: CourseSummary[] = [];
</script>

<div class="bg-surface-100-800-token mx-auto mb-2 w-11/12 max-w-full place-items-center overflow-hidden rounded-xl p-4">
  <div class="flex flex-wrap justify-center">
    {#each los as lo}
      <CourseCard {lo} />
    {/each}
  </div>
</div>
