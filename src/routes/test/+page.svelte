<script lang="ts">
	import { page } from '$app/stores';
	import { getDateID } from '$lib/api';
	import HajarislotG from '$lib/components/daily/hajarislotG.svelte';
	import UpdateAeInfo from '$lib/components/daily/Update_AE_info.svelte';
	import Calender from '$lib/components/extraFeatures/Calender.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { db } from '$lib/db';
	import { cleanDateId, workingDate } from '$lib/stores';
	import type { DateValue } from '@internationalized/date';
	import dayjs from 'dayjs';
	import { liveQuery } from 'dexie';

	let calendeDate: DateValue | undefined;
	const duration = { days: 1 };

	$: if (calendeDate) {
		$workingDate = calendeDate.toDate('Asia/Kolkata');
	}

	let submited_registers: number[] = [];

	const registers = liveQuery(() => db.group.toArray());
	$: AttendanceData = liveQuery(() =>
		db.attendance
			.where('date_id')
			.equals($cleanDateId)
			.toArray()
			.then((data) => {
				submited_registers = data.map((obj) => obj.group_id);
				alert('submited_registers: ' + data.length);
				return data;
			})
	);
</script>

<div class="m-2">
	{#if workingDate}
		<div>
			<Badge color="primary" size="large" class="mb-4 flex justify-around">
				<Button
					on:click={() => {
						$workingDate = dayjs($workingDate).subtract(1, 'day').toDate();
						calendeDate = calendeDate?.subtract(duration);
					}}>-</Button
				>

				<!-- {workingDate.toDateString()} -->
				<Calender bind:value={calendeDate} today={$workingDate}></Calender>
				<!-- temp sol -->
				<Button
					on:click={() => {
						$workingDate = dayjs($workingDate).add(1, 'day').toDate();

						calendeDate = calendeDate?.add(duration);
					}}>+</Button
				>
			</Badge>
		</div>
	{/if}

	{#if $registers}
		{#each $registers || [] as register}
			{#if register.currently_used && !submited_registers.includes(register.id || -1)}
				<HajarislotG RegData={register} bind:Date={$workingDate}></HajarislotG>
			{/if}
		{/each}
	{/if}

	{#if $AttendanceData}
		{#each $AttendanceData || [] as data}
			<UpdateAeInfo AttendanceData={data} boys={data.boys} girls={data.girls} total={data.total}
			></UpdateAeInfo>
		{/each}
	{/if}
</div>
