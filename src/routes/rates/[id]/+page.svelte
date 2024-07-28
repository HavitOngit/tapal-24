<script lang="ts">
	import { page } from '$app/stores';
	import { getAllUsedAnajs } from '$lib/api';
	import RateView from '$lib/components/RateView.svelte';
	import Rateslot from '$lib/components/Rateslot.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Rate, Rates } from '$lib/custom_types';
	import { db } from '$lib/db';
	import { liveQuery } from 'dexie';
	import { onMount } from 'svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Input } from '$lib/components/ui/input';
	import { Badge } from '$lib/components/ui/badge';
	import Label from '$lib/components/ui/label/label.svelte';
	import toast from 'svelte-french-toast';
	import { Settings2 } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	const id = parseInt($page.params.id);

	const list = liveQuery(() => db.rate.where({ rate_unit_id: id }).toArray());
	const rateUnit = liveQuery(() => db.rates.get(id));
	let unit: any;
	const usedBy = liveQuery(() => db.group.where({ rate_unit_id: id }).toArray());

	async function nameUpdate() {
		await db.rates.update(id, {
			name: unit.name
		});
	}

	async function deletethis() {
		db.transaction('rw', db.rate, db.rates, async () => {
			await db.rates.delete($rateUnit?.id);
			await db.rate.bulkDelete(
				$list.map((obj) => {
					return obj.id;
				})
			);
		})
			.then(() => {
				toast.success(`${unit.name} deleted`);
				goto('/rates');
			})
			.catch((e) => {
				toast.error('Somthing went Wrong');
			});
	}
	onMount(async () => {
		console.log(await getAllUsedAnajs(id));

		unit = (await db.rates.get(id)) as Rates;
	});
	let TestButton: HTMLButtonElement;
	let deleteBtn: HTMLButtonElement;
</script>

<div id="alerts" hidden>
	<AlertDialog.Root>
		<AlertDialog.Trigger bind:el={TestButton}></AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Rename</AlertDialog.Title>
				<AlertDialog.Description>
					<Input bind:value={unit.name} />
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel
					on:click={() => {
						unit = { ...$rateUnit };
					}}>Cancel</AlertDialog.Cancel
				>
				<AlertDialog.Action on:click={nameUpdate}>Save Changes</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>

	<!-- deletemode -->
	<AlertDialog.Root>
		<AlertDialog.Trigger bind:el={deleteBtn}></AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Deleting {$rateUnit?.name}</AlertDialog.Title>
				<AlertDialog.Description>
					<div class="m-2 flex flex-col gap-2">
						<div class="flex flex-col gap-4">
							<div
								class=" flex flex-col gap-4
								"
							>
								{#if $usedBy.length > 0}
									<div id="notice">
										<p class="text-left">currently this Rate is used by following Registers</p>
									</div>
									<div class="flex">
										<Label class="text-base">UsedBy:</Label>
										<div class="flex gap-3">
											{#each $usedBy as reg}
												<Badge variant="outline">{reg.name}</Badge>
											{/each}
										</div>
									</div>
									<hr />
									<div class="flex justify-between">
										<div class="flex flex-col gap-2">
											<p class="text-left">To Delete this Rate</p>
											<Badge class="border-yellow-700 bg-yellow-200 text-yellow-600"
												>Make Sure this Rate not used by anyone</Badge
											>
										</div>
										<a href="/reg">
											<Button>Fix</Button>
										</a>
									</div>
								{:else}
									<hr />
									<div class="flex gap-2 text-wrap">
										<Label class="text-base font-semibold">NOTE:</Label>
										<p class=" text-left">
											{$rateUnit?.name} will be deleted. cannot be restored once deleted.
										</p>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action
					on:click={deletethis}
					class="bg-red-500"
					disabled={!($usedBy.length == 0)}>Confirm</AlertDialog.Action
				>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>

<!-- <Button
	on:click={() => {
		const some = $list.map((obj) => {
			return {
				day: obj.day,
				ratelist: obj.ratelist
			};
		});
		console.log(JSON.stringify(some));
	}}
></Button> -->

<div class="m-10 flex justify-between">
	<p class="text-xl font-semibold">{$rateUnit?.name}</p>
	<div>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Settings2 />
			</DropdownMenu.Trigger>

			<DropdownMenu.Content>
				<DropdownMenu.Item
					on:click={() => {
						TestButton.click();
					}}
				>
					Rename
				</DropdownMenu.Item>

				<DropdownMenu.Item
					on:click={() => {
						deleteBtn.click();
					}}>Delete</DropdownMenu.Item
				>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</div>
<p class="mr-10 text-end text-sm font-semibold">(All in grams)</p>
<div class="flex flex-col items-center justify-center">
	{#each $list || [] as detail}
		<!-- <RateView rateDetails={detail}></RateView> -->
		<Rateslot rateDetails={detail}></Rateslot>
	{/each}
</div>
