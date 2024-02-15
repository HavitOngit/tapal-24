<script lang="ts">
	let current_list: oneRate[];
	export let Ratedetails: Rate;
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import type { Rate, oneRate } from '$lib/custom_types';
	import Rateform from './Rateform.svelte';
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger>Edit</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header class="flex ">
			<AlertDialog.Title>{Ratedetails.day}</AlertDialog.Title>
			<!-- <AlertDialog.Description></AlertDialog.Description> -->
		</AlertDialog.Header>
		<Rateform forInit={false} anajlist={Ratedetails.ratelist} ratelist={current_list}></Rateform>
		<AlertDialog.Footer class="flex flex-row justify-around">
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action>Save Changes</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
