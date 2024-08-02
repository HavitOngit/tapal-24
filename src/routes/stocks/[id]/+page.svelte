<script lang="ts">
import { t } from 'svelte-intl-precompile';
	import { page } from '$app/stores';
	import AnajSelection from '$lib/components/AnajSelection.svelte';
	import AnajSlot from '$lib/components/AnajSlot.svelte';
	import SelectionNav from '$lib/components/extraFeatures/SelectionNav.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import type { Storage, StorageUnit } from '$lib/custom_types';
	import { db } from '$lib/db';
	import { anajlist } from '$lib/predefined';
	import { liveQuery } from 'dexie';
	import { PackagePlus, ReceiptTextIcon, Settings2 } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	const id = parseInt($page.params.id);
	const list = liveQuery(() => db.storage.where({ storage_unit_id: id }).toArray());
	const usedBy = liveQuery(() => db.group.where({ storage_unit_id: id }).toArray());
	const unilist = liveQuery(() => db.univarsalList.toArray());
	let unit: StorageUnit;
	onMount(async () => {
		unit = (await db.storage_unit.get(id)) as StorageUnit;
		stockName = unit.name;
	});

	async function DeleteM() {
		await db.storage_unit.delete(id);
		const needtodel = $list.map((obj) => obj.id);
		console.log(needtodel);
		await db.storage.bulkDelete(needtodel);
		toast.success(`${stockName} Deleted`);
		history.back();
	}

	async function nameUpdate() {
		if (unit.name != '') {
			const status = await db.storage_unit
				.update(id, { name: unit.name })
				.then(() => toast.success(`${stockName} ➡️ ${unit.name}`));
			showEdit = false;
		}
	}

	let stockName: string;
	let showEdit: boolean = false;

	// to add new items
	let newlySelected: Storage[] = [];

	let filtered_list: any = [];
	$: if ($list) {
		if ($unilist) {
			filtered_list = $unilist.map((obj) => {
				if (!$list.find((item) => item.name == obj.name)) {
					return { ...obj };
				}
			});
		}
	}

	async function SaveNewAnajs() {
		const addinunilist: any[] = [];

		newlySelected.forEach((obj) => {
			obj.storage_unit_id = id;
			if (!$unilist.find((x) => x.name === obj.name)) {
				addinunilist.push({ name: obj.name, image: '/anaj_images/avg.png' });
			}
		});
		db.transaction('rw', db.storage, db.univarsalList, async () => {
			await db.storage.bulkAdd(newlySelected);
			await db.univarsalList.bulkAdd(addinunilist);
		}).then(() => {
			newlySelected = [];
		});
	}

	const deleteMap = new Map();
	async function Delete() {
		const delList = deleteMap.entries();
		console.log(delList);
	}
	let MenuOpen: boolean = false;
	let TestButton: HTMLButtonElement;
	let AddNewAnajbtn: HTMLButtonElement;

	onMount(() => {
		console.log(unit);
	});

	// delete
	let deleteMode: boolean = false;
	let DeleteList: Storage[] = [];

	let pressTimer: ReturnType<typeof setTimeout>;
	const longpressDuration = 1000;
	let deleteBtn: HTMLButtonElement;
	let selectall: boolean = false;

	async function deleteitems() {
		if (!deleteMode) {
			await DeleteM();
		}
		const deletedno = DeleteList.length;
		if (DeleteList.length > 0) {
			await db.storage.bulkDelete(
				DeleteList.map((obj) => {
					return obj.id;
				})
			);
			deleteMode = false;
			toast.success(`${deletedno} items Deleted`);
		}
	}

	if (DeleteList.length > 0) {
	}

	$: if (selectall == true) {
		DeleteList = $list;
	}
	$: if (selectall == false) {
		DeleteList = [];
	}

	$: if (deleteMode == false) {
		DeleteList = [];
	}
</script>

{#if deleteMode}
	<div class="">
		<SelectionNav bind:deletBtn={deleteBtn} bind:deleteMode bind:selected_length={DeleteList.length}
		></SelectionNav>

		<div class="m-2 mr-7 flex justify-end gap-2">
			<Label>{$t("Select All")}</Label>
			<input type="checkbox" bind:checked={selectall} class="size-5" />
		</div>
	</div>
{/if}

<div id="alerts" hidden>
	<AlertDialog.Root>
		<AlertDialog.Trigger bind:el={TestButton}></AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>{$t("Rename")}</AlertDialog.Title>
				<AlertDialog.Description>
					<Input bind:value={unit.name} />
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>{$t("Cancel")}</AlertDialog.Cancel>
				<AlertDialog.Action on:click={nameUpdate}>{$t("Save Changes")}</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>

	                   
	<AlertDialog.Root>
		<AlertDialog.Trigger bind:el={deleteBtn}></AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Deleting {deleteMode ? 'from ' : ''}{stockName}</AlertDialog.Title>
				<AlertDialog.Description>
					<div class="m-2 flex flex-col gap-2">
						{#each DeleteList as item}
							<div class="flex justify-between">
								<div>{item.name}</div>
								<div>{item.amount} kg</div>
							</div>
						{/each}

						{#if !deleteMode}
							<div class="flex flex-col gap-4">
								<div
									class=" flex flex-col gap-4
								"
								>
									{#if $usedBy.length > 0}
										<div id="notice">
											<p class="text-left">{$t("currently this stock is used by following Registers")}</p>
										</div>
										<div class="flex">
											<Label class="text-base">{$t("UsedBy:")}</Label>
											<div class="flex gap-3">
												{#each $usedBy as reg}
													<Badge variant="outline">{reg.name}</Badge>
												{/each}
											</div>
										</div>
										<hr />
										<div class="flex">
											<p class="text-left">{$t("To Delete this Stock Make Sure this stock not used by anyone")}</p>
											<a href="/reg">
												<Button>{$t("Fix")}</Button>
											</a>
										</div>
									{:else}
										<div>
											<div class="flex items-start">{$t("this stock currently contain :")}</div>
											{#each $list as item}
												<div class="m-5 flex justify-between">
													<div>{item.name}</div>
													<div>{item.amount} kg</div>
												</div>
											{/each}
										</div>
										<hr />
										<div class="flex text-wrap">
											<Label class="text-base font-semibold">{$t("NOTE:")}</Label>
											{stockName} will be deleted. cannot be restored once deleted.
										</div>
									{/if}
								</div>
							</div>
						{/if}
					</div>
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>{$t("Cancel")}</AlertDialog.Cancel>
				<AlertDialog.Action
					on:click={deleteitems}
					class="bg-red-500"
					disabled={!($usedBy.length == 0 || deleteMode)}>{$t("Confirm")}</AlertDialog.Action
				>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>

<div class="m-2 flex flex-col gap-2">
	{#if !deleteMode}
		<Card.Root>
			<Card.Header>
				<Card.Title class="m-2 flex  items-center justify-between">
					<div>{unit?.name}</div>
					<div class="flex gap-2">
						<div>
							<a href="{$page.url}/report">
								<ReceiptTextIcon></ReceiptTextIcon>
							</a>
						</div>
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
								{#if $list.length > 0}
									<DropdownMenu.Item on:click={() => (deleteMode = !deleteMode)}
										>Delete items</DropdownMenu.Item
									>
								{/if}
								<DropdownMenu.Item
									on:click={() => {
										deleteBtn.click();
									}}>Delete</DropdownMenu.Item
								>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
				</Card.Title>
			</Card.Header>
		</Card.Root>
	{/if}

	<p class="text-end text-sm font-semibold">{$t("(All in Kg)")}</p>
	                                                   
	<div class="flex flex-col gap-2">
		{#each $list || [] as anaj}
			<div
				on:touchstart={(e) => {
					pressTimer = setTimeout(() => {
						DeleteList.push(anaj);
						deleteMode = true;
					}, longpressDuration);
				}}
				on:touchend={() => {
					clearTimeout(pressTimer);
				}}
				on:touchcancel={() => {
					clearTimeout(pressTimer);
				}}
			>
				<AnajSlot {anaj} forStorageView={true} bind:deleteMode>
					<input type="checkbox" bind:group={DeleteList} value={anaj} class="size-5" />
				</AnajSlot>
			</div>
		{/each}

		<Button
			variant="outline"
			class="gap-2"
			on:click={() => {
				AddNewAnajbtn.click();
			}}
		>
			<PackagePlus />
			<p>{$t("Click To Add")}</p>
		</Button>
	</div>
</div>

<div id="newlyAdded">
	{#if newlySelected.length > 0}
		<div class="flex">{$t("New anajs")}</div>

		{#each newlySelected as anaj}
			<AnajSlot {anaj}></AnajSlot>
		{/each}
	{/if}
	<div class="m-2 flex justify-end">
		<AnajSelection
			bind:TriggerButton={AddNewAnajbtn}
			bind:selected={newlySelected}
			anajlist={filtered_list}
			forStorageView={true}
		></AnajSelection>
	</div>
</div>

{#if newlySelected.length > 0}
	<div class=" fixed bottom-24 flex w-full">
		<Button on:click={SaveNewAnajs} class="mx-2 w-full">{$t("Save Changes")}</Button>
	</div>
{/if}

{#if showEdit}
	<Button on:click={Delete}>{$t("Delete")}</Button>
{/if}
