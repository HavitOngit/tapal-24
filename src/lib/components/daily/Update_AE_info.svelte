<script lang="ts">
	import { t } from 'svelte-intl-precompile';
	import {
		type Group,
		type oneRate,
		type Storage,
		type Usage,
		type Attendance as attendanceType
	} from '$lib/custom_types';
	import CardHeader from '../ui/card/card-header.svelte';
	import Card from '../ui/card/card.svelte';
	import CardTitle from '../ui/card/card-title.svelte';
	import CardContent from '../ui/card/card-content.svelte';
	import Attendance from './Attendance.svelte';
	import Rateform from '../Rateform.svelte';
	import UsageTable from './UsageTable.svelte';
	import Button from '../ui/button/button.svelte';
	import CardFooter from '../ui/card/card-footer.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { db } from '$lib/db';
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';
	import { getDateID } from '$lib/api';
	import toast, { Toaster } from 'svelte-french-toast';
	import { liveQuery } from 'dexie';
	import AnajTile from '../extraFeatures/AnajTile.svelte';
	import Badge from '../ui/badge/badge.svelte';
	import { goto } from '$app/navigation';

	export let AttendanceData: attendanceType;

	let RegData: Group;

	// only for some simplycity

	$: workingDate = dayjs(AttendanceData.date);

	$: getInfo(workingDate);

	//attendance data
	export let boys: number;
	export let girls: number;
	export let total: number;

	//live data
	$: live_usage_data = liveQuery(() =>
		db.usage
			.where({
				group_id: Number(AttendanceData.group_id),
				date: workingDate.toDate()
			})
			.toArray()
	);

	$: if ($live_usage_data) {
		console.log($live_usage_data);
	}

	// reg stock and rate info
	let rate: oneRate[];
	let stock: Storage[];

	let usage_copy: Usage[];

	let effectedUsage: Usage[] = [];

	async function getInfo(workingDate: dayjs.Dayjs) {
		console.log('working...');

		RegData = (await db.group.get(AttendanceData.group_id)) as Group; // geting reg info

		// console.log(RegData);

		// effectedUsage = (await db.usage
		// 	.where('date_id')
		// 	.above(getDateID(workingDate.toDate()))
		// 	.toArray()) as Usage[];
		// console.log('---------------');

		// console.log(effectedUsage);

		// const effectedUsageU = effectedUsage.filter(
		// 	(obj) => obj.storage_unit_id == RegData.storage_unit_id
		// );
		// console.log('updated effected usage', effectedUsageU);

		db.transaction('r', db.usage, async () => {
			effectedUsage = (await db.usage
				.where('date')
				.above(workingDate.toDate())
				.toArray()) as Usage[];

			const effectedUsageU = effectedUsage.filter(
				(obj) => obj.storage_unit_id == RegData.storage_unit_id
			);
			console.log('updated effected usage', effectedUsageU);
			effectedUsage = effectedUsageU;
		});

		const rates = await db.rate
			.where({ rate_unit_id: RegData.rate_unit_id, day: workingDate.format('ddd') })
			.toArray();

		const stocks = await db.storage.where({ storage_unit_id: RegData.storage_unit_id }).toArray();

		// console.log('rates and stocks' + { rates, stocks });

		stock = stocks;

		// geting usage info
		usage = await db.usage.where({ group_id: RegData.id, date: workingDate.toDate() }).toArray();

		savedUsage = [...usage];

		usage_copy = [...usage];

		rate = usage.map((obj: { name: string; rate: number }) => ({
			name: obj.name,
			rate: obj.rate
		}));

		rateBackup = [...rate];
	}

	// backup data
	let rateBackup: { name: string; rate: number }[] = [];

	// usage calculation
	const forStoarageUpdate = new Map();
	let before_afterlist: any = [];
	let usage: any = [];
	let finalData: Usage[] = [];
	let usage_keys: number[] = [];
	const effectiveUsageUpdate = new Map();
	let savedUsage: Usage[];

	let isBeforeAmountNan: boolean = false;
	let not_in_storage: { name: string }[] = [];

	async function cal_usage() {
		console.log('calculating usage');
		console.log({
			rate,
			usage
		});
		not_in_storage = [];
		rate.forEach((r) => {
			if (!stock.find((s) => r.name === s.name)) {
				not_in_storage.push({ name: r.name });
			}
		});

		// claring storage
		forStoarageUpdate.clear();
		effectiveUsageUpdate.clear();

		usage = rate.map((obj) => ({
			id:
				usage.find((item: { name: string; id: number }) => item.name == obj.name)?.id || undefined,
			name: obj.name,
			amount: (obj.rate * total) / 1000,
			rate: Number(obj.rate),
			date: workingDate.toDate()
		}));
		const acc_eff = usage.forEach(
			(obj: {
				name: string;
				before_amount: number;
				after_amount: number;
				amount: number;
				group_id: any;
				date_id: any;
				id: number;
				storage_unit_id: number;
			}) => {
				const unit = stock.find((item) => item.name == obj.name);
				const saved_data = savedUsage.find((item) => item.name == obj.name);

				// adding
				obj.id = obj.id;
				obj.before_amount = Number(saved_data?.before_amount);
				obj.after_amount = obj.before_amount - obj.amount;
				obj.group_id = RegData.id;
				obj.date_id = workingDate.toDate().getTime();
				obj.storage_unit_id = RegData.storage_unit_id;

				// if before amount Nan
				if (isNaN(obj.before_amount)) {
					isBeforeAmountNan = true;
				}

				usage_keys.push(obj.id);

				forStoarageUpdate.set(unit?.id, {
					key: unit?.id,
					changes: { amount: (unit?.amount || 0) + (saved_data?.amount || 0) - obj.amount }
				});

				// for effective usage update

				// adding

				let effective_num = 0;
				effective_num = (saved_data?.amount || 0) - obj.amount;
				const eff_anajlist = effectedUsage.filter((item) => item.name == obj.name);
				if (eff_anajlist.length > 0) {
					eff_anajlist.forEach((eff_usage) => {
						// eff_usage.before_amount = eff_usage.before_amount + effective_num;
						// eff_usage.after_amount = eff_usage.after_amount + effective_num;
						effectiveUsageUpdate.set(eff_usage.id, {
							key: eff_usage.id,
							changes: {
								before_amount: eff_usage.before_amount + effective_num,
								after_amount: eff_usage.after_amount + effective_num
							}
						});
					});
				}
				console.log({
					effectedUsage,
					effective_num,
					saved_data,
					effectiveUsageUpdate,
					forStoarageUpdate
				});
			}
		);

		showRate = false;
	}

	// solving the problem of adding new item
	// Problem: when adding new item that added item not have before_amount
	// Solution: try to get the before_amount from the last item of the same name
	// if last item not found try to get before_amount from effective_usage
	// if effective_usage not found then use direct storage amount
	async function addingNewitem() {
		const aboveData = await db.usage.where('date').below(workingDate.toDate()).toArray();

		const belowData = await db.usage.where('date').above(workingDate.toDate()).toArray();

		usage.forEach(
			(item: {
				name: string;
				before_amount: number;
				after_amount: number;
				amount: number;
				group_id: any;
				date_id: any;
				id: number;
				storage_unit_id: number;
			}) => {
				const sortedAbove = aboveData
					.filter((obj) => obj.storage_unit_id == RegData.storage_unit_id && obj.name == item.name)
					.sort((a, b) => a.date_id - b.date_id);
				const sortedBelow = belowData
					.filter((obj) => obj.storage_unit_id == RegData.storage_unit_id && obj.name == item.name)
					.sort((a, b) => a.date_id - b.date_id);

				if (sortedAbove.length > 0) {
					const lastItem = sortedAbove[sortedAbove.length - 1];
					item.before_amount = lastItem.after_amount;
					item.after_amount = item.before_amount - item.amount;
				} else if (sortedBelow.length > 0) {
					const lastItem = sortedBelow[0];
					item.after_amount = lastItem.before_amount;
					item.before_amount = item.after_amount + item.amount;
				} else {
					const unit = stock.find((obj) => obj.name == item.name);
					item.before_amount = unit?.amount || 0;
					item.after_amount = item.before_amount - item.amount;
				}
				const unit = stock.find((obj) => item.name == obj.name);
				const saved_data = savedUsage.find((obj) => item.name == obj.name);

				forStoarageUpdate.set(unit?.id, {
					key: unit?.id,
					changes: { amount: (unit?.amount || 0) + (saved_data?.amount || 0) - item.amount }
				});
				// problem: storage update wrong update

				console.log(usage);
			}
		);
	}

	// Savind to Database
	async function SavingToDB() {
		if (not_in_storage.length > 0) {
			stock_nf_btn.click();
			return;
		}
		if (isBeforeAmountNan) {
			await addingNewitem();
		}
		console.log(usage);

		// for deleteing
		const usage_delete = usage_copy.filter((obj) => {
			if (usage.find((item: { id: number }) => item.id == obj.id) ? false : true) {
				return obj;
			}
		});

		// handling delete eefective usage update
		usage_delete.forEach((obj) => {
			const unit = stock.find((item) => item.name === obj.name);
			forStoarageUpdate.set(unit?.id, {
				key: unit?.id,
				changes: { amount: Number((unit?.amount || 0) + obj.amount) }
			});

			effectedUsage.forEach((eff_usage) => {
				if (eff_usage.name == obj.name) {
					effectiveUsageUpdate.set(eff_usage.id, {
						key: eff_usage.id,
						changes: {
							before_amount: eff_usage.before_amount + obj.amount,
							after_amount: eff_usage.after_amount + obj.amount
						}
					});
				}
			});
		});

		console.log(
			usage_keys,
			usage_delete.map((obj) => obj.id)
		);

		db.transaction('rw', db.usage, db.storage, db.attendance, async () => {
			let catogaoryWiseData = AttendanceData.catoWise;
			if (!RegData.dailyCatogaoryWise) {
				catogaoryWiseData.forEach((x) => {
					x.boys = 0;
					x.girls = 0;
				});
			}
			catogaoryWiseData.forEach((x) => {
				x.boys = Number(x.boys);
				x.girls = Number(x.girls);
			});
			await db.attendance.put({
				id: AttendanceData.id,
				boys: Number(boys),
				girls: Number(girls),
				total: Number(total),
				group_id: RegData.id || 100,
				date: workingDate.toDate(),
				date_id: getDateID(workingDate.toDate()),
				catoWise: catogaoryWiseData
			});

			await db.usage.bulkPut(usage);
			await db.storage.bulkUpdate([...forStoarageUpdate.values()]);
			await db.usage.bulkUpdate([...effectiveUsageUpdate.values()]);

			// deleting
			if (usage_delete.length > 0) {
				await db.usage.bulkDelete(usage_delete.map((obj) => obj.id));
			}
		})
			.then(() => {
				effectiveUsageUpdate.clear();
				forStoarageUpdate.clear();
				isBeforeAmountNan = false;
				toast.success('Updated Successfully!');
			})
			.catch((err) => {
				console.log('Error Saving Data!' + err);

				toast.error('Error Saving Data!');
			});
	}

	let showRate: boolean = true;

	function status() {
		console.log({
			savedUsage,
			AttendanceData,
			RegData,
			workingDate,
			rate,
			stock,
			effectedUsage,
			boys,
			girls,
			total
		});
	}

	onMount(async () => {
		await getInfo(workingDate);
		status();
	});

	let stock_nf_btn: HTMLButtonElement;
</script>

<div hidden>
	<AlertDialog.Root>
		<AlertDialog.Trigger bind:el={stock_nf_btn}></AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>{$t('Following Anajs Not in Stocks')}</AlertDialog.Title>
				<AlertDialog.Description class="flex flex-col gap-2">
					<div class="m-3 rounded-md bg-yellow-200">
						<p class="text-wrap p-2 text-left">
							In Order to use below Anajs they Must in stock of "{RegData.name}" Register
						</p>
					</div>
					<div class="m-1 ml-3 flex gap-2">
						{#each not_in_storage as nts}
							<Badge variant="default">{nts.name}</Badge>
						{/each}
					</div>
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>{$t('Cancel')}</AlertDialog.Cancel>
				<AlertDialog.Action on:click={() => goto(`/stocks/${RegData.storage_unit_id}`)}
					>Go to Stocks
				</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>

{#if RegData}
	<Card class="mb-2">
		<CardHeader>
			<CardTitle>
				{RegData.name}
			</CardTitle>
		</CardHeader>
		<CardContent>
			<Attendance
				submitedCatos={RegData.sumitedcatos}
				bind:catogaoryWise_entry={RegData.dailyCatogaoryWise}
				bind:catogaory_metadata={AttendanceData.catoWise}
				bind:boys
				bind:girls
				bind:total
				fortodo={true}
			></Attendance>
		</CardContent>
		<CardFooter class="flex justify-between">
			<div>Total: {total}</div>

			<AlertDialog.Root>
				<AlertDialog.Trigger on:click={cal_usage}
					><Button>{$t('Update')}</Button></AlertDialog.Trigger
				>
				<AlertDialog.Content>
					<AlertDialog.Header class="flex ">
						<AlertDialog.Description
							class="flex w-full
						items-center justify-between"
						>
							<div>
								Total: {total}
							</div>
							<Button
								on:click={() => {
									showRate = !showRate;

									rate = [...rateBackup];
								}}
								variant="outline">{!showRate ? 'Change Rate' : 'Cancel'}</Button
							></AlertDialog.Description
						>
					</AlertDialog.Header>

					{#if showRate}
						<Rateform forInit={false} anajlist={rate} bind:ratelist={rate}></Rateform>
						<Button on:click={cal_usage}>{$t('Apply')}</Button>
					{:else}
						<UsageTable bind:usageData={usage} bind:Rates={rate}></UsageTable>
						<AlertDialog.Footer class="flex flex-row items-center justify-between">
							<AlertDialog.Cancel>{$t('Cancel')}</AlertDialog.Cancel>
							<AlertDialog.Action on:click={SavingToDB}>{$t('Confirm')}</AlertDialog.Action>
						</AlertDialog.Footer>
					{/if}
				</AlertDialog.Content>
			</AlertDialog.Root>
		</CardFooter>
		{#if $live_usage_data}
			<div class="m-2 flex gap-2 overflow-x-auto">
				{#each $live_usage_data as usage}
					<AnajTile UsageData={usage}></AnajTile>
				{/each}
			</div>
		{/if}
	</Card>
{/if}
