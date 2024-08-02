<script>
import { t } from 'svelte-intl-precompile';
	import NavigationBar from '$lib/finalize/NavigationBar.svelte';
	import { navigating } from '$app/stores';
	import '../app.pcss';
	import { ChevronLeft } from 'lucide-svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import LoadingBar from '$lib/components/extraFeatures/loadingBar.svelte';
	import { Toaster } from 'svelte-french-toast';
	import MobileConsole from '$lib/components/extraFeatures/mobile-console.svelte';
	import { onMount } from 'svelte';
	import Accpop from '$lib/components/extraFeatures/accpop.svelte';

	// translations
	import { addMessages, init } from 'svelte-intl-precompile';
	import gj from '$lib/locales/gj.json';
	import en from '$lib/locales/en.json';
	import dayjs from 'dayjs';
	addMessages('gj', gj);
	addMessages('en', en);

	onMount(() => {
		console.log(gj);

		init({
			initialLocale: 'gj',
			fallbackLocale: 'en'
		});
	});
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
				<ChevronLeft></ChevronLeft>{$t("Back")}</Badge>
		</button>
	</div>
	<a href="/" class="text-black">{$t("Home")}</a>
	<Accpop></Accpop>
</div>
<Toaster></Toaster>
{#if $navigating}
	<LoadingBar></LoadingBar>
{:else}
	<slot />
{/if}
<MobileConsole></MobileConsole>
<div class="h-40"></div>
<div class="fixed bottom-0">
	<NavigationBar></NavigationBar>
</div>
