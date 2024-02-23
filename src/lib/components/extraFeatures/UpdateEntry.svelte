<script lang="ts">
	import type { DateValue } from '@internationalized/date';
	import Calender from './Calender.svelte';
	import { liveQuery } from 'dexie';
	import type { Usage } from '$lib/custom_types';
	import { db } from '$lib/db';
	import { getDateID } from '$lib/api';
	import Attendance from '../daily/Attendance.svelte';

	let workingDate: DateValue | undefined;

	export let group_id: number;

	let usageData: Usage[] = [];

	async function getData() {
		const w_date = new Date(String(workingDate));
		usageData = await db.usage.where({ group_id: group_id, date_id: getDateID(w_date) }).toArray();
	}

	$: {
		console.log(`${workingDate}`);
		getData();
	}
</script>

<Calender bind:value={workingDate}></Calender>

{#each usageData as usage}
	<div>
		{usage.date.toLocaleDateString()}--{usage.name}--{usage.amount}
	</div>
{/each}
