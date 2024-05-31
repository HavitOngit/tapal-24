<script lang="ts">
	import { liveQuery } from 'dexie';
	import type { PageData } from './$types';
	import { db } from '$lib/db';

	import HajarislotG from '$lib/components/daily/hajarislotG.svelte';
	import { onMount } from 'svelte';
	import { Badge } from '$lib/components/ui/badge';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Attendance, Group } from '$lib/custom_types';
	import { getDateID } from '$lib/api';
	import UpdateAeInfo from '$lib/components/daily/Update_AE_info.svelte';
	import dayjs from 'dayjs';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import Calender from '$lib/components/extraFeatures/Calender.svelte';
	import type { DateValue } from '@internationalized/date';

	export let data: PageData;

	// const regs = liveQuery(() => db.group.toArray());
	let today = new Date();

	let LastDate;

	let workingDate: Date = today; // global date on which all activity stored

	// registers are like notebooks which identify the group of students
	const registers = liveQuery(() => db.group.toArray());

	let active_Registers: Group[] = [];
	$: if ($registers) {
		active_Registers = $registers.filter((reg) => reg.currently_used);
	}

	$: submited_registers = liveQuery(() =>
		db.attendance.where({ date_id: getDateID(workingDate) }).toArray()
	);

	// let staticSubRegs: Attendance[];
	// $: if ($submited_registers) {
	// 	staticSubRegs = [...$submited_registers];
	// 	console.log({ staticSubRegs });
	// }

	let isTodayAllWorkDone = false;

	let submited_registers_group_id: number[] = [];
	$: if ($submited_registers) {
		submited_registers_group_id = $submited_registers.map((obj) => obj.group_id);
	}

	$: console.log(workingDate);

	function status() {
		console.log({ workingDate, $registers, active_Registers, $submited_registers });
	}

	onMount(async () => {
		// get last date from db if exiest
		LastDate = await db.usage.orderBy('date').last();

		if (!LastDate) {
			workingDate = today;
		} else {
			LastDate.date.setDate(LastDate.date.getDate() + 1);
			workingDate = LastDate.date;
		}
	});

	let date_location = 0;
	let iiterCount = 0;

	let calendeDate: DateValue | undefined;

	$: if (calendeDate) {
		workingDate = calendeDate.toDate('Asia/Kolkata');
	}
</script>

<!--  -->

<div class="m-2 flex flex-col gap-2">
	{#if workingDate}
		<div>
			<Badge color="primary" size="large" class="mb-4 flex justify-around">
				<Button
					on:click={() => {
						date_location -= 1;
						workingDate = dayjs(workingDate).subtract(1, 'day').toDate();
					}}>-</Button
				>

				<!-- {workingDate.toDateString()} -->
				<Calender bind:value={calendeDate} today={workingDate}></Calender>
				<!-- temp sol -->
				<Button
					on:click={() => {
						date_location += 1;
						workingDate = dayjs(workingDate).add(1, 'day').toDate();
					}}>+</Button
				>
			</Badge>
		</div>
	{/if}

	{#if $registers}
		<div class="">
			{#each active_Registers as reg}
				{#if !submited_registers_group_id.includes(reg.id || 1000)}
					<HajarislotG RegData={reg} bind:Date={workingDate}></HajarislotG>
				{/if}
			{/each}
		</div>
	{:else}
		<div class="flex min-h-8 w-auto items-center justify-center">
			<p>No registers found</p>
		</div>
	{/if}

	{#if $submited_registers}
		<div>
			<hr class="my-4" />
			{#each $submited_registers as hajari}
				<UpdateAeInfo
					AttendanceData={hajari}
					boys={hajari.boys}
					girls={hajari.girls}
					total={hajari.total}
				></UpdateAeInfo>
			{/each}
		</div>
	{/if}

	<div class="bottom-0">
		<Button on:click={status}>Status</Button>
	</div>
</div>
