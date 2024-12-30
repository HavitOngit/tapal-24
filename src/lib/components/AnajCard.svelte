<script lang="ts">
	import type { Anajlist_init } from '$lib/custom_types';
	import Button from './ui/button/button.svelte';
	import { t } from 'svelte-intl-precompile';

	export let anaj: Anajlist_init;
	export let btn_clicked: boolean;
</script>

<Button
	variant="outline"
	class="h-full w-full {btn_clicked ? 'border-green-600' : ''}"
	on:click={() => {
		btn_clicked = !btn_clicked;
	}}
>
	<div class=" flex h-full w-full flex-row">
		<div class="relative h-28 w-28 flex-none">
			<img
				src={anaj.image || '/anaj_images/avg.png'}
				alt={anaj.name}
				class="h-24 w-24 rounded-md object-fill"
			/>
		</div>
		<div class="mt-2 text-wrap">
			{$t(anaj.name)}
		</div>
		<!-- <input type="checkbox" bind:group={selected} value={{ name: anaj.name, amount: 0 }} /> -->
	</div>
</Button>
