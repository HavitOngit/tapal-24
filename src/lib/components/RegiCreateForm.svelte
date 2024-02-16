<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { Group } from '$lib/custom_types';
	import { db } from '$lib/db';
	import Regform from './Regform.svelte';
	import Button from './ui/button/button.svelte';
	import Input from './ui/input/input.svelte';
	import type { RegForm } from '$lib/custom_types';

	let name: string;
	let storage_unit_id: number = 1;
	let rate_unit_id: number = 1;

	let data: RegForm = {
		name: '',
		storage_unit_id: 0,
		rate_unit_id: 0,
		currently_used: true
	};
	async function Save() {
		const status = await db.group.add(data);
		console.log(status);
	}
</script>

<Regform bind:data></Regform>
<Button on:click={Save}>Create</Button>
