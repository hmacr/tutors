<script lang="ts">
  import type { PageData } from "./$types";
  import { NoteCard, TopicNavigatorCard } from "$lib/ui/legacy";
  export let data: PageData;
</script>

{#if data.lo}
  <div class="min-h-screen flex w-11/12 mx-auto">
    <div class="flex flex-wrap justify-center w-full">
      <NoteCard lo={data.lo} />
    </div>
    <div class="hidden md:block">
      <TopicNavigatorCard topic={data.lo.parentTopic} />
    </div>
  </div>
{/if}
