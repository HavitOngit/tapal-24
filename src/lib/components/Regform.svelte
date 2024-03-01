<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { Rates, RegForm } from '$lib/custom_types';

	import { db } from '$lib/db';
	import { onMount } from 'svelte';
	import ListSelector from './ListSelector.svelte';
	import Input from './ui/input/input.svelte';
	import Label from './ui/label/label.svelte';

	export let data: RegForm;
	let stocklist: any;
	let ratelist: any;
	let isLoading = true;
	let dbratelist: Rates[];

	let competable: boolean = true;

	async function check_requrments(rateUnit: number, stockUnit: number) {
		const stocks = (await db.storage.where({ storage_unit_id: stockUnit }).toArray()).map((obj) => {
			return obj.name;
		});

		const rates = dbratelist.find((obj) => rateUnit == obj.id)?.used_anaj;

		competable = rates?.every((name) => stocks.includes(name)) || false;
	}

	$: check_requrments(data.rate_unit_id, data.storage_unit_id);

	onMount(async () => {
		const stocks = await db.storage_unit.toArray();
		stocklist = await stocks.map((obj) => {
			return { id: obj.id, name: obj.name };
		});
		dbratelist = await db.rates.toArray();
		ratelist = await dbratelist.map((obj) => {
			return { id: obj.id, name: obj.name };
		});

		console.log(stocklist, ratelist);

		isLoading = false;
	});
</script>

<Card.Root class="m-2">
	<Card.Content class=" flex flex-col gap-2 p-4">
		<div class="flex items-center gap-2">
			<Label>Name:</Label>
			<Input bind:value={data.name} placeholder="Enter Name" />
		</div>
		{#if !isLoading}
			<div>
				<ListSelector
					bind:list={stocklist}
					name="Stock"
					bind:selected={data.storage_unit_id}
					saved={data.storage_unit_id}
				></ListSelector>
				<ListSelector
					bind:list={ratelist}
					name="Rate"
					bind:selected={data.rate_unit_id}
					saved={data.rate_unit_id}
				></ListSelector>
			</div>
			{competable}
		{/if}
	</Card.Content>
</Card.Root>
