<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	import { db } from '$lib/db';
	import type { StorageUnit } from '$lib/custom_types';
	import { onMount } from 'svelte';
	import { liveQuery } from 'dexie';

	const id = parseInt($page.params.id);
	const list = liveQuery(() => db.storage.where({ storage_unit_id: id }).toArray());
	let unit: StorageUnit;
	onMount(async () => {
		unit = (await db.storage_unit.get(id)) as StorageUnit;
	});

	export let data: PageData;
</script>

{unit?.name}

{#each $list || [] as anaj}
	<p>{anaj.name}</p>
{/each}
