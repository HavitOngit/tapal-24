<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-col gap-3">
	{#each data.entries || [] as entry}
		<p>
			{entry.id}-- {entry.title}
		</p>
	{/each}
</div>
