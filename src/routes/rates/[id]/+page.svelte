<script lang="ts">
	import { page } from '$app/stores';
	import { getAllUsedAnajs } from '$lib/api';
	import RateView from '$lib/components/RateView.svelte';
	import Rateslot from '$lib/components/Rateslot.svelte';
	import type { Rate } from '$lib/custom_types';
	import { db } from '$lib/db';
	import { liveQuery } from 'dexie';
	import { onMount } from 'svelte';
	import { parse } from 'svelte/compiler';

	const id = parseInt($page.params.id);

	const list = liveQuery(() => db.rate.where({ rate_unit_id: id }).toArray());

	onMount(async () => {
		console.log(await getAllUsedAnajs(id));
	});
</script>

{$page.params.id}

<div class="flex flex-col items-center justify-center">
	{#each $list || [] as detail}
		<!-- <RateView rateDetails={detail}></RateView> -->
		<Rateslot rateDetails={detail}></Rateslot>
	{/each}
</div>
