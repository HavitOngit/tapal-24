<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import CarouselItem from '$lib/components/ui/carousel/carousel-item.svelte';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context';
	import SlideBar from '$lib/finalize/SlideBar.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let api: CarouselAPI;
</script>

<SlideBar bind:api>
	{#each Array(5) as _, i (i)}
		<CarouselItem>
			{i + 1}
		</CarouselItem>
	{/each}
</SlideBar>

<Button on:click={() => api.canScrollNext()}>Next</Button>
