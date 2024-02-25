<script lang="ts">
	import type { Storage } from '$lib/custom_types';
	import { AppleIcon } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import { anajlist } from '$lib/predefined';
	import Input from './ui/input/input.svelte';
	import { db } from '$lib/db';
	import * as Card from '$lib/components/ui/card';

	export let anaj: Storage;
	export let forStorageView: boolean = false;

	let addAmount: number = 0;

	$: sum = Number(addAmount) + Number(anaj.amount);

	async function addToStore() {
		const status = await db.storage.update(anaj.id, { amount: sum });
		addAmount = 0;
	}
</script>

<Card.Root>
	<Card.Content>
		<div class="flex space-x-3">
			<div class=" mt-4 h-24 w-24 flex-none bg-orange-500">
				<img
					src={anajlist.find((obj) => obj.name == anaj.name)?.image}
					alt={anaj.name}
					class="h-24 w-24 object-fill"
				/>
			</div>
			<div class="mt-3 flex flex-col flex-wrap">
				<div>
					{anaj.name}
				</div>
				{#if forStorageView}
					<div class="flex flex-col">
						<div>Amount : {anaj.amount}</div>
						<div class="flex flex-row justify-between">
							<Input
								bind:value={addAmount}
								placeholder="Enter Amount in kg"
								type="number"
								min="1"
							/>
							<Button on:click={addToStore}>Add</Button>
						</div>
					</div>
				{:else}
					<div class="flex flex-row">
						<div>Amount:</div>
						<div><input bind:value={anaj.amount} class="w-full" /></div>
					</div>
				{/if}
			</div>
			<!-- <input type="checkbox" bind:group={selected} value={{ name: anaj.name, amount: 0 }} /> -->
		</div>
	</Card.Content>
</Card.Root>
