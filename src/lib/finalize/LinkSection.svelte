<script lang="ts">
	import type { MoreLinkSection } from '$lib/custom_types';
	import { BoxIcon } from 'lucide-svelte';

	export let sectionName: string = '';
	export let list: MoreLinkSection[] = [];
</script>

<div class="relative my-2 flex items-center">
	<hr
		class="absolute left-0 right-0 top-1/2 z-0 -translate-y-1/2 transform border-t border-gray-300"
	/>
	<p class="relative z-10 m-2 inline-block bg-white px-4 text-lg text-gray-800 opacity-80">
		{sectionName}
	</p>
</div>
<div class="mx-2 grid grid-cols-3 gap-4">
	{#each list as data}
		<a href={data.href}>
			<div class="flex flex-col gap-1">
				<!-- <svelte:component this={data.icon}></svelte:component> -->
				<div class=" flex justify-center rounded-full p-3">
					{#if data.icon}
						<svelte:component this={data.icon} class="size-7 text-gray-900"></svelte:component>
					{:else}
						<BoxIcon class="size-7"></BoxIcon>
					{/if}
				</div>
				<div class="flex flex-col items-center justify-center">
					{#each data.name.split(' ') as word}
						<span class="block text-clip text-center text-base font-medium text-gray-700"
							>{word}</span
						>
					{/each}
				</div>
			</div>
		</a>
	{/each}
</div>
<!-- <div>
	{#each colors as color}
		<div class="flex items-center gap-2">
			<div class="h-8 w-8 rounded-full bg-{color}-200"></div>
			<p class="text-gray-700">{color}</p>
		</div>
	{/each}
</div> -->
