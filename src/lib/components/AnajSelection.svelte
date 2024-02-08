<script lang="ts">
	import type { Anajlist_init, Storage_Anajs } from '$lib/custom_types';
	import { anajlist } from '$lib/predefined';

	export let selected: Storage_Anajs[] = [];

	function addToList(name: string) {
		selected = [...selected, { name: name, amount: 0 }];
	}
</script>

{#each anajlist as anaj}
	<form>
		<div class="flex h-12 flex-row justify-between">
			<div>
				<img src={anaj.image} alt={anaj.name} class="h-10 w-[100%]" />
			</div>
			<h1>
				{anaj.name}
			</h1>

			<input type="checkbox" bind:group={selected} value={{ name: anaj.name, amount: 0 }} />
		</div>
	</form>
{/each}
