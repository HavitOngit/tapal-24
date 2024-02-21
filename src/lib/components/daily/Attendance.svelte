<script lang="ts">
	import type { Attendance } from '$lib/custom_types';
	import Button from '../ui/button/button.svelte';
	import Input from '../ui/input/input.svelte';

	export let boys: number = 0;
	export let girls: number = 0;

	$: total = Number(boys) + Number(girls);
</script>

<div class="flex flex-row space-x-3">
	<Input bind:value={boys} placeholder="Enter Attendance" type="number" />
	<Input bind:value={girls} placeholder="Enter Attendance" type="number" />
	<div class=" flex w-[40%] flex-row items-center">
		<div>Total:</div>
		<div>
			{total}
		</div>
	</div>
</div>
