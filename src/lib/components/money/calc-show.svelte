<script lang="ts">
	import type { oneRate } from '$lib/custom_types';
	import { CalculatorIcon } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import Card from '../ui/card/card.svelte';
	import Table from '../ui/table/table.svelte';
	import TableRow from '../ui/table/table-row.svelte';

	interface Onevouture {
		name: string;
		value: number;
		holding?: number;
	}
	interface calcData {
		name: number;
		money: number;
		hajari: number;
		items: {
			rate_data: oneRate;
			money: number;
			vauture: Onevouture[];
		}[];
	}

	export let data: calcData;
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
					<button>
						<CalculatorIcon size={24}></CalculatorIcon>
					</button>
				</div>
			</TableRow>
		{/each}
	</Table>
</div>
