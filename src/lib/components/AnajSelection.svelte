<script lang="ts">
	import type { Anajlist_init, Storage_Anajs } from '$lib/custom_types';
	import { anajlist } from '$lib/predefined';
	import AnajCard from './AnajCard.svelte';
	import Button from './ui/button/button.svelte';

	export let selected: Storage_Anajs[] = [];

	const cache = new Map();
	function addToList(name: string) {
		if (!cache.has(name)) {
			cache.set(name, true);
			selected = [...selected, { name: name, amount: 0 }];
		} else {
			cache.delete(name);
			selected = selected.filter((obj) => obj.name !== name);
		}
	}

	let btn_clicked = false;
</script>

<div class="grid grid-cols-2 gap-1">
	{#each anajlist as anaj}
		<div on:click={() => addToList(anaj.name)}>
			<AnajCard {anaj}></AnajCard>
		</div>
	{/each}
</div>
