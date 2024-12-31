<script lang="ts">
	import MonthSelector from '../reg/MonthSelector.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	import { onMount } from 'svelte';
	import Input from '../ui/input/input.svelte';
	import type { Group } from '$lib/custom_types';
	import { db } from '$lib/db';

	let monthlist = [
		{ value: 0, label: 'January' },
		{ value: 1, label: 'February' },
		{ value: 2, label: 'March' },
		{ value: 3, label: 'April' },
		{ value: 4, label: 'May' },
		{ value: 5, label: 'June' },
		{ value: 6, label: 'July' },
		{ value: 7, label: 'August' },
		{ value: 8, label: 'September' },
		{ value: 9, label: 'October' },
		{ value: 10, label: 'November' },
		{ value: 11, label: 'December' }
	];

	let month = 0;
	export let TriggerBtn: HTMLButtonElement;
	let Regsisters: Group[];
	let regis: { value: number; label: string }[] = [];
	let selected_reg = 0;
	let year = new Date().getFullYear();

	onMount(async () => {
		Regsisters = await db.group.toArray();
		// @ts-ignore
		regis = Regsisters.map((r) => ({ value: r.id, label: r.name }));
		selected_reg = regis[0].value;
	});
</script>

<div id="alerts">
	<AlertDialog.Root>
		<AlertDialog.Trigger bind:el={TriggerBtn}></AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title class="flex justify-between"></AlertDialog.Title>
				<AlertDialog.Description
					class="flex flex-col items-start justify-start gap-4 text-lg text-gray-600"
				>
					<p>Month</p>
					<div class="flex w-full gap-4">
						<MonthSelector list={monthlist} bind:selected={month} groupName="Month" />

						<Input type="number" bind:value={year} />
					</div>
					<p>Ragister</p>
					<MonthSelector bind:selected={selected_reg} list={regis} groupName="Ragister" />
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Action>Procced</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>

<button bind:this={TriggerBtn}>Select Month</button>
