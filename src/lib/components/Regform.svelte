<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { RegForm } from '$lib/custom_types';
	import * as Select from '$lib/components/ui/select';

	import Button from './ui/button/button.svelte';
	import Input from './ui/input/input.svelte';
	import { onMount } from 'svelte';
	import { db } from '$lib/db';
	import ListSelector from './ListSelector.svelte';

	export let data: RegForm;
	let stocklist: any;
	let ratelist: any;
	let isLoading = true;
	onMount(async () => {
		const stocks = await db.storage_unit.toArray();
		stocklist = await stocks.map((obj) => {
			return { id: obj.id, name: obj.name };
		});
		const rates = await db.rates.toArray();
		ratelist = await rates.map((obj) => {
			return { id: obj.id, name: obj.name };
		});

		console.log(stocklist, ratelist);

		isLoading = false;
	});
</script>

<Card.Root>
	<Card.Content>
		<Input bind:value={data.name} placeholder="Enter Name" />
		{#if !isLoading}
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
		{/if}
	</Card.Content>
</Card.Root>
