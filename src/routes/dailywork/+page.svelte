<script lang="ts">
	import Hajrislot from '$lib/components/daily/hajrislot.svelte';
	import { liveQuery } from 'dexie';
	import type { PageData } from './$types';
	import { db } from '$lib/db';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import HajarislotG from '$lib/components/daily/hajarislotG.svelte';
	import { onMount } from 'svelte';
	import { Badge } from '$lib/components/ui/badge';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Group } from '$lib/custom_types';

	export let data: PageData;

	// const regs = liveQuery(() => db.group.toArray());
	let today = new Date();

	let LastDate;

	function checkMonthInit() {
		let mounth = today.getMonth();
	}

	let workingDate: Date; // global date on which all activity stored

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

<Badge color="primary" size="large" class="mb-4">
	{today.toDateString()}</Badge
>

{#if $registers}
	<div class="gap-2">
		{#each active_Registers as reg}
			<HajarislotG RegData={reg}></HajarislotG>
		{/each}
	</div>
{/if}

<Button on:click={() => console.log(active_Registers)}>WorkDone: {isTodayAllWorkDone}</Button>
