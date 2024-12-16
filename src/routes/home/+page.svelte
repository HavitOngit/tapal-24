<script lang="ts">
	import Accpop from '$lib/components/extraFeatures/accpop.svelte';
	import type { MoreLinkSection } from '$lib/custom_types';
	import LinkSection from '$lib/finalize/LinkSection.svelte';

	let Entry: MoreLinkSection[] = [
		{
			name: 'day by day',
			href: '/dailywork'
		},
		{
			name: 'monthly Entry',
			href: '/monthlyEntry'
		}
	];

	let Anaj: MoreLinkSection[] = [
		{
			name: 'Rates',
			href: '/rates'
		},
		{
			name: 'stocks',
			href: '/stocks'
		},
		{
			name: 'Create report',
			href: '/report'
		}
	];

	let Money: MoreLinkSection[] = [
		{
			name: 'Money Rates',
			href: '/money-rates'
		},
		{
			name: 'Money Calculator',
			href: '/money-calc'
		}
	];

	let Other: MoreLinkSection[] = [
		{
			name: 'help',
			href: '/help'
		},
		{
			name: 'Account',
			href: '/acc'
		},
		{
			name: 'settings',
			href: '/settings'
		}
	];
</script>

<div class="flex flex-col gap-4">
	<LinkSection sectionName="Entry" list={Entry}></LinkSection>
	<LinkSection sectionName="Anaj" list={Anaj}></LinkSection>
	<LinkSection sectionName="Money" list={Money}></LinkSection>
	<LinkSection sectionName="Other" list={Other}></LinkSection>
</div>
