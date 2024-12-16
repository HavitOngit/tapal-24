<script lang="ts">
	import { liveQuery } from 'dexie';

	import RegiCreateForm from '$lib/components/RegiCreateForm.svelte';
	import { db } from '$lib/db';
	import Regslot from '$lib/components/reg/regslot.svelte';
	import { t } from 'svelte-intl-precompile';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ReceiptTextIcon } from 'lucide-svelte';

	const regilist = liveQuery(() => db.group.toArray());
	let fakebtn: HTMLButtonElement;
</script>

<div class="m-3 my-5 flex items-center justify-between">
	<p class="text-xl font-bold">{$t('Registers')}</p>

	<div class="flex items-center gap-2 rounded-lg border border-blue-500 bg-blue-50 p-4">
		<ReceiptTextIcon class="h-6 w-6 text-blue-600"></ReceiptTextIcon>
		<p class="font-bold text-blue-600">{$t('Create Report')}</p>
	</div>
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
