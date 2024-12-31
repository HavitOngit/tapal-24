<script lang="ts">
	import { page } from '$app/stores';
	import * as Table from '$lib/components/ui/table';
	import { db } from '$lib/db';
	import { liveQuery } from 'dexie';
	import { PencilIcon, SettingsIcon, Trash2Icon } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { t } from 'svelte-intl-precompile';
	import CardHeader from '../ui/card/card-header.svelte';
	import CardTitle from '../ui/card/card-title.svelte';
	import Card from '../ui/card/card.svelte';
	import { goto } from '$app/navigation';
	import toast from 'svelte-french-toast';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import RateCreate from './rate-create.svelte';

	const id = Number($page.params.id);
	const rate = liveQuery(() => db.money_rates.get(id));

	let TriggerUpdate: HTMLButtonElement;
	let deleteBtn: HTMLButtonElement;
	let forUpdate: boolean = false;

	function Update() {
		forUpdate = true;
	}
	function deleteRate() {
		db.transaction('rw', db.money_rates, async () => {
			await db.money_rates.delete(id);
		})
			.then(() => {
				toast.success('Rate deleted');
				goto('/money/rates');
			})
			.catch((e) => {
				console.error(e);
				toast.error('Something went wrong');
			});
	}
</script>

<div id="alerts" class="hidden">
	<AlertDialog.Root>
		<AlertDialog.Trigger bind:el={deleteBtn}></AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title class="flex justify-between"></AlertDialog.Title>
				<AlertDialog.Description class="flex flex-col items-start justify-start gap-6 p-6 text-2xl">
					<p>{$t('Are you sure you want to delete this rate?')}</p>
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>{$t('Cancel')}</AlertDialog.Cancel>
				<AlertDialog.Action class="bg-red-400" on:click={deleteRate}
					>{$t('Delete')}</AlertDialog.Action
				>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>

{#if forUpdate && $rate}
	<RateCreate
		{id}
		default_list={$rate?.rates}
		bind:forUpdate
		RateName={$rate?.name}
		totalRate={$rate?.total}
	/>
{:else}
	<div class="m-2">
		{#if $rate}
			<Card>
				<CardHeader>
					<CardTitle class="flex justify-between">
						<p>{$rate.name}</p>
						<div>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<SettingsIcon />
								</DropdownMenu.Trigger>

								<DropdownMenu.Content>
									<DropdownMenu.Item on:click={Update} class="flex gap-3">
										<PencilIcon />
										<p>
											{$t('Update')}
										</p>
									</DropdownMenu.Item>

									<DropdownMenu.Item
										on:click={() => {
											deleteBtn.click();
										}}
										class="flex gap-3"
									>
										<Trash2Icon />
										<p>
											{$t('Delete')}
										</p></DropdownMenu.Item
									>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</div>
					</CardTitle>
				</CardHeader>
			</Card>
			<div class="m-4 grid grid-rows-2 gap-2 text-right">
				<p class="text-gray-400">Total</p>
				<p class="text-2xl font-semibold text-gray-700">{$rate?.total}</p>
			</div>

			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>{$t('Name')}</Table.Head>

						<Table.Head>{$t('Rate')}</Table.Head>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{#each $rate.rates as anaj, i}
						<Table.Row>
							<Table.Cell class="font-medium">
								<p>{$t(anaj.name)}</p>
							</Table.Cell>
							<Table.Cell class="flex gap-2">
								<p>{anaj.rate}</p>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		{/if}
	</div>
{/if}
