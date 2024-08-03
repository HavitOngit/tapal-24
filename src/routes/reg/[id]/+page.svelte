<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Regslot from '$lib/components/reg/regslot.svelte';
	import { db } from '$lib/db';
	import { liveQuery } from 'dexie';
	import { CalendarCheck2Icon, SheetIcon } from 'lucide-svelte';
	import toast from 'svelte-french-toast';
	import type { PageData } from './$types';
	import { t } from 'svelte-intl-precompile';

	export let data: PageData;

	const reg_data = liveQuery(() => db.group.where({ id: Number($page.params.id) }).toArray());

	const paths = [
		{
			name: $t('Attendance'),
			url: 'atndce',
			icon: CalendarCheck2Icon
		},
		{
			name: $t('Usage'),
			url: 'view',
			icon: SheetIcon
		}
	];

	function deleteRegi() {
		db.transaction('rw', db.group, db.usage, db.attendance, async () => {
			await db.usage.bulkDelete(
				(await db.usage.where({ group_id: $reg_data[0].id }).toArray()).map((obj) => obj.id)
			);

			await db.attendance.bulkDelete(
				(await db.attendance.where({ group_id: $reg_data[0].id }).toArray()).map((obj) => obj.id)
			);

			await db.group.delete($reg_data[0].id);
		})
			.then(() => {
				toast.success($t('Deleted Successfully'));
				goto('/reg');
			})
			.catch((e) => {
				console.log(e);

				toast.error($t('Failed to delete'));
			});
	}

	let DeleteNow = false;
	$: if (DeleteNow) {
		deleteRegi();
	}
</script>

<!-- // for update -->
<div class="m-2 gap-2">
	{#if $reg_data}
		<Regslot bind:DeleteNow forUpdate={true} regi={$reg_data[0]}></Regslot>
	{/if}
</div>
<div class="m-2 grid grid-cols-2 gap-2">
	{#each paths as elem}
		<div class=" rounded-md border p-5">
			<a href="/reg/{$page.params.id}/{elem.url}" class="flex flex-col items-center">
				<div class="flex h-8 w-14 items-center justify-center rounded-xl">
					<svelte:component this={elem.icon}></svelte:component>
				</div>
				<span>{elem.name}</span>
			</a>
		</div>
	{/each}
</div>

<!-- <UpdateEntry group_id={Number($page.params.id)}></UpdateEntry> -->
