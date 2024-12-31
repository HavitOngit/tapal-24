<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type { MoneyRates, oneRate } from '$lib/custom_types';
	import { t } from 'svelte-intl-precompile';
	import Input from '../ui/input/input.svelte';
	import Button from '../ui/button/button.svelte';
	import { PackagePlusIcon, SaveIcon, Trash2, XIcon } from 'lucide-svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Label from '../ui/label/label.svelte';
	import { db } from '$lib/db';
	import toast from 'svelte-french-toast';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Badge from '../ui/badge/badge.svelte';

	export let forUpdate: boolean = false;
	export let default_list: oneRate[] = [
		{
			name: $t('Vegetables'),
			rate: 0
		},
		{
			name: $t('Spice'),
			rate: 0
		},
		{
			name: $t('fuel'),
			rate: 0
		},
		{
			name: $t('flour'),
			rate: 0
		}
	];
	export let RateName = '';
	export let id: number = 0;
	export let totalRate: number = 0;

	function remove(index: number) {
		default_list.splice(index, 1);
		default_list = [...default_list];
		total();
	}

	function add() {
		default_list = [
			...default_list,
			{
				name: $t(''),
				rate: 0
			}
		];
	}

	async function save() {
		if (RateName.length < 1) {
			TriggerBtn.click();
			return;
		}

		let anyEmpty = false;

		default_list.forEach((item) => {
			if (item.name.length < 1) {
				anyEmpty = true;
			}
		});

		if (anyEmpty) {
			toast.error('Please fill all fields');
			return;
		}
		db.transaction('rw', db.money_rates, async () => {
			const data: MoneyRates = {
				name: RateName,
				rates: default_list,
				total: totalRate
			};
			if (forUpdate) {
				data.id = id;
			}
			await db.money_rates.put(data);
		})
			.then(() => {
				if (forUpdate) {
					forUpdate = false;
					toast.success('Updated successfully');
					goto('/money/rates/' + id);
				} else {
					toast.success('Rate added successfully');
					goto('/money/rates');
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error('An error occurred');
			});
	}

	function total() {
		let total = 0;
		default_list.forEach((item) => {
			total += Number(item.rate);
		});
		totalRate = total;
	}

	$: isDuplicate = db_rates.some((rate) => rate.name === RateName);

	let db_rates: MoneyRates[] = [];
	onMount(async () => {
		try {
			db_rates = await db.money_rates.toArray();
		} catch (error) {
			console.log(error);
		}
	});

	let TriggerBtn: HTMLButtonElement;
	let CancelBtn: HTMLButtonElement;
</script>

<div id="alerts" class="hidden">
	<AlertDialog.Root>
		<AlertDialog.Trigger bind:el={TriggerBtn}></AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title class="flex justify-between"></AlertDialog.Title>
				<AlertDialog.Description class="flex flex-col items-start justify-start gap-6 p-2">
					<Label class="text-xl font-medium">{$t('Name')}</Label>
					<Input bind:value={RateName} class="mb-4" type="text" autofocus />
					{#if isDuplicate}
						<p class="text-red-500">{$t('Name already exists')}</p>
					{/if}
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel
					><button bind:this={CancelBtn}>{$t('Cancel')}</button></AlertDialog.Cancel
				>
				<AlertDialog.Action on:click={save}>{$t('Submit')}</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>

<div class="mx-2 my-4 flex justify-between">
	<div>
		{#if forUpdate}
			<Button variant="outline" class="rounded-full" on:click={() => goto('/money/rates/' + id)}>
				<XIcon class="text-red-500"></XIcon>
			</Button>
		{:else}
			<Badge variant="outline" class="rounded-xl bg-green-100 p-4 text-green-700">{$t('New')}</Badge
			>
		{/if}
	</div>
	<div class="grid grid-rows-2 gap-2 text-right">
		<p class="text-gray-400">Total</p>
		<p class="text-2xl font-semibold text-gray-700">{totalRate}</p>
	</div>
</div>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>{$t('Name')}</Table.Head>

			<Table.Head>{$t('Rate')}</Table.Head>
		</Table.Row>
	</Table.Header>

	<Table.Body>
		{#each default_list as anaj, i}
			<Table.Row>
				<Table.Cell class="font-medium">
					<Input bind:value={anaj.name} type="text" placeholder="enter name" />
				</Table.Cell>
				<Table.Cell class="flex gap-2">
					<Input bind:value={anaj.rate} on:change={total} type="number" placeholder="enter rate" />

					<Button
						class=" rounded-sm"
						variant="ghost"
						on:click={() => {
							remove(i);
						}}
					>
						<Trash2></Trash2>
					</Button>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

<div>
	<Button on:click={add} class="  m-2 ml-4 gap-2 rounded-lg" variant="outline">
		<PackagePlusIcon></PackagePlusIcon>
		{$t('Add')}</Button
	>
</div>

<div class="fixed bottom-24 w-full">
	<div class="mx-4 flex w-auto justify-between gap-10 bg-white">
		<Button on:click={save} class="w-full gap-2 rounded-lg p-2">
			<SaveIcon></SaveIcon>
			{#if forUpdate}
				{$t('Update')}
			{:else}
				{$t('Save')}
			{/if}
		</Button>
	</div>
</div>
