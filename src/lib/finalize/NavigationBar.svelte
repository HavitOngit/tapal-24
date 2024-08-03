<script lang="ts">
	import { page } from '$app/stores';
	import { Warehouse, LibraryBig, BadgePercent, ListTodo, Percent } from 'lucide-svelte';
	import { t } from 'svelte-intl-precompile';

	const paths = [
		{
			name: $t('To-Do'),
			href: '/dailywork',
			icon: ListTodo
		},
		{
			name: $t('Registers'),
			href: '/reg',
			icon: LibraryBig
		},
		{
			name: $t('Rates'),
			href: '/rates',
			icon: Percent
		},
		{
			name: $t('Stocks'),
			href: '/stocks',
			icon: Warehouse
		}
	];
</script>

<!-- <div>
	{$page.url.pathname}
</div> -->
<!-- <div class="grid w-[100%] grid-cols-4">
	<div>
		<a href="/stocks">stocks</a>
	</div>
	<div>
		<a href="/rates">rates </a>
	</div>
	<div>
		<a href="/reg">Registers</a>
	</div>
	<div>
		<a href="/dailywork">DailyWork</a>
	</div>
</div> -->
<div class=" flex w-screen justify-evenly gap-6 rounded-t-xl bg-blue-100">
	{#each paths as elem}
		<div class="m-2">
			<a href={elem.href} class="flex flex-col items-center">
				<div
					class="{String($page.url.pathname).includes(elem.href)
						? 'bg-blue-400 '
						: 'opacity-70'}  flex h-8 w-14 items-center justify-center rounded-xl"
				>
					<svelte:component this={elem.icon}></svelte:component>
				</div>
				<span
					class={String($page.url.pathname).includes(elem.href)
						? 'font-semibold opacity-100'
						: 'opacity-70'}>{elem.name}</span
				>
			</a>
		</div>
	{/each}
</div>
<div class="h-3 bg-blue-100"></div>

<!-- fill={String($page.url.pathname).includes(elem.href) ? 'black' : ' white'} -->
