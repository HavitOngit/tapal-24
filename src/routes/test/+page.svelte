<script lang="ts">
	import { getDateID } from '$lib/api';
	import Calender from '$lib/components/extraFeatures/Calender.svelte';
	import Regslot from '$lib/components/reg/regslot.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { db } from '$lib/db';
	import type { DateValue } from '@internationalized/date';
	import dayjs from 'dayjs';
	import { liveQuery } from 'dexie';
	import { onMount } from 'svelte';

	let today = new Date();

	let LastDate;

	let workingDate: Date = today;

	const registers = liveQuery(() => db.group.toArray());
	$: submited_registers = liveQuery(() => db.attendance.toArray());

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

	let calendeDate: DateValue | undefined;
	const duration = { days: 1 };

	$: if (calendeDate) {
		workingDate = calendeDate.toDate('Asia/Kolkata');
	}
</script>

{#if workingDate}
	<div>
		<Badge color="primary" size="large" class="mb-4 flex justify-around">
			<Button
				on:click={() => {
					workingDate = dayjs(workingDate).subtract(1, 'day').toDate();
					calendeDate = calendeDate?.subtract(duration);
				}}>-</Button
			>

			<!-- {workingDate.toDateString()} -->
			<Calender bind:value={calendeDate} today={workingDate}></Calender>
			<!-- temp sol -->
			<Button
				on:click={() => {
					workingDate = dayjs(workingDate).add(1, 'day').toDate();

					calendeDate = calendeDate?.add(duration);
				}}>+</Button
			>
		</Badge>
	</div>
{/if}

{#if $registers}
	{#each $registers as reg}
		<p>{reg.name}</p>
	{/each}
{/if}

{#if $submited_registers}
	{#each $submited_registers as hajari}
		<p>{hajari.group_id}</p>
	{/each}
{/if}
