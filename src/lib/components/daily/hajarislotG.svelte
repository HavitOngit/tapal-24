<script lang="ts">
	import { type Group, type oneRate, type Storage, type Usage } from '$lib/custom_types';
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
	import { z } from 'zod';
	import Badge from '../ui/badge/badge.svelte';
	import Label from '../ui/label/label.svelte';

	export let RegData: Group;
	export let Date: Date;

	// only for some simplycity

	$: workingDate = dayjs(Date);

	//attendance data
	let boys: number;
	let girls: number;
	let total: number;

	// reg stock and rate info
	let rate: oneRate[];
	let stock: Storage[];

	// for effective submission
	let effectedUsage: Usage[] = [];

	async function getInfo() {
		const rates = await db.rate
			.where({ rate_unit_id: RegData.rate_unit_id, day: workingDate.format('ddd') })
			.toArray();
		const stocks = await db.storage.where({ storage_unit_id: RegData.storage_unit_id }).toArray();
		rate = rates[0].ratelist;
		rate_Backup = [...rate]; // backup for rate
		stock = stocks;

		effectedUsage = (await db.usage
			.where('date_id')
			.above(getDateID(workingDate.toDate()))
			.toArray()) as Usage[];
		console.log('---------------');

		console.log(effectedUsage);
	}

	// Backup
	let rate_Backup: oneRate[] = [];

	// usage calculation
	const forStoarageUpdate = new Map();
	const effectiveUsageUpdate = new Map();
	let before_afterlist: any = [];
	let usage: any = [];
	let finalData: Usage[] = [];
	let isBeforeAmountNan: boolean = false;

	async function cal_usage() {
		forStoarageUpdate.clear();
		effectiveUsageUpdate.clear();

		usage = rate.map((obj) => ({
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
				storage_unit_id: number;
			}) => {
				const unit = stock.find((item) => item.name == obj.name);

				// adding
				obj.before_amount = Number(unit?.amount);
				obj.after_amount = obj.before_amount - obj.amount;

				obj.group_id = RegData.id;
				obj.date_id = getDateID(workingDate.toDate());
				obj.storage_unit_id = RegData.storage_unit_id;

				forStoarageUpdate.set(unit?.id, {
					key: unit?.id,
					changes: { amount: (unit?.amount || 0) - obj.amount }
				});

				// effective update
				const eff_anajlist = effectedUsage
					.filter((item) => item.name == obj.name)
					.sort((a, b) => a.date_id - b.date_id);
				if (eff_anajlist.length > 0) {
					obj.before_amount = eff_anajlist[0].before_amount;
					obj.after_amount = obj.before_amount - obj.amount;

					let effective_num = 0 - obj.amount;

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
			}
		);

		showRate = false;
	}

	// Savind to Database
	async function SavingToDB() {
		console.log(workingDate, Date);

		db.transaction('rw', db.usage, db.storage, db.attendance, async () => {
			await db.attendance.add({
				boys: Number(boys),
				girls: Number(girls),
				total: Number(total),
				group_id: RegData.id || 100,
				date: Date,
				date_id: getDateID(workingDate.toDate())
			});
			await db.usage.bulkAdd(usage);
			await db.storage.bulkUpdate([...forStoarageUpdate.values()]);

			if (effectiveUsageUpdate.size > 0) {
				await db.usage.bulkUpdate([...effectiveUsageUpdate.values()]);
			}
		})
			.then(() => {
				effectiveUsageUpdate.clear();
				forStoarageUpdate.clear();
				toast.success('Saved Successfully!');
			})
			.catch((err) => {
				console.log('Error Saving Data!' + err);

				toast.error('Error Saving Data!');
			});
	}

	let showRate: boolean = true;

	onMount(async () => {
		await getInfo();
		console.log('from component', workingDate.toString());
	});

	let isDone: boolean = true;
	const validate = z.object({
		boys: z.number().max(RegData.boys || 999),
		girls: z.number().max(RegData.girls || 999)
	});

	$: result = validate.safeParse({ boys, girls });
	$: if (result.error) {
		isDone = false;
	} else {
		isDone = true;
	}
</script>

<Toaster />

{#if RegData}
	<Card class="mb-2">
		<CardHeader>
			<CardTitle>
				{RegData.name}
			</CardTitle>
		</CardHeader>
		<CardContent>
			<Attendance bind:boys bind:girls bind:total></Attendance>
			{#if result.error}
				<div>
					{#each result.error.errors as error}
						<Badge variant="outline" class=" border-red-700 bg-red-100 text-red-500">
							{error.message}
						</Badge>
					{/each}
				</div>
			{/if}
		</CardContent>
		<CardFooter class="flex justify-between">
			<div>Total: {total}</div>
			<!-- <Button>Submit</Button> -->
			<AlertDialog.Root>
				<AlertDialog.Trigger on:click={cal_usage} disabled={!isDone}
					><Button disabled={!isDone}>Submit</Button></AlertDialog.Trigger
				>
				<AlertDialog.Content>
					<AlertDialog.Header class="flex ">
						<!-- <AlertDialog.Title>{workingDate.format('ddd')}</AlertDialog.Title> -->
						<AlertDialog.Description
							class="flex w-full
						justify-between"
						>
							<div class="text-left">
								<Label>
									{workingDate.format('ddd')}
								</Label>
								<p>
									total: {total}
								</p>
							</div>
							<Button
								on:click={() => {
									showRate = !showRate;
									rate = [...rate_Backup];
								}}
								variant="outline">{!showRate ? 'Change Rate' : 'Cancel'}</Button
							></AlertDialog.Description
						>
					</AlertDialog.Header>

					{#if showRate}
						<Rateform forInit={false} anajlist={rate} bind:ratelist={rate}></Rateform>
						<Button on:click={cal_usage}>Apply</Button>
					{:else}
						<UsageTable bind:usageData={usage} bind:Rates={rate}></UsageTable>
						<AlertDialog.Footer class="flex flex-row justify-around">
							<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
							<AlertDialog.Action on:click={SavingToDB}>Confirm</AlertDialog.Action>
						</AlertDialog.Footer>
					{/if}
				</AlertDialog.Content>
			</AlertDialog.Root>
		</CardFooter>
	</Card>
{/if}
