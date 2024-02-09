<script lang="ts">
	import type { Anajlist_init, Storage } from '$lib/custom_types';
	import { anajlist } from '$lib/predefined';
	import AnajCard from './AnajCard.svelte';
	import Button from './ui/button/button.svelte';
	import * as Drawer from '$lib/components/ui/drawer';

	export let selected: Storage[] = [];

	const cache = new Map();
	function addToList(name: string) {
		if (!cache.has(name)) {
			cache.set(name, true);
			selected = [...selected, { name: name, amount: 0, storage_unit_id: 0 }];
		} else {
			cache.delete(name);
			selected = selected.filter((obj) => obj.name !== name);
		}
	}

	let btn_clicked = false;
</script>

<Drawer.Root>
	<Drawer.Trigger>ADD</Drawer.Trigger>
	<Drawer.Content>
		<div class="grid grid-cols-2 gap-1">
			{#each anajlist as anaj}
				<div on:click={() => addToList(anaj.name)}>
					<AnajCard {anaj}></AnajCard>
				</div>
			{/each}
		</div>

		<Drawer.Footer>
			<Drawer.Close>Done</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
