<script lang="ts">
	import type { Anajlist_init } from '$lib/custom_types';
	import { anajlist } from '$lib/predefined';

	export const selected: Anajlist_init[] = [];
</script>

{#each anajlist as anaj}
	<div class="flex flex-row">
		<div>
			<img src={anaj.image} alt={anaj.name} />
		</div>
		<div>
			<h1>
				{anaj.name}
			</h1>
		</div>
	</div>
{/each}
