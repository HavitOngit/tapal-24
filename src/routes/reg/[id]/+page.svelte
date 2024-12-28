<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Regslot from '$lib/components/reg/regslot.svelte';
	import { db } from '$lib/db';
	import { liveQuery } from 'dexie';
	import { CalendarCheck2Icon, PercentIcon, SheetIcon, WarehouseIcon } from 'lucide-svelte';
	import toast from 'svelte-french-toast';
	import type { PageData } from './$types';
	import { t } from 'svelte-intl-precompile';
	import { onMount } from 'svelte';
	import type { Group } from '$lib/custom_types';

	export let data: PageData;

	const reg_data = liveQuery(() => db.group.where({ id: Number($page.params.id) }).toArray());

	let paths = [
		{
			name: $t('Attendance'),
			url: `reg/${$page.params.id}/atndce`,
			icon: CalendarCheck2Icon
		},
		{
			name: $t('Usage'),
			url: `reg/${$page.params.id}/view`,
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

	$: if ($reg_data) {
		let loaded = [
			{
				name: $t('Rate'),
				url: `rates/${Reg.rate_unit_id}`,
				icon: PercentIcon
			},
			{
				name: $t('Stocks'),
				url: `stocks/${Reg.storage_unit_id}`,
				icon: WarehouseIcon
			}
		];
		if (paths.length != 4) {
			paths = [...paths, ...loaded];
		}
	}

	let Reg: Group;
	onMount(async () => {
		// @ts-ignore
		Reg = await db.group.get(Number($page.params.id));
	});
</script>

<!-- // for update -->
{#if $reg_data}
	<div class="m-2 gap-2">
		<Regslot bind:DeleteNow forUpdate={true} regi={$reg_data[0]}></Regslot>
	</div>
	<div class="m-2 grid grid-cols-2 gap-2">
		{#each paths as elem}
			<div class=" rounded-md border p-5">
				<a href="/{elem.url}" class="flex flex-col items-center">
					<div class="flex h-8 w-14 items-center justify-center rounded-xl">
						<svelte:component this={elem.icon}></svelte:component>
					</div>
					<span>{elem.name}</span>
				</a>
			</div>
		{/each}
	</div>
{/if}
<!-- <UpdateEntry group_id={Number($page.params.id)}></UpdateEntry> -->
