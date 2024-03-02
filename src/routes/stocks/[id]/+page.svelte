<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import * as Card from '$lib/components/ui/card';
	import { db } from '$lib/db';
	import type { Storage, StorageUnit } from '$lib/custom_types';
	import { onMount } from 'svelte';
	import { liveQuery, type Observable } from 'dexie';
	import AnajSlot from '$lib/components/AnajSlot.svelte';
	import { Content } from '$lib/components/ui/alert-dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import AnajSelection from '$lib/components/AnajSelection.svelte';
	import { anajlist } from '$lib/predefined';

	const id = parseInt($page.params.id);
	const list = liveQuery(() => db.storage.where({ storage_unit_id: id }).toArray());
	let unit: StorageUnit;
	onMount(async () => {
		unit = (await db.storage_unit.get(id)) as StorageUnit;
		stockName = unit.name;
	});

	async function DeleteM() {
		const status = await db.storage_unit.delete(id);
		const needtodel = $list.map((obj) => obj.id);
		console.log(needtodel);
		const cleanup = await db.storage.bulkDelete(needtodel);

		history.back();
	}

	async function nameUpdate() {
		if (unit.name != '') {
			const status = await db.storage_unit.update(id, { name: unit.name });
			showEdit = false;
		}
	}

	export let data: PageData;
	let stockName: string;
	let showEdit: boolean = false;

	// to add new items
	let newlySelected: Storage[] = [];

	let filtered_list: any = [];
	$: if ($list) {
		filtered_list = anajlist.map((obj) => {
			if (!$list.find((item) => item.name == obj.name)) {
				return { ...obj };
			}
		});
	}

	async function SaveNewAnajs() {
		newlySelected.forEach((obj) => {
			obj.storage_unit_id = id;
		});
		const status = await db.storage.bulkAdd(newlySelected);

		if (status) {
			newlySelected.length = 0;
		}
	}

	const deleteMap = new Map();
	async function Delete() {
		const delList = deleteMap.entries();
		console.log(delList);
	}
</script>

<div class="m-2 flex flex-col gap-2">
	<Card.Root>
		<Card.Content class="flex flex-row items-center justify-between">
			{#if showEdit}
				<Input bind:value={unit.name} placeholder="Enter Stock Name" class="m-1" />
				<Button variant="secondary" on:click={nameUpdate}>Save</Button>
				<Button
					variant="outline"
					on:click={() => {
						showEdit = false;
						unit.name = stockName;
					}}>Cancel</Button
				>
			{:else}
				<div>{unit?.name}</div>
				<Button
					variant="outline"
					on:click={() => {
						showEdit = !showEdit;
					}}>Edit</Button
				>
			{/if}
		</Card.Content>
	</Card.Root>
	<!-- <Button on:click={DeleteM}>Delete</Button> -->
	<div class="flex flex-col gap-2">
		{#each $list || [] as anaj}
			<AnajSlot {anaj} forStorageView={true}></AnajSlot>
		{/each}
	</div>
</div>

<div id="newlyAdded">
	{#if newlySelected.length > 0}
		<div class="flex">New anajs</div>

		{#each newlySelected as anaj}
			<AnajSlot {anaj}></AnajSlot>
		{/each}
	{/if}
	<div class="m-2 flex justify-end">
		<AnajSelection bind:selected={newlySelected} anajlist={filtered_list}></AnajSelection>
	</div>
</div>

{#if newlySelected.length > 0}
	<div class=" fixed bottom-24 flex w-full">
		<Button on:click={SaveNewAnajs} class="mx-2 w-full">Save Changes</Button>
	</div>
{/if}

{#if showEdit}
	<Button on:click={Delete}>Delete</Button>
{/if}
