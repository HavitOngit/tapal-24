<script lang="ts">
	import type { oneRate } from '$lib/custom_types';
	import { onMount } from 'svelte';
	import TableRow from '../ui/table/table-row.svelte';
	import Table from '../ui/table/table.svelte';
	import Badge from '../ui/badge/badge.svelte';
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
	let extraValue = 0;

	function extra() {
		let total = 0;
		data.items.forEach((i) => {
			const st = i.money.toString().split('.');
			if (st.length == 2) {
				const num = Number(st[0]);
				const v = i.money - num;
				console.log(v);
				total += v;
			}
		});
		extraValue = total;
	}

	function calcUsed(rect) {
		let total = 0;
		data.items.forEach((i) => {
			total += i.used;
		});
		data.used = total;
		extra();
	}

	$:calcUsed(data.money);

	
</script>



<div class="relative my-2 flex items-center justify-between">
	<hr
		class="absolute left-0 right-0 top-1/2 z-0 -translate-y-1/2 transform border-t border-gray-300"
	/>
	<p class="relative z-10 m-2 inline-block bg-white px-4 text-lg text-gray-800 opacity-80">
		{data.name}%
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
					{item.rate_data.name} | {item.rate_data.rate}
				</p>
				<p>{item.money}</p>
			</TableRow>
		{/each}
	</Table>
	<div class="">
		<Badge>

			{Number(extraValue.toFixed(0))}
		</Badge>
	</div>
</div>
