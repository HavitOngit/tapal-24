<script lang="ts">
	import type { oneRate } from '$lib/custom_types';
	import { CalculatorIcon } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import Card from '../ui/card/card.svelte';
	import Table from '../ui/table/table.svelte';
	import TableRow from '../ui/table/table-row.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Label from '../ui/label/label.svelte';
	import Input from '../ui/input/input.svelte';
	import { t } from 'svelte-intl-precompile';
	import ItemCalc from './item-calc.svelte';
	interface Onevouture {
		name: string;
		value: number;
		holding?: number;
	}
	interface calcData {
		name: number;
		money: number;
		used: number;
		hajari: number;
		items: {
			rate_data: oneRate;
			money: number;
			used: number;
			vauture: Onevouture[];
		}[];
	}

	export let data: calcData;
	let TriggerBtn: HTMLButtonElement;
	let recalculate: boolean = false;

	function calcUsed(i) {
		let total = 0;
		data.items.forEach((i) => {
			total += i.used;
		});
		data.used = total;
	}

	$: calcUsed(recalculate);
</script>

<div class="relative my-2 flex items-center justify-between">
	<hr
		class="absolute left-0 right-0 top-1/2 z-0 -translate-y-1/2 transform border-t border-gray-300"
	/>
	<p class="relative z-10 m-2 inline-block bg-white px-4 text-lg text-gray-800 opacity-80">
		{data.name}% | {data.hajari}
	</p>
	<p
		class="relative z-10 m-2 inline-block bg-white px-4 text-lg font-bold text-gray-800 opacity-80"
	>
		₹ {data.money}
	</p>
</div>
<div>used:{data.used}</div>
<div>left: {data.money - data.used}</div>

<div class="mx-4 flex flex-col gap-2">
	<Table>
		{#each data.items as item}
			<TableRow class="flex  justify-between p-4">
				<p>
					{item.rate_data.name}
				</p>
				<div class="flex justify-between gap-2">
					<p class="text-gray-400">
						₹ {item.money}
					</p>
					<ItemCalc bind:data={item} bind:recalculate />
				</div>
			</TableRow>
		{/each}
	</Table>
</div>
