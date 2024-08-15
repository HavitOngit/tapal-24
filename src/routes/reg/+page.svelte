<script lang="ts">
	import { liveQuery } from 'dexie';

	import RegiCreateForm from '$lib/components/RegiCreateForm.svelte';
	import { db } from '$lib/db';
	import Regslot from '$lib/components/reg/regslot.svelte';
	import { t } from 'svelte-intl-precompile';

	const regilist = liveQuery(() => db.group.toArray());
	let fakebtn: HTMLButtonElement;
</script>

<div class="m-3 my-5">
	<p class="text-xl font-bold">{$t('Registers')}</p>
</div>

<div class="m-2 flex flex-col gap-2">
	{#each $regilist || [] as regi}
		{#if regi.currently_used}
			<a href="/reg/{regi.id}">
				<Regslot {regi}></Regslot>
			</a>
		{/if}
	{/each}
	{#each $regilist || [] as regi}
		{#if !regi.currently_used}
			<a href="/reg/{regi.id}">
				<Regslot {regi}></Regslot>
			</a>
		{/if}
	{/each}
</div>

<div class="fixed bottom-24 right-3">
	<RegiCreateForm updateBtn={fakebtn}></RegiCreateForm>
</div>
