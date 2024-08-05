<script lang="ts">
	import { t } from 'svelte-intl-precompile';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import type { Group } from '$lib/custom_types';
	import { db } from '$lib/db';
	import { PenLineIcon, Plus } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import Regform from './Regform.svelte';
	import Button from './ui/button/button.svelte';

	let name: string;
	let storage_unit_id: number = 1;
	let rate_unit_id: number = 1;

	export let useForUpdaate: boolean = false;
	export let updateBtn: HTMLButtonElement;

	export let data: Group = {
		name: '',
		storage_unit_id: 0,
		rate_unit_id: 0,
		currently_used: true,
		boys: 0,
		girls: 0,
		dailyCatogaoryWise: false,
		catoWise: [
			{ category: 'ST', boys: 0, girls: 0 },
			{ category: 'SC', boys: 0, girls: 0 },
			{ category: 'GEN', boys: 0, girls: 0 },
			{ category: 'OTHER', boys: 0, girls: 0 }
		]
	};

	let preData: Group = { ...data };

	onMount(() => {
		data = { ...preData };
	});

	async function Save() {
		if (!isDone) return;
		data.boys = Number(data.boys);
		data.girls = Number(data.girls);
		const status = await db.group.put(data);
		console.log(status);
	}

	let isDone: boolean = false;
	let competable: boolean;
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger
		bind:el={updateBtn}
		class=" {!useForUpdaate
			? 'flex size-14 items-center justify-center rounded-lg bg-blue-200'
			: ''}"
	>
		{#if useForUpdaate}
			<div class="flex gap-3">
				<PenLineIcon></PenLineIcon>
				<span>{$t('Edit')}</span>
			</div>
		{:else}
			<Plus></Plus>
		{/if}
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<Regform bind:data bind:isDone bind:competable></Regform>

		<AlertDialog.Footer>
			<AlertDialog.Cancel
				on:click={() => {
					data = { ...preData };
				}}>{$t('Cancel')}</AlertDialog.Cancel
			>
			<AlertDialog.Action disabled={!isDone || !competable}>
				<Button on:click={Save} class="w-full">{useForUpdaate ? $t('Update') : $t('Create')}</Button
				>
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
