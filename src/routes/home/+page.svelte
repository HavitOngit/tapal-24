<script lang="ts">
	import Accpop from '$lib/components/extraFeatures/accpop.svelte';
	import type { MoreLinkSection } from '$lib/custom_types';
	import LinkSection from '$lib/finalize/LinkSection.svelte';
	import {
		CalculatorIcon,
		CalendarClockIcon,
		CalendarHeartIcon,
		CalendarRangeIcon,
		HelpCircleIcon,
		PercentCircleIcon,
		PercentIcon,
		ReceiptTextIcon,
		SettingsIcon,
		UserCircle2Icon,
		WarehouseIcon
	} from 'lucide-svelte';

	let Entry: MoreLinkSection[] = [
		{
			name: 'dayWise Entry',
			href: '/dailywork',
			icon: CalendarClockIcon
		},
		{
			name: 'monthly Entry',
			href: '/monthlyEntry',
			icon: CalendarRangeIcon
		}
	];

	let Anaj: MoreLinkSection[] = [
		{
			name: 'Rates',
			href: '/rates',
			icon: PercentIcon
		},
		{
			name: 'stocks',
			href: '/stocks',
			icon: WarehouseIcon
		},
		{
			name: 'Report',
			href: '/report',
			icon: ReceiptTextIcon
		}
	];

	let Money: MoreLinkSection[] = [
		{
			name: 'Money Rates',
			href: '/money-rates',
			icon: PercentCircleIcon
		},
		{
			name: 'Money Calculator',
			href: '/money-calc',
			icon: CalculatorIcon
		}
	];

	let Other: MoreLinkSection[] = [
		{
			name: 'help',
			href: '/help',
			icon: HelpCircleIcon
		},
		{
			name: 'Account',
			href: '/acc',
			icon: UserCircle2Icon
		},
		{
			name: 'settings',
			href: '/settings',
			icon: SettingsIcon
		}
	];
</script>

<div class="flex flex-col gap-4">
	<LinkSection sectionName="Entry" list={Entry}></LinkSection>
	<LinkSection sectionName="Anaj" list={Anaj}></LinkSection>
	<LinkSection sectionName="Money" list={Money}></LinkSection>
	<LinkSection sectionName="Other" list={Other}></LinkSection>
</div>
