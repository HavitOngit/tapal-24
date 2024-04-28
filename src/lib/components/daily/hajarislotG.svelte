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

	export let RegData: Group;
	export let Date: Date;

	// only for some simplycity

	let workingDate = dayjs(Date);

	//attendance data
	let boys: number;
	let girls: number;
	let total: number;

	// reg stock and rate info
	let rate: oneRate[];
	let stock: Storage[];

	async function getInfo() {
		const rates = await db.rate
			.where({ rate_unit_id: RegData.rate_unit_id, day: workingDate.format('ddd') })
			.toArray();
		const stocks = await db.storage.where({ storage_unit_id: RegData.storage_unit_id }).toArray();
		rate = rates[0].ratelist;
		stock = stocks;
	}

	// usage calculation
	let forStoarageUpdate: any = [];
	let before_afterlist: any = [];
	let usage: any = [];
	let finalData: Usage[] = [];

	async function cal_usage() {
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
			}) => {
				const unit = stock.find((item) => item.name == obj.name);

				// adding
				obj.before_amount = Number(unit?.amount);
				obj.after_amount = obj.before_amount - obj.amount;
				obj.group_id = RegData.id;
				obj.date_id = getDateID(workingDate.toDate());

				forStoarageUpdate.push({
					key: unit?.id,
					changes: { amount: obj.after_amount }
				});
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
			await db.storage.bulkUpdate(forStoarageUpdate);
		})
			.then(() => {
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
	});
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
		</CardContent>
		<CardFooter class="flex justify-between">
			<div>Total: {total}</div>
			<!-- <Button>Submit</Button> -->
			<AlertDialog.Root>
				<AlertDialog.Trigger on:click={cal_usage}><Button>Submit</Button></AlertDialog.Trigger>
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
		</CardFooter>
	</Card>
{/if}
