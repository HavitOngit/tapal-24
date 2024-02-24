<script lang="ts">
	import { liveQuery } from 'dexie';

	import { db } from '$lib/db';
	import RegiCreateForm from '$lib/components/RegiCreateForm.svelte';
	import PlusButton from '$lib/finalize/PlusButton.svelte';

	const regilist = liveQuery(() => db.group.toArray());
</script>

{#each $regilist || [] as regi}
	<a href="/reg/{regi.id}">
		{regi.name}
	</a>
{/each}

<PlusButton>
	<RegiCreateForm></RegiCreateForm>
</PlusButton>
