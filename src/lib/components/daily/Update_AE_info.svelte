<script lang="ts">
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
				date_id: getDateID(workingDate.toDate())
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

		effectedUsage = (await db.usage
			.where('date_id')
			.above(getDateID(workingDate.toDate()))
			.toArray()) as Usage[];
		console.log('---------------');

		console.log(effectedUsage);

		// const effectedUsageU = effectedUsage.filter(
		// 	(obj) => obj.storage_unit_id == RegData.storage_unit_id
		// );
		// console.log('updated effected usage', effectedUsageU);

		const rates = await db.rate
			.where({ rate_unit_id: RegData.rate_unit_id, day: workingDate.format('ddd') })
			.toArray();

		const stocks = await db.storage.where({ storage_unit_id: RegData.storage_unit_id }).toArray();

		stock = stocks;

		// geting usage info
		usage = await db.usage
			.where({ group_id: RegData.id, date_id: getDateID(workingDate.toDate()) })
			.toArray();

		savedUsage = [...usage];

		usage_copy = [...usage];

		rate = usage.map((obj: { name: string; rate: number }) => ({
			name: obj.name,
			rate: obj.rate
		}));
	}

	// usage calculation
	const forStoarageUpdate = new Map();
	let before_afterlist: any = [];
	let usage: any = [];
	let finalData: Usage[] = [];
	let usage_keys: number[] = [];
	const effectiveUsageUpdate = new Map();
	let savedUsage: Usage[];

	async function cal_usage() {
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

				// adding
				obj.id = obj.id;
				obj.before_amount = Number(unit?.amount);
				obj.after_amount = obj.before_amount - obj.amount;
				obj.group_id = RegData.id;
				obj.date_id = getDateID(workingDate.toDate());
				obj.storage_unit_id = RegData.storage_unit_id;

				usage_keys.push(obj.id);

				forStoarageUpdate.set(unit?.id, {
					key: unit?.id,
					changes: { amount: obj.after_amount }
				});

				// for effective usage update

				// adding

				let effective_num = 0;
				const saved_data = savedUsage.find((item) => item.name == obj.name);
				effective_num = saved_data?.amount || 0 - obj.amount;

				effectedUsage.forEach((eff_usage) => {
					if (eff_usage.name == obj.name) {
						eff_usage.before_amount += effective_num;
						eff_usage.after_amount += effective_num;
						effectiveUsageUpdate.set(eff_usage.id, {
							key: eff_usage.id,
							changes: {
								before_amount: eff_usage.before_amount,
								after_amount: eff_usage.after_amount
							}
						});
					}
				});
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

	// for rective usage data

	// Savind to Database
	async function SavingToDB() {
		console.log(usage);

		// for deleteing
		const usage_delete = usage_copy.filter((obj) => {
			if (usage.find((item: { id: number }) => item.id == obj.id) ? false : true) {
				return obj.id;
			}
		});

		console.log(
			usage_keys,
			usage_delete.map((obj) => obj.id)
		);

		db.transaction('rw', db.usage, db.storage, db.attendance, async () => {
			await db.attendance.put({
				id: AttendanceData.id,
				boys: Number(boys),
				girls: Number(girls),
				total: Number(total),
				group_id: RegData.id || 100,
				date: workingDate.toDate(),
				date_id: getDateID(workingDate.toDate())
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
</script>

{#if RegData}
	<Card class="mb-2">
		<CardHeader>
			<CardTitle>
				{RegData.name}--{AttendanceData.date.toString()}
			</CardTitle>
		</CardHeader>
		<CardContent>
			<Attendance bind:boys bind:girls bind:total></Attendance>
		</CardContent>
		<CardFooter class="flex justify-between">
			<div>Total: {total}</div>
			<!-- <Button>Submit</Button> -->
			<AlertDialog.Root>
				<AlertDialog.Trigger on:click={cal_usage}><Button>Update</Button></AlertDialog.Trigger>
				<AlertDialog.Content>
					<AlertDialog.Header class="flex ">
						<!-- <AlertDialog.Title>{Ratedetails.day}</AlertDialog.Title> -->
						<AlertDialog.Description
							class="flex w-full
						justify-end"
							><Button
								on:click={() => {
									showRate = !showRate;
								}}
								variant="outline">{!showRate ? 'Change Rate' : 'Cancel'}</Button
							></AlertDialog.Description
						>
					</AlertDialog.Header>

					{#if showRate}
						<Rateform forInit={false} anajlist={rate} bind:ratelist={rate}></Rateform>
						<Button on:click={cal_usage}>Apply</Button>
					{:else}
						<UsageTable bind:usageData={usage}></UsageTable>
						<AlertDialog.Footer class="flex flex-row justify-around">
							<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
							<AlertDialog.Action on:click={SavingToDB}>Confirm</AlertDialog.Action>
						</AlertDialog.Footer>
					{/if}
				</AlertDialog.Content>
			</AlertDialog.Root>
			<Button on:click={status}>Status</Button>
		</CardFooter>
		{#if $live_usage_data}
			<div class="m-2 flex gap-2 overflow-x-auto">
				{#each $live_usage_data as usage}
					<AnajTile UsageData={usage}></AnajTile>
				{/each}
			</div>
		{/if}
	</Card>
	<!-- {#if $live_usage_data}
		<UsageTable bind:usageData={$live_usage_data}></UsageTable>
	{/if} -->
{/if}
