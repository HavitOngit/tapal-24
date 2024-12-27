<script lang="ts">
	import { db } from '$lib/db';
	import { liveQuery } from 'dexie';
	import type { PageData } from './$types';

	import HajarislotG from '$lib/components/daily/hajarislotG.svelte';
	import UpdateAeInfo from '$lib/components/daily/Update_AE_info.svelte';
	import Calender from '$lib/components/extraFeatures/Calender.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Group } from '$lib/custom_types';
	import { type DateValue } from '@internationalized/date';
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';
	import { t } from 'svelte-intl-precompile';

	export let data: PageData;

	// const regs = liveQuery(() => db.group.toArray());
	let today = new Date();

	let LastDate;

	let workingDate: Date = today; // global date on which all activity stored

	$: workingDate = dayjs(workingDate.toDateString()).toDate();

	// registers are like notebooks which identify the group of students
	const registers = liveQuery(() => db.group.toArray());

	let active_Registers: Group[] = [];
	$: if ($registers) {
		active_Registers = $registers.filter((reg) => reg.currently_used);
	}

	$: submited_registers = liveQuery(async () => {
		const attendanceData = await db.attendance
			.where({ date: workingDate })
			.toArray()
			.catch((e) => console.log('error foe submited data' + e));

		return attendanceData;
	});
	// let staticSubRegs: Attendance[];
	// $: if ($submited_registers) {
	// 	staticSubRegs = [...$submited_registers];
	// 	console.log({ staticSubRegs });
	// }

	let isTodayAllWorkDone = false;

	let submited_registers_group_id: number[] = [];
	$: if ($submited_registers) {
		// console.log({ $submited_registers, workingDate }, 'color:blue');

		submited_registers_group_id = $submited_registers.map((obj) => obj.group_id);
	}

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
	const duration = { days: 1 };

	$: if (calendeDate) {
		const before = workingDate;
		const newDate = calendeDate.toDate('Asia/Kolkata');

		workingDate = dayjs(newDate).toDate();
		console.log({ before, workingDate });
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
						// console.log('from button' + { workingDate });

						calendeDate = calendeDate?.subtract(duration);
					}}
					class="text-xl">-</Button
				>

				<!-- {workingDate.toDateString()} -->
				<Calender bind:value={calendeDate} today={workingDate}></Calender>
				<!-- temp sol -->
				<Button
					on:click={() => {
						date_location += 1;
						workingDate = dayjs(workingDate).add(1, 'day').toDate();

						calendeDate = calendeDate?.add(duration);
					}}
					class="text-xl">+</Button
				>
			</Badge>
		</div>
		<div class="m-3">
			<p class="text-xl font-bold">{$t(dayjs(workingDate).format('ddd'))}</p>
		</div>
	{/if}

	{#if $registers}
		<div class="grid grid-cols-1 gap-3">
			{#each active_Registers as reg}
				{#if !submited_registers_group_id.includes(reg.id || 1000)}
					<HajarislotG RegData={reg} bind:Date={workingDate}></HajarislotG>
				{/if}
			{/each}
		</div>
	{:else}
		<div class="flex min-h-8 w-auto items-center justify-center">
			<p>{$t('No registers found')}</p>
		</div>
	{/if}

	{#if $submited_registers}
		{#if $submited_registers.length < active_Registers.length}
			<div class="relative my-2 flex items-center">
				<hr
					class="absolute left-0 right-0 top-1/2 z-0 -translate-y-1/2 transform border-t border-gray-300"
				/>
				<p class="relative z-10 m-2 inline-block bg-white px-4 text-lg text-gray-800 opacity-80">
					{$t('Submited Registers')}
				</p>
			</div>
		{/if}
		<div class="grid grid-cols-1 gap-3">
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
</div>
