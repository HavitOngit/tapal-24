<script>
	import NavigationBar from '$lib/finalize/NavigationBar.svelte';
	import { navigating } from '$app/stores';
	import '../app.pcss';
	import { ChevronLeft } from 'lucide-svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
</script>

<div class="flex h-12 w-full items-center justify-center bg-blue-100">
	<div class="absolute left-0 justify-start">
		<button
			on:click={() => {
				history.back();
			}}
			class="flex"
		>
			<Badge variant="outline" class="">
				<ChevronLeft></ChevronLeft>Back
			</Badge>
		</button>
	</div>
	<a href="/">Home</a>
</div>
{#if $navigating}
	<div class="flex flex-col items-center gap-1">
		<img src="/impatient-kitty.gif" alt="loading" class="container" />
		<div class="size-10 font-bold">Loading...</div>
	</div>
{:else}
	<slot />
{/if}
<div class="h-40"></div>
<div class="fixed bottom-0">
	<NavigationBar></NavigationBar>
</div>
