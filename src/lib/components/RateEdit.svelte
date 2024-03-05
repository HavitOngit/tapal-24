<script lang="ts">
	import { getAllUsedAnajs } from '$lib/api';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import type { Rate, oneRate } from '$lib/custom_types';
	import { db } from '$lib/db';
	import { Settings2 } from 'lucide-svelte';
	import Rateform from './Rateform.svelte';
	import Badge from './ui/badge/badge.svelte';

	let current_list: oneRate[];
	export let Ratedetails: Rate;
	async function update() {
		const data = {
			id: Ratedetails.id,
			day: Ratedetails.day,
			ratelist: Ratedetails.ratelist,
			rate_unit_id: Ratedetails.rate_unit_id
		};

		const status = await db.rate.put(data);
		if (status) {
			await db.rates.update(data.rate_unit_id, {
				used_anaj: await getAllUsedAnajs(data.rate_unit_id)
			});
		}
		console.log(status);
	}
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger>
		<Badge variant="outline">
			<Settings2 size={20}></Settings2>Edit
		</Badge>
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header class="flex ">
			<AlertDialog.Title>{Ratedetails.day}</AlertDialog.Title>
		</AlertDialog.Header>
		<Rateform forInit={false} anajlist={Ratedetails.ratelist} bind:ratelist={Ratedetails.ratelist}
		></Rateform>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action on:click={update}>Save Changes</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
