<script lang="ts">
	import { page } from '$app/stores';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Card from '$lib/components/ui/card';
	import type { Storage } from '$lib/custom_types';
	import { db } from '$lib/db';
	import { anajlist } from '$lib/predefined';
	import { type DateValue } from '@internationalized/date';
	import { liveQuery } from 'dexie';
	import { CircleFadingPlusIcon } from 'lucide-svelte';
	import toast from 'svelte-french-toast';
	import Calender from './extraFeatures/Calender.svelte';
	import Badge from './ui/badge/badge.svelte';
	import Input from './ui/input/input.svelte';
	import Label from './ui/label/label.svelte';

	export let anaj: Storage;
	export let forStorageView: boolean = false;
	export let deleteMode: boolean = false;

	let addAmount: number = 0;

	$: sum = Number(addAmount) + Number(anaj.amount);

	async function addToStore() {
		db.transaction('rw', db.storage, db.storage_history, async () => {
			await db.storage_history.add({
				name: anaj.name,
				storage_unit_id: anaj.storage_unit_id,
				before_amount: anaj.amount,
				amount: addAmount,
				date: today,
				date_id: today.getTime()
			});
			await db.storage.update(anaj.id, { amount: sum });
		}).then(() => {
			toast.success(`${Number(addAmount)} kg added to ${anaj.name}`);

			addAmount = 0;
		});
	}

	let addbtn: HTMLButtonElement;
	const today = new Date();
	let date: DateValue | undefined;

	$: effectedUsage = liveQuery(() =>
		db.usage
			.where('date')
			.above(date?.toDate('Asia/Kolkata'))
			.filter((x) => x.storage_unit_id === anaj.storage_unit_id)
			.toArray()
	);

	$: thatday = liveQuery(() =>
		db.usage
			.where({ date: date?.toDate('Asia/Kolkata'), storage_unit_id: anaj.storage_unit_id })
			.toArray()
	);

	$: if ($thatday) {
		console.log($thatday);
	}
</script>

<div id="alerts" hidden>
	<AlertDialog.Root>
		<AlertDialog.Trigger bind:el={addbtn}></AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title class="flex justify-between">
					<div class="text-xl">
						Add to {anaj.name}
					</div>
					<div>
						<Calender bind:value={date}></Calender>
					</div>
				</AlertDialog.Title>
				<AlertDialog.Description class="flex flex-col items-start justify-start gap-6">
					<div class="text-lg">
						Available: {Number(anaj.amount.toFixed(3))}
					</div>

					<div>
						<form on:submit={addToStore} class=" flex items-center gap-3">
							<Label class="text-lg font-medium">Amount:</Label>
							<Input bind:value={addAmount} type="number" autofocus />
							<!-- <Label class="text-lg font-medium">Amount:</Label>
						<Input bind:value={addAmount} type="number" autofocus /> -->
						</form>
					</div>
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action on:click={addToStore} type="submit">ADD</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>
<Card.Root>
	<Card.Content>
		{#if deleteMode}
			<div class=" absolute right-4 flex justify-end p-3">
				<slot />
			</div>
		{/if}
		<div class="flex space-x-3">
			<a href="/stocks/{$page.params.id}/{anaj.id}">
				<div class=" relative mt-4 h-24 w-24 flex-none bg-orange-500">
					<img
						src={anajlist.find((obj) => obj.name == anaj.name)?.image || '/anaj_images/avg.png'}
						alt={anaj.name}
						class=" h-24 w-24 object-fill"
					/>
				</div>
			</a>

			<div class="mt-3 flex flex-col flex-wrap">
				<div class="text-lg font-medium">
					{anaj.name}
				</div>
				{#if forStorageView}
					<div class="flex flex-col">
						<div class="flex flex-wrap items-center gap-2 text-nowrap text-lg">
							Avalable :
							<!-- <Badge variant="outline" class="text-lg font-semibold">
								{anaj.amount} kg
							</Badge> -->
							<div class="text-nowrap text-lg font-semibold">
								{Number(anaj.amount.toFixed(3))}
							</div>
							{#if !deleteMode}
								<button
									on:click={() => {
										addbtn.click();
									}}
								>
									<Badge variant="outline" class="flex gap-1 text-base">
										<CircleFadingPlusIcon></CircleFadingPlusIcon>
										add
									</Badge>
								</button>
							{/if}
						</div>
					</div>
				{:else}
					<div class="flex flex-row">
						<div>Amount:</div>
						<div><input bind:value={anaj.amount} class="w-full" /></div>
					</div>
				{/if}
			</div>
			<!-- <input type="checkbox" bind:group={selected} value={{ name: anaj.name, amount: 0 }} /> -->
		</div>
	</Card.Content>
</Card.Root>
