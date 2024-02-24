<script>
	import NavigationBar from '$lib/finalize/NavigationBar.svelte';
	import '../app.pcss';
</script>

<div class="flex h-11 w-full items-center justify-center bg-slate-600">
	<a href="/" class="text-yellow-200">Home</a>
</div>

<slot />

<div class="fixed bottom-0">
	<NavigationBar></NavigationBar>
</div>
