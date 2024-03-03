<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import UpdateEntry from '$lib/components/extraFeatures/UpdateEntry.svelte';
	import { liveQuery } from 'dexie';
	import { db } from '$lib/db';
	import Button from '$lib/components/ui/button/button.svelte';
	import RegiCreateForm from '$lib/components/RegiCreateForm.svelte';
	import Regslot from '$lib/components/reg/regslot.svelte';

	export let data: PageData;

	const reg_data = liveQuery(() => db.group.where({ id: Number($page.params.id) }).toArray());
</script>

<!-- // for update -->
<a href="/reg/{$page.params.id}/view"> View Details </a>

{#if $reg_data}
	<Regslot forUpdate={true} regi={$reg_data[0]}></Regslot>
{/if}

<!-- <UpdateEntry group_id={Number($page.params.id)}></UpdateEntry> -->
