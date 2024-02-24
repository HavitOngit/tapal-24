<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import UpdateEntry from '$lib/components/extraFeatures/UpdateEntry.svelte';
	import { liveQuery } from 'dexie';
	import { db } from '$lib/db';
	import Button from '$lib/components/ui/button/button.svelte';
	import RegiCreateForm from '$lib/components/RegiCreateForm.svelte';

	export let data: PageData;

	const reg_data = liveQuery(() => db.group.where({ id: Number($page.params.id) }).toArray());
</script>

<a href="/reg/{$page.params.id}/view">
	{$page.params.id}
</a>

<!-- // for update -->

{#if $reg_data}
	<RegiCreateForm useForUpdaate={true} data={$reg_data[0]}></RegiCreateForm>
{/if}

<Button on:click={() => console.log($reg_data[0])}>status</Button>
<!-- <UpdateEntry group_id={Number($page.params.id)}></UpdateEntry> -->
