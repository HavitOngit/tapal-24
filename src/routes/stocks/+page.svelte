<script lang="ts">
	import CreateStorage from '$lib/components/CreateStorage.svelte';
	import type { PageData } from './$types';
	import { db } from '$lib/db';
	import { liveQuery } from 'dexie';
	import PlusButton from '$lib/finalize/PlusButton.svelte';
	import StockProfile from '$lib/components/stocks/StockProfile.svelte';
	import { t } from 'svelte-intl-precompile';

	const storage_units = liveQuery(() => db.storage_unit.toArray());
	const regis = liveQuery(() => db.group.toArray());
</script>

<div class="m-3 my-5">
	<p class="text-xl font-bold">{$t('stocks')}</p>
</div>

{#if $storage_units && $regis}
	<div class="m-2 flex flex-col gap-2">
		{#each $storage_units || [] as unit}
			{#if $regis.find((reg) => reg.storage_unit_id == unit.id)}
				<a href="/stocks/{unit.id}">
					<StockProfile stock={unit}></StockProfile>
				</a>
			{/if}
		{/each}
		{#each $storage_units || [] as unit}
			{#if !$regis.find((reg) => reg.storage_unit_id == unit.id)}
				<a href="/stocks/{unit.id}">
					<StockProfile stock={unit}></StockProfile>
				</a>
			{/if}
		{/each}
	</div>
{/if}

<PlusButton></PlusButton>
