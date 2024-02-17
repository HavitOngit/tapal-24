<script lang="ts">
	import type { Attendance } from '$lib/custom_types';
	import Button from '../ui/button/button.svelte';
	import Input from '../ui/input/input.svelte';

	export let boys: number = 0;
	export let girls: number = 0;

	$: total = Number(boys) + Number(girls);
</script>

<Input bind:value={boys} placeholder="Enter Attendance" type="number" />
<Input bind:value={girls} placeholder="Enter Attendance" type="number" />
Total:{total}

<Button on:click={() => {}}></Button>
