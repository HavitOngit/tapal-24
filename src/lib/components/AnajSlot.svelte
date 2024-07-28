<script lang="ts">
	import { page } from '$app/stores';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	import * as Card from '$lib/components/ui/card';
	import type { Storage } from '$lib/custom_types';
	import { db } from '$lib/db';
	import { anajlist } from '$lib/predefined';
	import { type DateValue, today as ctime } from '@internationalized/date';
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
		const cal_effect = new Map();
		if ($effectedUsage.length > 0) {
			$effectedUsage.forEach((x) => {
				if (x.name === anaj.name) {
					cal_effect.set(x.id, {
						key: x.id,
						changes: {
							before_amount: x.before_amount + Number(addAmount),
							after_amount: x.after_amount + Number(addAmount)
						}
					});
				}
			});

			console.log(cal_effect);
		}

		db.transaction('rw', db.storage, db.storage_history, db.usage, async () => {
			await db.storage_history.add({
				name: anaj.name,
				storage_unit_id: anaj.storage_unit_id,
				before_amount: anaj.amount,
				amount: Number(addAmount),
				date: workingDate,
				date_id: workingDate.getTime()
			});
			await db.usage.bulkUpdate([...cal_effect.values()]);
			await db.storage.update(anaj.id, { amount: sum });
		}).then(() => {
			toast.success(`${Number(addAmount)} kg added to ${anaj.name}`);
			addAmount = 0;
		});
	}

	let addbtn: HTMLButtonElement;
	const today = new Date(new Date().toDateString());
	let date: DateValue | undefined = ctime('Asia/Kolkata');
	$: workingDate = date?.toDate('Asia/Kolkata') || today;

	$: effectedUsage = liveQuery(() =>
		db.usage
			.where('date')
			.aboveOrEqual(date?.toDate('Asia/Kolkata'))
			.filter((x) => x.storage_unit_id === anaj.storage_unit_id)
			.sortBy('date')
	);

	$: console.log($effectedUsage);

	function formatAmount(amount: any) {
		// Check if amount is already a number
		if (typeof amount === 'number') {
			return Number(amount.toFixed(3));
		}
		// Attempt to convert to a number if it's a string
		const parsed = parseFloat(amount);
		if (!isNaN(parsed)) {
			return Number(parsed.toFixed(3));
		}
		// Handle non-numeric values
		return '0'; // Or any other fallback logic
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
						Available: {formatAmount(anaj.amount)}
					</div>
					{#if $effectedUsage && $effectedUsage.length > 0}
						<div class="text-lg">
							that Time: {formatAmount($effectedUsage[0].before_amount)}
						</div>
					{/if}

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
							{#if anaj.amount}
								<div class="text-nowrap text-lg font-semibold">
									{formatAmount(anaj.amount)} kg
								</div>
							{/if}
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
					<div class="flex items-center">
						<div>Amount:</div>
						<div><Input bind:value={anaj.amount} type="number" class="w-full" /></div>
					</div>
				{/if}
			</div>
			<!-- <input type="checkbox" bind:group={selected} value={{ name: anaj.name, amount: 0 }} /> -->
		</div>
	</Card.Content>
</Card.Root>
