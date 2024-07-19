<script lang="ts">
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	onMount(async () => {
		if (!dev) return;
		const eruda = (await import('eruda')).default;
		eruda.init();
		console.log('Eruda initialized');
	});
</script>
