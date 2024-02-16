<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { Group } from '$lib/custom_types';
	import { db } from '$lib/db';
	import Button from './ui/button/button.svelte';
	import Input from './ui/input/input.svelte';

	let name: string;
	let storage_unit_id: number = 1;
	let rate_unit_id: number = 1;
	async function Save() {
		const status = await db.group.add({
			name: name,
			storage_unit_id: storage_unit_id,
			rate_unit_id: rate_unit_id,
			currently_used: true
		});
	}
</script>

<Card.Root>
	<Card.Content>
		<Input bind:value={name} placeholder="Enter Name" />
		<Button on:click={Save}>Create</Button>
	</Card.Content>
</Card.Root>
