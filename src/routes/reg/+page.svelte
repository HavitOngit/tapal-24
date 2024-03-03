<script lang="ts">
	import { liveQuery } from 'dexie';

	import RegiCreateForm from '$lib/components/RegiCreateForm.svelte';
	import { db } from '$lib/db';
	import Regslot from '$lib/components/reg/regslot.svelte';

	const regilist = liveQuery(() => db.group.toArray());
</script>

<div class="m-2 flex flex-col gap-2">
	{#each $regilist || [] as regi}
		<a href="/reg/{regi.id}">
			<Regslot {regi}></Regslot>
		</a>
	{/each}
</div>

<div class="fixed bottom-24 right-3">
	<RegiCreateForm></RegiCreateForm>
</div>
