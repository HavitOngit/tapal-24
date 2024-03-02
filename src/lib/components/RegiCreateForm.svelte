<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { Group } from '$lib/custom_types';
	import { db } from '$lib/db';
	import Regform from './Regform.svelte';
	import Button from './ui/button/button.svelte';
	import Input from './ui/input/input.svelte';
	import type { RegForm } from '$lib/custom_types';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Plus, Settings } from 'lucide-svelte';

	let name: string;
	let storage_unit_id: number = 1;
	let rate_unit_id: number = 1;

	export let useForUpdaate: boolean = false;

	export let data: RegForm = {
		name: '',
		storage_unit_id: 0,
		rate_unit_id: 0,
		currently_used: true
	};
	async function Save() {
		const status = await db.group.put(data);
		console.log(status);
	}
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger
		class=" {!useForUpdaate
			? 'flex size-14 items-center justify-center rounded-lg bg-blue-200'
			: ''}"
	>
		{#if useForUpdaate}
			<Settings></Settings>
		{:else}
			<Plus></Plus>
		{/if}
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<!-- <AlertDialog.Header>
	<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
	<AlertDialog.Description>
	  This action cannot be undone. This will permanently delete your account
	  and remove your data from our servers.
	</AlertDialog.Description>
  </AlertDialog.Header> -->

		<Regform bind:data></Regform>

		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action>
				<Button on:click={Save} class="w-full">{useForUpdaate ? 'Update' : 'Create'}</Button>
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
