<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { Rate, Rates, RegForm } from '$lib/custom_types';

	import { db } from '$lib/db';
	import { onMount } from 'svelte';
	import ListSelector from './ListSelector.svelte';
	import Input from './ui/input/input.svelte';
	import Label from './ui/label/label.svelte';
	import Switch from './ui/switch/switch.svelte';
	import Badge from './ui/badge/badge.svelte';
	import Button from './ui/button/button.svelte';
	import { z } from 'zod';

	export let data: RegForm;
	const preData: RegForm = { ...data };

	let stocklist: any;
	let ratelist: any;
	let isLoading = true;
	let dbratelist: Rates[];
	let diff: Rates[] = [];

	let competable: boolean = true;

	async function check_requrments(rateUnit: number, stockUnit: number) {
		const stocks = (await db.storage.where({ storage_unit_id: stockUnit }).toArray()).map((obj) => {
			return obj.name;
		});

		const rates = dbratelist.find((obj) => rateUnit == obj.id)?.used_anaj;

		diff = rates?.filter((name) => !stocks.includes(name)) || [];
		console.log(diff);

		competable = diff?.length == 0;
		isDone = competable;
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

	let name: string = '';
	let show_error = false;
	$: name = data.name;
	const zod_check = z.object({
		name: z.string().min(1)
	});

	$: result = zod_check.safeParse({ name });

	export let isDone: boolean;
	$: if (result.success) {
		isDone = true;
	} else {
		isDone = false;
	}
</script>

<Card.Root class="m-2">
	<Card.Content class=" flex flex-col gap-2 p-4">
		<div class="flex items-center justify-end gap-2">
			<Badge
				variant="outline"
				class="border {data.currently_used
					? 'border-green-400 text-green-600'
					: 'border-yellow-400 text-yellow-600'}"
				>{data.currently_used ? 'Active' : 'not in Use'}</Badge
			>
			<Switch bind:checked={data.currently_used}></Switch>
		</div>
		<div class="flex items-center gap-2">
			<Label>Name:</Label>
			<Input
				bind:value={data.name}
				placeholder="Enter Name"
				on:click={() => {
					show_error = true;
				}}
			/>
		</div>
		{#if result.error && show_error}
			<div>
				<Badge variant="outline" class="border-red-700 bg-red-200 text-red-600"
					>{result.error.errors[0].message}</Badge
				>
			</div>
		{/if}

		<div class="flex gap-2">
			<div>
				<Label>Boys:</Label>
				<Input bind:value={data.boys} type="number" />
			</div>
			<div>
				<Label>Girls:</Label>
				<Input bind:value={data.girls} type="number" />
			</div>
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

			{#if !competable}
				<div class="flex items-center gap-2">
					<!-- <Badge variant="outline" class="border-red-700 bg-red-200 text-red-600"
						>Some Anaj not in selected Stock
					</Badge> -->
					<Badge variant="outline" class="border-yellow-700 bg-yellow-200 text-yellow-600">
						To use this Combination First add following Anajs to selected Stock
					</Badge>
					<a href="/stocks/{data.storage_unit_id}">
						<Button>Fix</Button>
					</a>
				</div>
				<div class="flex gap-2">
					{#each diff as item}
						<Badge variant="default">
							{item}</Badge
						>
					{/each}
				</div>
			{/if}
		{/if}
	</Card.Content>
</Card.Root>
