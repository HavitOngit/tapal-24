<script lang="ts">
	import CreateStorage from '$lib/components/CreateStorage.svelte';
	import type { PageData } from './$types';
	import { db } from '$lib/db';
	import { liveQuery } from 'dexie';
	import PlusButton from '$lib/finalize/PlusButton.svelte';
	import StockProfile from '$lib/components/stocks/StockProfile.svelte';

	const storage_units = liveQuery(() => db.storage_unit.toArray());
</script>

<div class="m-2 flex flex-col gap-2">
	{#each $storage_units || [] as unit}
		<a href="/stocks/{unit.id}">
			<StockProfile stock={unit}></StockProfile>
		</a>
	{/each}
</div>

<PlusButton></PlusButton>
