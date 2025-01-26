<script lang="ts">
	import type { MoneyRates } from '$lib/custom_types';
	import Card from '../ui/card/card.svelte';
	import Property from './property.svelte';
	import { t } from 'svelte-intl-precompile';

	export let Rate: MoneyRates;
	export let attendance: number = 0;
	export let Amount: number = 0;
	export let allocatedMoney: number = 0;
</script>

{#if Rate}
	<Card class="m-2 flex flex-col gap-5 p-4">
		<div class="grid grid-cols-3 gap-4">
			<Property name={'Rate'} value={Rate.name} />
			<Property name={'Attendance'} value={attendance} />
			<div class="relative">
				<slot />
			</div>
		</div>
		<div class="flex flex-col gap-2">
			<p class="text-xl font-semibold text-gray-500">{$t('Money')}</p>
			<hr />
			<div class="grid grid-cols-3 gap-4">
				<Property name={$t('Allocated')} value={allocatedMoney} />
				<Property name={$t('Required')} value={Amount} />
				<Property name={$t('unused')} value={Number((allocatedMoney - Amount).toFixed(3))} />
			</div>
			<div></div>
		</div></Card
	>
{/if}
