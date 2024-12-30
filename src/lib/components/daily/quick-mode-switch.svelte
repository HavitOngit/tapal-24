<script lang="ts">
	import { RabbitIcon } from 'lucide-svelte';

	export let checked: boolean = false;
</script>

<button on:click={() => (checked = !checked)}>
	{#if !checked}
		<div class="border border-white p-1">
			<RabbitIcon class="text-gray-400"></RabbitIcon>
		</div>
	{:else}
		<div
			class="flex items-center justify-center gap-1 rounded-full border border-green-600 bg-green-50 p-1"
		>
			<p class="p-1 text-xs font-bold text-green-700">Quick Mode</p>
			<RabbitIcon class="text-green-600"></RabbitIcon>
		</div>
	{/if}
</button>
