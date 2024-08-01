<script lang="ts">
	import { getDateID } from '$lib/api';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { type Group, type oneRate, type Storage, type Usage } from '$lib/custom_types';
	import { db } from '$lib/db';
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { z } from 'zod';
	import Rateform from '../Rateform.svelte';
	import Badge from '../ui/badge/badge.svelte';
	import Button from '../ui/button/button.svelte';
	import CardContent from '../ui/card/card-content.svelte';
	import CardFooter from '../ui/card/card-footer.svelte';
	import CardHeader from '../ui/card/card-header.svelte';
	import CardTitle from '../ui/card/card-title.svelte';
	import Card from '../ui/card/card.svelte';
	import Label from '../ui/label/label.svelte';
	import Attendance from './Attendance.svelte';
	import UsageTable from './UsageTable.svelte';
	import { goto } from '$app/navigation';
	import { t } from 'svelte-intl-precompile';

	export let RegData: Group;
	export let Date: Date;

	// only for some simplycity

	$: workingDate = dayjs(Date);

	//attendance data
	let boys: number;
	let girls: number;
	let total: number;

	// reg stock and rate info
	let rate: oneRate[] | [];
	let stock: Storage[];

	// for effective submission
	let effectedUsage: Usage[] = [];

	async function getInfo(workingDate: dayjs.Dayjs) {
		const rates = await db.rate.get({
			rate_unit_id: RegData.rate_unit_id,
			day: workingDate.format('ddd')
		});
		const stocks = await db.storage.where({ storage_unit_id: RegData.storage_unit_id }).toArray();
		rate = rates?.ratelist || [];
		rate_Backup = [...rate]; // backup for rate
		stock = stocks;

		effectedUsage = (await db.usage.where('date').above(workingDate.toDate()).toArray()) as Usage[];
		console.log('---------------');

		console.log(effectedUsage);
	}

	$: getInfo(workingDate);
	// Backup
	let rate_Backup: oneRate[] = [];

	// usage calculation
	const forStoarageUpdate = new Map();
	const effectiveUsageUpdate = new Map();
	let before_afterlist: any = [];
	let usage: any = [];
	let finalData: Usage[] = [];
	let isBeforeAmountNan: boolean = false;
	let not_in_storage: { name: string }[] = [];

	async function cal_usage() {
		// checking storage
		not_in_storage = [];
		rate.forEach((r) => {
			if (!stock.find((s) => r.name === s.name)) {
				not_in_storage.push({ name: r.name });
			}
		});

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
		if (not_in_storage.length > 0) {
			stock_nf_btn.click();
			return;
		}
		console.log(workingDate, Date);

		db.transaction('rw', db.usage, db.storage, db.attendance, async () => {
			await db.attendance.add({
				boys: Number(boys),
				girls: Number(girls),
				total: Number(total),
				group_id: RegData.id || 100,
				date: Date,
				date_id: workingDate.toDate().getTime()
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
		await getInfo(workingDate);
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

	let stock_nf_btn: HTMLButtonElement;
</script>

<Toaster />

<div hidden>
	<AlertDialog.Root>
		<AlertDialog.Trigger bind:el={stock_nf_btn}></AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Following Anajs Not in Stocks</AlertDialog.Title>
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
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
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
			<div>{$t('Total')}: {total}</div>
			<!-- <Button>Submit</Button> -->
			<AlertDialog.Root>
				<AlertDialog.Trigger on:click={cal_usage} disabled={!isDone}
					><Button disabled={!isDone}>{$t('Submit')}</Button></AlertDialog.Trigger
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
									{$t(workingDate.format('ddd'))}
								</Label>
								<p>
									{$t('Total')}: {total}
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
