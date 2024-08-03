<script lang="ts">
import { t } from 'svelte-intl-precompile';
	import * as Card from '$lib/components/ui/card';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import type { oneRate } from '$lib/custom_types';
	import { db } from '$lib/db';
	import { anajlist } from '$lib/predefined';
	import Rateform from './Rateform.svelte';
	import Button from './ui/button/button.svelte';
	import Input from './ui/input/input.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	import { SaveIcon } from 'lucide-svelte';
	import Label from './ui/label/label.svelte';
	import { getAllUsedAnajs } from '$lib/api';
	import toast from 'svelte-french-toast';
	import { onMount } from 'svelte';

	// for rate profile
	let next = false;
	let name: string = '';
	let ratelist: oneRate[];
	let rateProfile_id: number = 1;
	let api: CarouselAPI;

	const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	const preDATA = days.map((name) => {
		return { day: name, ratelist: [] };
	});
	let current_day = 0;

	const allUsedAnajs = new Map();

	// resume for days if form half copleted
	let isSaving = false;
	async function Save() {
		if (name.length == 0) {
			TriggerBtn.click();
			return;
		}
		isSaving = true;

		// saving profile name to db
		const id = await db.rates.add({ name: name });
		rateProfile_id = parseInt(id);

		const DATA = preDATA.map((obj) => {
			obj.ratelist.forEach((item) => {
				allUsedAnajs.set(item.name, true);
				item.rate = parseInt(item.rate);
			});

			return {
				...obj,
				rate_unit_id: rateProfile_id
			};
		});

		const status = await db.rate.bulkAdd(DATA);
		const usedAnajlist = await getAllUsedAnajs(rateProfile_id);
		if (status) {
			await db.rates.update(rateProfile_id, { used_anaj: usedAnajlist });
			isSaving = false;
			saved = true;
		}

		toast.success(`${name} created`);
		history.back();
	}

	function Next() {
		window.name = name;
		if (current_day < 7) {
			current_day += 1;
			api.scrollNext();
		}
	}

	function Back() {
		if (current_day > 0) {
			current_day -= 1;
			api.scrollPrev();
		}
	}

	let saved = false;

	// name prompt
	let TriggerBtn: HTMLButtonElement;
	let CancelBtn: HTMLButtonElement;

	onMount(() => {
		TriggerBtn.click();
	});
</script>

<div id="alerts">
	<AlertDialog.Root>
		<AlertDialog.Trigger bind:el={TriggerBtn}></AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title class="flex justify-between"></AlertDialog.Title>
				<AlertDialog.Description class="flex flex-col items-start justify-start gap-6">
					<div class="text-lg"></div>

					<div>
						<form
							on:submit={async (e) => {
								e.preventDefault();
								CancelBtn.click();
								if (current_day == 6) {
									await Save();
								}
							}}
							class=" flex items-center gap-3"
						>
							<Label class="text-lg font-medium">{$t("Name:")}</Label>
							<Input bind:value={name} type="text" autofocus />
							                                                                                                                          
						</form>
					</div>
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel class="hidden"
					><button bind:this={CancelBtn}>{$t("Cancel")}</button></AlertDialog.Cancel
				>
				<AlertDialog.Action
					type="submit"
					on:click={async () => {
						if (current_day == 6) {
							await Save();
						}
					}}>{current_day == 6 ? 'Create' : 'Set'}</AlertDialog.Action
				>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>

<div class="flex w-full flex-col gap-2">
	<div class="flex items-center gap-2">
		<Label>{$t("Name:")}</Label>
		<Input bind:value={name} placeholder="Enter Profile Name" />
	</div>

	<div>
		<Carousel.Root bind:api>
			<Carousel.Content>
				{#each preDATA as obj}
					<Carousel.Item>
						<Card.Root>
							<Card.Header>
								<Card.Title>
									{obj.day}
								</Card.Title>
							</Card.Header>
							<Card.Content>
								{#if isSaving}
									<div class="flex min-h-96 items-center justify-center">
										{#if saved}
											<div>{$t("saved")}</div>
										{:else}
											Saving...
										{/if}
									</div>
								{:else}
									<Rateform bind:ratelist={obj.ratelist} {anajlist}></Rateform>
								{/if}
							</Card.Content>
						</Card.Root>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
		</Carousel.Root>
	</div>
</div>

<div class="fixed bottom-24 w-full">
	<div class="mx-4 flex w-auto justify-between gap-10 bg-white">
		{#if current_day != 0}
			<Button class="w-full" variant="outline" on:click={Back}>{$t("Back")}</Button>
		{/if}

		{#if current_day == 6}
			<Button on:click={Save} class=" w-full"><SaveIcon class="mr-2 size-6"></SaveIcon>{$t("Save")}</Button
			>
		{:else}
			<Button class="w-full" on:click={Next}>{$t("Next")}</Button>
		{/if}
	</div>
</div>
