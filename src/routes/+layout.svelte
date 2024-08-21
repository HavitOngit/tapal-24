<script>
	import { navigating } from '$app/stores';
	import Accpop from '$lib/components/extraFeatures/accpop.svelte';
	import LoadingBar from '$lib/components/extraFeatures/loadingBar.svelte';
	import MobileConsole from '$lib/components/extraFeatures/mobile-console.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import NavigationBar from '$lib/finalize/NavigationBar.svelte';
	import { ChevronLeft, Cloud, LucideCloudOff } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';
	import { t } from 'svelte-intl-precompile';
	import '../app.pcss';
	// translations
	import en from '$lib/locales/en.json';
	import gu from '$lib/locales/gu.json';
	import hi from '$lib/locales/hi.json';
	import { addMessages, init } from 'svelte-intl-precompile';
	import { dev } from '$app/environment';
	import Headertwo from '$lib/finalize/headertwo.svelte';
	import * as cDB from '$lib/changesDB';
	addMessages('gu', gu);
	addMessages('en', en);
	addMessages('hi', hi);

	onMount(() => {
		const lang = localStorage.getItem('locale') || localStorage.setItem('locale', 'gu');
		navigator.serviceWorker.register('/service-worker.js', { type: dev ? 'module' : 'classic' });
		init({
			initialLocale: String(lang),
			fallbackLocale: 'en'
		});
	});
</script>

<div class=" my-1 flex h-12 w-full items-center justify-between bg-white p-2">
	<div class=" justify-start">
		<!-- <button
			on:click={() => {
				history.back();
			}}
			class="flex"
		>
			<Badge variant="outline" class=" text-black">
				<ChevronLeft></ChevronLeft>{$t('Back')}</Badge
			>
		</button> -->
		<p class="text-xl font-semibold">MDM <span class="text-sm"> assistant </span></p>
	</div>
	<!-- <a href="/" class="text-black">{$t('Home')}</a> -->
	<!-- <Accpop></Accpop> -->
	<div class="flex items-center gap-3">
		<!-- <LucideCloudOff></LucideCloudOff> -->
		<Headertwo></Headertwo>
	</div>
</div>
<hr />
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
