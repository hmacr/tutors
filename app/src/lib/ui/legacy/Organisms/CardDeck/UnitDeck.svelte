<script lang="ts">
  import { UnitCard } from "$lib/ui/legacy";
  import type { Composite } from "$lib/services/models/lo-types";
  export let units: Composite[];
</script>

{#each units as unit}
  <UnitCard {unit} />
{/each}
