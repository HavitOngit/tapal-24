<script lang="ts">
	import { liveQuery } from 'dexie';
	import type { PageData } from './$types';
	import { db } from '$lib/db';
	import RegiCreateForm from '$lib/components/RegiCreateForm.svelte';

	export let data: PageData;

	const regilist = liveQuery(() => db.group.toArray());
</script>

{#each $regilist || [] as regi}
	<a href="/reg/{regi.id}">
		{regi.name}
	</a>
{/each}

<RegiCreateForm></RegiCreateForm>
