<script>
	import NavigationBar from '$lib/finalize/NavigationBar.svelte';
	import { navigating } from '$app/stores';
	import '../app.pcss';
	import { ChevronLeft } from 'lucide-svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
</script>

<div class="flex h-11 w-full items-center justify-center bg-slate-600">
	<div class="absolute left-0 justify-start">
		<button
			on:click={() => {
				history.back();
			}}
			class="flex"
		>
			<Badge variant="outline" class=" text-white">
				<ChevronLeft></ChevronLeft>Back
			</Badge>
		</button>
	</div>
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
