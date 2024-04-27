<script lang="ts">
	import { liveQuery } from 'dexie';
	import type { PageData } from './$types';
	import { db } from '$lib/db';

	import HajarislotG from '$lib/components/daily/hajarislotG.svelte';
	import { onMount } from 'svelte';
	import { Badge } from '$lib/components/ui/badge';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Group } from '$lib/custom_types';
	export let data: PageData;

	// const regs = liveQuery(() => db.group.toArray());
	let today = new Date();

	let LastDate;

	let workingDate: Date; // global date on which all activity stored

	// registers are like notebooks which identify the group of students
	const registers = liveQuery(() => db.group.toArray());

	let active_Registers: Group[] = [];
	$: if ($registers) {
		active_Registers = $registers.filter((reg) => reg.currently_used);
	}

	const submited_registers = liveQuery(() =>
		db.attendance.where('date').equals(workingDate).toArray()
	);

	let isTodayAllWorkDone = false;
	if ($registers && $submited_registers) {
		isTodayAllWorkDone = $submited_registers.length === active_Registers.length;
	}

	onMount(async () => {
		// get last date from db if exiest
		LastDate = await db.usage.orderBy('date').last();

		if (!LastDate) {
			workingDate = today;
		} else {
			workingDate = LastDate.date;
		}
	});
</script>

<div class="m-2 flex flex-col gap-2">
	<Badge color="primary" size="large" class="mb-4">
		{today.toDateString()}</Badge
	>

	{#if $registers}
		<div class="">
			{#each active_Registers as reg}
				<HajarislotG RegData={reg} bind:Date={workingDate}></HajarislotG>
			{/each}
		</div>
	{:else}
		<div class="flex min-h-8 w-auto items-center justify-center">
			<p>No registers found</p>
		</div>
	{/if}

	<div class="bottom-0">
		<Button on:click={() => console.log(active_Registers)}>WorkDone: {isTodayAllWorkDone}</Button>
	</div>
</div>
