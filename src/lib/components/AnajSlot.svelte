<script lang="ts">
	import type { Storage } from '$lib/custom_types';
	import { AppleIcon } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import { anajlist } from '$lib/predefined';
	import Input from './ui/input/input.svelte';

	export let anaj: Storage;
</script>

<div class=" flex h-full w-full flex-row">
	<div class="box-border h-28 w-28">
		<img
			src={anajlist.find((obj) => obj.name == anaj.name)?.image}
			alt={anaj.name}
			class="h-full w-full object-cover p-2"
		/>
	</div>
	<div class="mt-2 flex flex-col flex-wrap">
		<div>
			{anaj.name}
		</div>
		<div class="flex flex-row">
			<div>Amount :</div>
			<div><input bind:value={anaj.amount} /></div>
		</div>
	</div>
	<!-- <input type="checkbox" bind:group={selected} value={{ name: anaj.name, amount: 0 }} /> -->
</div>
