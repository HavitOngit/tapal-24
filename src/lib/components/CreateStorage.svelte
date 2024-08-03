<script lang="ts">
import { t } from 'svelte-intl-precompile';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Label } from '$lib/components/ui/label';
	import type { Storage, StorageUnit } from '$lib/custom_types';
	import { db } from '$lib/db';
	import { anajlist } from '$lib/predefined';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import AnajSelection from './AnajSelection.svelte';
	import AnajSlot from './AnajSlot.svelte';
	import Button from './ui/button/button.svelte';
	import Input from './ui/input/input.svelte';
	import { liveQuery } from 'dexie';

	let selected_anaj: Storage[] = [];

	let storage_unit: StorageUnit = { name: '' };

	// async function handle_univarsal_list(name: string) {
	// 	if (!univarsalList.has(name)) {
	// 		univarsalList.set(name, true);
	// 		await db.univarsalList.add({ name: name });
	// 	}
	// }
	const unimap = new Map();
	const unilist = liveQuery(() => db.univarsalList.toArray() || anajlist);

	onMount(async () => {
		TriggerBtn.click();

		const list = await db.univarsalList.toArray();
		list.forEach((obj) => unimap.set(obj.name, obj.id));
	});

	let newUniList: any = [];
	async function save() {
		if (storage_unit.name.length < 1) {
			TriggerBtn.click();

			return;
		}

		db.transaction('rw', db.univarsalList, db.storage_unit, db.storage, async () => {
			const unit = await db.storage_unit.put(storage_unit);

			// set ref of storage unit
			await selected_anaj.forEach((obj) => {
				obj.storage_unit_id = unit;
				if (!$unilist.find((x) => x.name === obj.name)) {
					newUniList.push({ name: obj.name, image: '/anaj_images/avg.png' });
					unimap.set(obj.name, true);
				}
			});

			console.log(newUniList);

			await db.storage.bulkAdd(selected_anaj);
			await db.univarsalList.bulkAdd(newUniList);
		}).then(() => {
			newUniList = [];

			toast.success(`${storage_unit.name} created`);
			history.back();
		});
		// const addtounivarasal = selected_anaj.map((obj) => handle_univarsal_list(obj.name));
		// console.log(addtounivarasal);
	}
	let TriggerBtn: HTMLButtonElement;
	let SaveBtn: HTMLButtonElement;
	let subcount = 0;
	let CancelBtn: HTMLButtonElement;
	let anajSelectionTrigger: HTMLButtonElement;
</script>

                                                                                              
<div id="alerts">
	<AlertDialog.Root>
		<AlertDialog.Trigger bind:el={TriggerBtn}></AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title class="flex justify-between"></AlertDialog.Title>
				<AlertDialog.Description class="flex flex-col items-start justify-start gap-6">
					<div class="text-lg"></div>

					<div>
						<form
							on:submit={async (e) => {
								if (storage_unit.name.length > 0) {
									e.preventDefault();
									CancelBtn.click();

									if (selected_anaj.length > 0) {
										await save();
									}
								}
							}}
							class=" flex items-center gap-3"
						>
							<Label class="text-lg font-medium">{$t("Name:")}</Label>
							<Input bind:value={storage_unit.name} type="text" autofocus />
							                                                                                                                          
						</form>
					</div>
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel class="hidden"
					><button bind:this={CancelBtn}>{$t("Cancel")}</button></AlertDialog.Cancel
				>
				<AlertDialog.Action
					type="submit"
					on:click={async () => {
						if (selected_anaj.length > 0) {
							await save();
						}
					}}>{selected_anaj.length > 0 ? 'Create' : 'Set'}</AlertDialog.Action
				>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>
<div class="mx-2 flex flex-col gap-2">
	<div class="flex items-center gap-2">
		<Label>{$t("Name:")}</Label>
		<Input
			name="name"
			type="text"
			placeholder="Enter Storage Name"
			bind:value={storage_unit.name}
		/>
	</div>
	<p class="text-end text-sm font-semibold">{$t("(All in Kg)")}</p>
	Selected Anaj:
	{#if selected_anaj.length == 0}
		<img src="/in_app/clickonAdd.png" alt="click on Add Button" />
	{/if}

	{#each selected_anaj as anaj}
		<div class="">
			<AnajSlot bind:anaj></AnajSlot>
		</div>
	{/each}
	<div class="flex justify-end gap-2">
		<AnajSelection
			bind:TriggerButton={anajSelectionTrigger}
			bind:selected={selected_anaj}
			anajlist={$unilist}
		></AnajSelection>
		<Button on:click={save} class="  rounded-lg">{$t("Create")}</Button>
	</div>

	                                                                               
</div>
