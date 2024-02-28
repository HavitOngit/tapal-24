<script lang="ts">
	import type { Storage, StorageUnit } from '$lib/custom_types';
	import { db } from '$lib/db';
	import { anajlist } from '$lib/predefined';
	import { onMount } from 'svelte';
	import AnajSelection from './AnajSelection.svelte';
	import AnajSlot from './AnajSlot.svelte';
	import Button from './ui/button/button.svelte';
	import Input from './ui/input/input.svelte';
	import { Label } from '$lib/components/ui/label';

	let selected_anaj: Storage[] = [];

	let storage_unit: StorageUnit = { name: '' };

	// async function handle_univarsal_list(name: string) {
	// 	if (!univarsalList.has(name)) {
	// 		univarsalList.set(name, true);
	// 		await db.univarsalList.add({ name: name });
	// 	}
	// }
	const unimap = new Map();

	onMount(async () => {
		const list = await db.univarsalList.toArray();
		list.forEach((obj) => unimap.set(obj.name, obj.id));
	});

	let newUniList: any = [];
	async function save() {
		const unit = await db.storage_unit.put(storage_unit);

		// set ref of storage unit
		await selected_anaj.forEach((obj) => {
			obj.storage_unit_id = unit;
			if (!unimap.has(obj.name)) {
				const reqobj = anajlist.find((item) => obj.name == item.name);
				newUniList.push(reqobj);
				unimap.set(obj.name, true);
			}
		});

		console.log(newUniList);

		const anajs = await db.storage.bulkAdd(selected_anaj);
		const uniupload = await db.univarsalList.bulkAdd(newUniList);
		if (uniupload) {
			newUniList = [];
		}
		// const addtounivarasal = selected_anaj.map((obj) => handle_univarsal_list(obj.name));
		// console.log(addtounivarasal);
	}
</script>

<div class="mx-2 flex flex-col gap-2">
	<div class="flex items-center gap-2">
		<Label>Name:</Label>
		<Input
			name="name"
			type="text"
			placeholder="Enter Storage Name"
			bind:value={storage_unit.name}
		/>
	</div>
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
		<AnajSelection bind:selected={selected_anaj} {anajlist}></AnajSelection>
		<Button on:click={save} class="  rounded-lg">Create</Button>
	</div>

	<!-- <Button on:click={() => console.log(newUniList, unimap)}>TEST</Button> -->
</div>
