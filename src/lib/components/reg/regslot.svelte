<script lang="ts">
	import RegiCreateForm from '$lib/components/RegiCreateForm.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import type { Group } from '$lib/custom_types';
	import { db } from '$lib/db';
	import { liveQuery } from 'dexie';
	import { Settings2 } from 'lucide-svelte';
	import Badge from '../ui/badge/badge.svelte';
	import CardContent from '../ui/card/card-content.svelte';
	import CardHeader from '../ui/card/card-header.svelte';
	import CardTitle from '../ui/card/card-title.svelte';
	import Card from '../ui/card/card.svelte';
	import Label from '../ui/label/label.svelte';

	export let regi: Group;
	export let forUpdate: boolean = false;
	export let DeleteNow = false;
	let triggerBtn: HTMLButtonElement;
	let updateBtn: HTMLButtonElement;
	const rateID = regi.rate_unit_id;
	const stockID = regi.storage_unit_id;

	$: rate = liveQuery(() => db.rates.where({ id: rateID }).toArray());
	$: stock = liveQuery(() => db.storage_unit.where({ id: stockID }).toArray());
</script>

{#if regi}
	<div hidden>
		<AlertDialog.Root>
			<AlertDialog.Trigger bind:el={triggerBtn}></AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Deleting {regi.name}</AlertDialog.Title>
					<AlertDialog.Description>
						<div class="m-2 flex flex-col gap-3">
							<p class="text-left text-2xl font-semibold text-black">
								Do you Really want to Delete ?
							</p>
							<p class="text-left font-semibold">Once Deleted Cant't Be Restored</p>
							<p class="m-1 rounded-md border bg-red-50 p-1 text-left font-semibold">
								All Data (Usage and Attendance) Releted to {regi.name} will be Deleted
							</p>
						</div>
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<AlertDialog.Action
						on:click={() => {
							DeleteNow = true;
						}}
						class="bg-red-400">Confurm</AlertDialog.Action
					>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>

		<RegiCreateForm bind:updateBtn useForUpdaate={true} data={regi}></RegiCreateForm>
	</div>

	<Card>
		<CardHeader>
			<CardTitle class="flex justify-between"
				>{regi.name}
				<div class="flex items-center gap-2">
					<Badge
						variant="outline"
						class="border {regi.currently_used
							? 'border-green-400 text-green-600'
							: 'border-yellow-400 text-yellow-600'}"
						>{regi.currently_used ? 'Active' : 'not in Use'}</Badge
					>
					{#if forUpdate}
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								<Settings2 />
							</DropdownMenu.Trigger>

							<DropdownMenu.Content>
								<DropdownMenu.Item
									on:click={() => {
										updateBtn.click();
									}}
								>
									Edit
								</DropdownMenu.Item>

								<DropdownMenu.Item
									on:click={() => {
										triggerBtn.click();
									}}>Delete</DropdownMenu.Item
								>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					{/if}
				</div></CardTitle
			>
		</CardHeader>

		{#if $rate}
			<CardContent class="flex flex-col gap-2 ">
				{#if regi.boys || regi.girls}
					<div class="flex gap-2">
						<Badge variant="outline">Boys {regi.boys}</Badge> + <Badge variant="outline"
							>Girls {regi.girls}</Badge
						> = <Badge variant="default">total {Number(regi.boys) + Number(regi.girls)}</Badge>
					</div>
				{/if}
				<div class="mr-2 flex justify-between">
					{#if $stock}
						<a href="/stocks/{regi.storage_unit_id}">
							<div>
								<Label>Stock:</Label>
								<span class="">
									{$stock[0].name}
								</span>
							</div>
						</a>
					{/if}

					<div>
						<a href="/rates/{regi.rate_unit_id}">
							<Label>Rate:</Label>
							{$rate[0].name}
						</a>
					</div>
				</div>

				<div class="mt-2 flex gap-2" id="used_ anaj_list">
					<Label>Anajs:</Label>
					<div class="flex flex-wrap gap-2">
						{#each $rate[0].used_anaj || [] as anaj}
							<Badge variant="outline">{anaj}</Badge>
						{/each}
					</div>
				</div>
			</CardContent>
		{/if}
	</Card>
{/if}
