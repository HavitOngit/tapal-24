<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { t } from 'svelte-intl-precompile';

	import * as Card from '$lib/components/ui/card';
	import type { Storage } from '$lib/custom_types';
	import { db } from '$lib/db';
	import { anajlist } from '$lib/predefined';
	import { type DateValue, today as ctime } from '@internationalized/date';
	import { liveQuery } from 'dexie';
	import { CircleFadingPlusIcon } from 'lucide-svelte';
	import toast from 'svelte-french-toast';
	import Calender from './extraFeatures/Calender.svelte';
	import MonthSelector from './reg/MonthSelector.svelte';
	import Badge from './ui/badge/badge.svelte';
	import Input from './ui/input/input.svelte';
	import Label from './ui/label/label.svelte';

	export let anaj: Storage;
	export let forStorageView: boolean = false;
	export let deleteMode: boolean = false;

	let addAmount: number = 0;

	$: sum = Number(addAmount) + Number(anaj.amount);

	async function addToStore() {
		if (Number(selectedOperation) === 2) {
			await DedctionToStore();
			return;
		} else if (Number(selectedOperation) === 3) {
			await SetTostore();
			return;
		}
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
			cal_effect.clear();
			addAmount = 0;
		});
	}
	async function DedctionToStore() {
		sum = Number(anaj.amount) - Number(addAmount);
		const cal_effect = new Map();
		if ($effectedUsage.length > 0) {
			$effectedUsage.forEach((x) => {
				if (x.name === anaj.name) {
					cal_effect.set(x.id, {
						key: x.id,
						changes: {
							before_amount: x.before_amount - Number(addAmount),
							after_amount: x.after_amount - Number(addAmount)
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
				amount: Number(-addAmount),
				date: workingDate,
				date_id: workingDate.getTime()
			});
			await db.usage.bulkUpdate([...cal_effect.values()]);
			await db.storage.update(anaj.id, { amount: sum });
		}).then(() => {
			toast.success(`${Number(-addAmount)} kg Dedcted to ${anaj.name}`);
			cal_effect.clear();
			addAmount = 0;
		});
	}

	async function SetTostore() {
		if ($effectedUsage.length === 0) {
			db.transaction('rw', db.storage, db.storage_history, db.usage, async () => {
				await db.storage.update(anaj.id, { amount: Number(addAmount) });
			}).then(() => {
				toast.success(`${thatTime}➡️${Number(addAmount)}`);
				cal_effect.clear();
				addAmount = 0;
			});
			return;
		}

		const thatTime = Number($effectedUsage[0].before_amount);

		const needstoamount = thatTime - Number(addAmount);
		const cal_effect = new Map();

		if (needstoamount < 0) {
			if ($effectedUsage.length > 0) {
				$effectedUsage.forEach((x) => {
					if (x.name === anaj.name) {
						cal_effect.set(x.id, {
							key: x.id,
							changes: {
								before_amount: x.before_amount - Number(needstoamount),
								after_amount: x.after_amount - Number(needstoamount)
							}
						});
					}
				});

				// console.log(cal_effect);
			}
		} else if (needstoamount > 0) {
			if ($effectedUsage.length > 0) {
				$effectedUsage.forEach((x) => {
					if (x.name === anaj.name) {
						cal_effect.set(x.id, {
							key: x.id,
							changes: {
								before_amount: x.before_amount - Number(needstoamount),
								after_amount: x.after_amount - Number(needstoamount)
							}
						});
					}
				});

				// console.log(cal_effect);
			}
		}

		// console.log({
		// 	thatTime,
		// 	needstoamount,
		// 	cal_effect,
		// 	addAmount,
		// 	$effectedUsage,
		// 	filtered_needs: Number(needstoamount)
		// });

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
			// await db.storage.update(anaj.id, { amount: sum });
		}).then(() => {
			toast.success(`${thatTime}➡️${Number(addAmount)}`);
			cal_effect.clear();
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

	let add = true;

	const operations = [
		{
			label: $t('Add'),
			value: 1
		},
		{
			label: $t('Deduction'),
			value: 2
		},
		{
			label: $t('Set'),
			value: 3
		}
	];

	let selectedOperation = 1;
</script>

<div id="alerts" hidden>
	<AlertDialog.Root>
		<AlertDialog.Trigger bind:el={addbtn}></AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title class="flex justify-between">
					<div class="w-32">
						<MonthSelector
							bind:selected={selectedOperation}
							groupName="Operation"
							list={operations}
						/>
					</div>
					<div>
						<Calender bind:value={date}></Calender>
					</div>
				</AlertDialog.Title>
				<AlertDialog.Description class="flex flex-col items-start justify-start gap-6">
					<div class="text-lg">
						{$t('Currently')}
						{$t('Avalable')}:
						{formatAmount(anaj.amount)} kg
					</div>
					{#if $effectedUsage && $effectedUsage.length > 0}
						<div class="text-lg">
							{$t('that Time')}: {formatAmount($effectedUsage[0].before_amount)} kg
						</div>
					{/if}

					<div>
						<form on:submit={addToStore} class=" flex items-center gap-3">
							<Label class="text-lg font-medium">{$t('quantity')}:</Label>
							<Input bind:value={addAmount} type="number" autofocus />
						</form>
					</div>
					<!-- <Button on:click={SetTostore}>Check</Button> -->
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>{$t('Cancel')}</AlertDialog.Cancel>
				<AlertDialog.Action on:click={addToStore} type="submit"
					>{add ? $t('ADD') : $t('dedction')}</AlertDialog.Action
				>
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
			<div class=" relative mt-4 h-24 w-24 flex-none bg-orange-500">
				<img
					src={anajlist.find((obj) => obj.name == anaj.name)?.image || '/anaj_images/avg.png'}
					alt={anaj.name}
					class=" h-24 w-24 object-fill"
				/>
			</div>

			<div class="mt-3 flex flex-col flex-wrap">
				<div class="text-lg font-medium">
					{$t(anaj.name)}
				</div>
				{#if forStorageView}
					<div class="flex flex-col">
						<div class="flex flex-wrap items-center gap-2 text-nowrap text-lg">
							{$t('Avalable')} :

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
										<CircleFadingPlusIcon></CircleFadingPlusIcon>{$t('add')}</Badge
									>
								</button>
							{/if}
						</div>
					</div>
				{:else}
					<div class="flex items-center">
						<div>{$t('quantity')}</div>
						<div><Input bind:value={anaj.amount} type="number" class="w-full" /></div>
					</div>
				{/if}
			</div>
		</div>
	</Card.Content>
</Card.Root>
