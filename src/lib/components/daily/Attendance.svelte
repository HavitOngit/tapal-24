<script lang="ts">
	import type { catogaoryWise } from '$lib/custom_types';
	import { onMount } from 'svelte';
	import { t } from 'svelte-intl-precompile';
	import Input from '../ui/input/input.svelte';
	import Label from '../ui/label/label.svelte';
	import Switch from '../ui/switch/switch.svelte';
	import TableBody from '../ui/table/table-body.svelte';
	import TableHead from '../ui/table/table-head.svelte';
	import TableHeader from '../ui/table/table-header.svelte';
	import TableRow from '../ui/table/table-row.svelte';
	import Table from '../ui/table/table.svelte';

	export let boys: number = 0;
	export let girls: number = 0;
	export let total: number = 0;
	export let catogaory_metadata: catogaoryWise[];
	export let catogaoryWise_entry = false;
	export let fortodo: boolean = false;

	$: total = Number(boys) + Number(girls);
	$: boys = Number(boys);
	$: girls = Number(girls);

	function categoryNumCalc() {
		console.log('calculating...');

		let boysc = 0;
		let girlsc = 0;
		catogaory_metadata.forEach((item) => {
			boysc += Number(item.boys);
			girlsc += Number(item.girls);
		});

		boys = boysc;
		girls = girlsc;
	}

	onMount(() => {
		categoryNumCalc();
	});
</script>

<div class="m-2 flex justify-end gap-2">
	<p class="text-left font-semibold">Catogaory Wise:</p>
	<Switch bind:checked={catogaoryWise_entry} />
</div>

{#if catogaoryWise_entry}
	{#if catogaory_metadata}
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead></TableHead>
					<TableHead>{$t('Boys')}</TableHead>
					<TableHead>{$t('Girls')}</TableHead>
					<TableHead>{$t('Total')}</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each catogaory_metadata.filter((x) => x.boys + x.girls != 0 || !fortodo) as item}
					<TableRow>
						<TableHead>{$t(item.category)}</TableHead>
						<TableHead
							><Input bind:value={item.boys} on:change={categoryNumCalc} type="number" /></TableHead
						>
						<TableHead
							><Input
								bind:value={item.girls}
								on:change={categoryNumCalc}
								type="number"
							/></TableHead
						>
						<TableHead>{Number(Number(item.boys) + Number(item.girls))}</TableHead>
					</TableRow>
				{/each}
				<TableRow class="bg-gray-200">
					<TableHead>{$t('Total')}</TableHead>
					<TableHead>{boys}</TableHead>
					<TableHead>{girls}</TableHead>
					<TableHead class="font-semibold">{total}</TableHead>
				</TableRow>
			</TableBody>
		</Table>
	{/if}
{:else}
	<div class="flex flex-col gap-2">
		<div class="flex gap-2">
			<div class="flex items-center gap-2">
				<Label>{$t('Boys')}:</Label>
				<Input bind:value={boys} placeholder="Enter Attendance" type="number" />
			</div>
			<div class="flex items-center gap-2">
				<Label>{$t('Girls')}:</Label>
				<Input bind:value={girls} placeholder="Enter Attendance" type="number" />
			</div>
		</div>
		<!-- <div class=" flex flex-row items-center gap-2">
		<Label>Total:</Label>
		<div>
			{total}
			</div>
			</div> -->
	</div>
{/if}
