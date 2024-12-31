<script lang="ts">
	import RateOne from '$lib/components/money/rate-one.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { db } from '$lib/db';
	import PlusButton from '$lib/finalize/PlusButton.svelte';
	import { liveQuery } from 'dexie';
	import { t } from 'svelte-intl-precompile';

	const rates = liveQuery(() => db.money_rates.toArray());
</script>

<div class="m-3 my-5 flex items-center justify-between">
	<p class="text-xl font-bold">{$t('Money Rates')}</p>
</div>

{#if $rates}
	<div class="m-2 flex flex-col gap-3">
		{#each $rates as rate}
			<a href="rates/{rate.id}">
				<RateOne data={rate}></RateOne>
			</a>
		{/each}
	</div>
{:else if $rates === undefined}
	<p>{$t('no Data Found')}</p>
{:else}
	<p>Loading...</p>
{/if}

<PlusButton></PlusButton>
