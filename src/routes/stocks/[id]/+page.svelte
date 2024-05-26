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
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Settings2 } from 'lucide-svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { Item } from '$lib/components/ui/carousel';
	import * as Dialog from '$lib/components/ui/dialog';

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
	let MenuOpen: boolean = false;
	let TestButton: HTMLButtonElement;
	let AddNewAnajbtn: HTMLButtonElement;
</script>

<div class="m-2 flex flex-col gap-2">
	<Card.Root>
		<Card.Header>
			<Card.Title class="m-2 flex  items-center justify-between">
				<div>{unit?.name}</div>
				<div>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<Settings2 />
						</DropdownMenu.Trigger>

						<DropdownMenu.Content>
							<DropdownMenu.Item
								on:click={() => {
									TestButton.click();
								}}
							>
								Rename
							</DropdownMenu.Item>
							<DropdownMenu.Item
								on:click={() => {
									AddNewAnajbtn.click();
								}}>Add New items</DropdownMenu.Item
							>
							<DropdownMenu.Item>Delete items</DropdownMenu.Item>
							<DropdownMenu.Item>Delete</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</Card.Title>
		</Card.Header>
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
		<AnajSelection
			bind:TriggerButton={AddNewAnajbtn}
			bind:selected={newlySelected}
			anajlist={filtered_list}
		></AnajSelection>
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

<AlertDialog.Root>
	<AlertDialog.Trigger bind:el={TestButton}></AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Rename</AlertDialog.Title>
			<AlertDialog.Description>
				<Input bind:value={unit.name} />
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action on:click={nameUpdate}>Save Changes</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
