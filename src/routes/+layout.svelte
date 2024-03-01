<script>
	import NavigationBar from '$lib/finalize/NavigationBar.svelte';
	import { navigating } from '$app/stores';
	import '../app.pcss';
</script>

<div class="flex h-11 w-full items-center justify-center bg-slate-600">
	<a href="/" class="text-yellow-200">Home</a>
</div>
{#if $navigating}
	Loading...
{/if}
<slot />
<div class="h-40"></div>
<div class="fixed bottom-0">
	<NavigationBar></NavigationBar>
</div>
