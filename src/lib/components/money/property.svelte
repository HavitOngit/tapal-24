<script lang="ts">
	export let name: string = '';
	export let value: string | number;
	import { t } from 'svelte-intl-precompile';
</script>

<div class="flex flex-col">
	<p class="text-base text-gray-400">{$t(name)}</p>
	<p class="text-xl text-gray-600">{value}</p>
</div>
