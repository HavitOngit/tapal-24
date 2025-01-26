<script lang="ts">
	import type { oneRate } from '$lib/custom_types';
	import { CalculatorIcon, IndianRupeeIcon, PackagePlus, Trash2Icon } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import Card from '../ui/card/card.svelte';
	import Table from '../ui/table/table.svelte';
	import TableRow from '../ui/table/table-row.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Label from '../ui/label/label.svelte';
	import Input from '../ui/input/input.svelte';
	import { number, t } from 'svelte-intl-precompile';
	import TableHeader from '../ui/table/table-header.svelte';
	import TableHead from '../ui/table/table-head.svelte';
	import TableBody from '../ui/table/table-body.svelte';

	interface Onevouture {
		name: string;
		value: number;
		holding: number;
		price: number;
	}
	interface item {
		rate_data: oneRate;
		money: number;
		used: number;
		vauture: Onevouture[];
	}

	export let data: item;
	export let recalculate: boolean;

	function calcUsage() {
		let total = 0;
		data.vauture.forEach((i) => {
			const v = Number(i.price);
			i.holding = Number(i.holding);
			i.value = v * i.holding;
			total += i.value;
		});
		data.used = total;
		recalculate = !recalculate;
	}

	function additem() {
		const defaultItem = { name: '', value: 0, holding: 1, price: 1 };
		data.vauture.push(defaultItem);
		calcUsage();
	}

	function deleteItem(index: number) {
		data.vauture.splice(index, 1);
		calcUsage();
	}
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger><CalculatorIcon size={24}></CalculatorIcon></AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title class="flex justify-between"></AlertDialog.Title>

			<AlertDialog.Description class="flex flex-col gap-2">
				<div class="flex flex-col gap-2">
					<div class="flex justify-between">
						<p class="text-2xl text-gray-600">
							{$t(data.rate_data.name)} | {data.rate_data.rate}
						</p>
						<div class="flex flex-col text-right">
							<p class="text-right text-gray-400">Total</p>
							<div class="flex items-baseline justify-end gap-1">
								<IndianRupeeIcon size={22}></IndianRupeeIcon>
								<p class="text-2xl font-semibold text-gray-700">{data.money}</p>
							</div>
						</div>
					</div>
					<div class="m-1 flex justify-between text-lg text-gray-400">
						<p>{$t('used')}: {data.used}</p>
						<p>{$t('left')}: {data.money - data.used}</p>
					</div>
				</div>
				<Table class="my-4">
					{#each data.vauture as item, i}
						<TableRow class="flex justify-evenly gap-4 p-2">
							<Input bind:value={item.name} type="text" placeholder="name" />
							<div class="grid grid-cols-2">
								<Input bind:value={item.holding} type="number" on:change={calcUsage} />
								<Input bind:value={item.price} type="number" on:change={calcUsage} />
							</div>
							<p>{item.value}</p>
							<button
								on:click={() => {
									deleteItem(i);
								}}
							>
								<Trash2Icon></Trash2Icon>
							</button>
						</TableRow>
					{/each}
				</Table>
				<Button disabled={data.used > data.money} class="mt-2" on:click={additem} variant="outline">
					<PackagePlus></PackagePlus>
					<p class="ml-2 text-gray-400">{$t('Add')}</p>
				</Button>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Action type="submit" disabled={data.used > data.money}
				>{$t('Submit')}</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
