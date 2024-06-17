<script>
	import NavigationBar from '$lib/finalize/NavigationBar.svelte';
	import { navigating } from '$app/stores';
	import '../app.pcss';
	import { ChevronLeft } from 'lucide-svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import LoadingBar from '$lib/components/extraFeatures/loadingBar.svelte';
	import { Toaster } from 'svelte-french-toast';
</script>

<div class=" flex h-11 w-full items-center justify-between bg-white">
	<div class=" justify-start">
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
	<a href="/account" class="right-0 m-2 rounded-xl">
		<img src="/impatient-kitty.gif" class="size-8" alt="account" />
	</a>
</div>
<Toaster></Toaster>
{#if $navigating}
	<LoadingBar></LoadingBar>
{:else}
	<slot />
{/if}
<div class="h-40"></div>
<div class="fixed bottom-0">
	<NavigationBar></NavigationBar>
</div>
