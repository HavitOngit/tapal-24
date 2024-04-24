<script>
	import NavigationBar from '$lib/finalize/NavigationBar.svelte';
	import { navigating } from '$app/stores';
	import '../app.pcss';
	import { ChevronLeft } from 'lucide-svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import LoadingBar from '$lib/components/extraFeatures/loadingBar.svelte';
</script>

<div class="flex h-11 w-full items-center justify-center bg-white">
	<div class="absolute left-0 justify-start">
		<button
			on:click={() => {
				history.back();
			}}
			class="flex"
		>
			<Badge variant="outline" class=" text-black">
				<ChevronLeft></ChevronLeft>Back
			</Badge>
		</button>
	</div>
	<a href="/" class="text-black">Home</a>
</div>
{#if $navigating}
	<LoadingBar></LoadingBar>
{:else}
	<slot />
{/if}
<div class="h-40"></div>
<div class="fixed bottom-0">
	<NavigationBar></NavigationBar>
</div>
