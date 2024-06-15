<script lang="ts">
	import type { Attendance } from '$lib/custom_types';
	import Layout from '../../../routes/+layout.svelte';
	import Button from '../ui/button/button.svelte';
	import Input from '../ui/input/input.svelte';
	import Label from '../ui/label/label.svelte';

	export let boys: number = 0;
	export let girls: number = 0;
	export let total: number = 0;

	$: total = Number(boys) + Number(girls);
	$: boys = Number(boys);
	$: girls = Number(girls);
</script>

<div class="flex flex-col gap-2">
	<div class="flex gap-2">
		<div class="flex items-center gap-2">
			<Label>Boys:</Label>
			<Input bind:value={boys} placeholder="Enter Attendance" type="number" />
		</div>
		<div class="flex items-center gap-2">
			<Label>Girls:</Label>
			<Input bind:value={girls} placeholder="Enter Attendance" type="number" />
		</div>
	</div>
	<!-- <div class=" flex flex-row items-center gap-2">
		<Label>Total:</Label>
		<div>
			{total}
		</div>
	</div> -->
</div>
