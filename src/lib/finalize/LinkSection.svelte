<script lang="ts">
	import type { MoreLinkSection } from '$lib/custom_types';
	import { BoxIcon } from 'lucide-svelte';

	export let sectionName: string = '';
	export let list: MoreLinkSection[] = [];
</script>

<p class="m-2 text-2xl">{sectionName}</p>
<div class="flex gap-2">
	{#each list as data}
		<a href={data.href}>
			<div class="grid grid-rows-2 items-center justify-center">
				<!-- <svelte:component this={data.icon}></svelte:component> -->
				<div class="flex justify-center">
					<BoxIcon></BoxIcon>
				</div>
				<span class="text-clip text-center text-lg">{data.name}</span>
			</div>
		</a>
	{/each}
</div>
