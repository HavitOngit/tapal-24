<script lang="ts">
	import { db } from '$lib/db';
	import { liveQuery } from 'dexie';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	import { t } from 'svelte-intl-precompile';
	import Input from '$lib/components/ui/input/input.svelte';
	import toast from 'svelte-french-toast';
	import { string } from 'zod';

	const unilist = liveQuery(() => db.univarsalList.toArray());

	interface addtype {
		name: string;
		image: HTMLImageElement;
	}
	const addData = {
		name: '',
		image: ''
	};

	let userInput: HTMLInputElement;

	async function cacheImage(file: any) {
		const cacheID = await window.caches.keys();
		console.log(cacheID);

		const cache = await caches.open(cacheID[0]);
		const imageUrl = URL.createObjectURL(file);

		const response = new Response(file, {
			headers: { 'Content-Type': file.type }
		});

		// Cache the image using a unique key
		console.log({ imageUrl, response });

		await cache.put('/anaj_images/' + addData.name + '.png', response);

		return imageUrl;
	}

	function imageUpload() {
		//@ts-ignore
		const file = userInput.files[0];

		if (file) {
			const reader = new FileReader();
			reader.addEventListener('load', function () {
				addData.image = reader.result;
			});
			reader.readAsDataURL(file);

			return;
		}
	}

	function addNew() {
		console.log(addData);
		db.transaction('rw', db.univarsalList, async () => {
			if (addData.name == '') {
				return;
			}
			if ($unilist.find((item) => item.name == addData.name)) {
				toast.error('Already Exist');
				return;
			}
			if (userInput.files[0]) {
				const blobimg = await cacheImage(userInput.files[0]);
				addData.image = blobimg;
				console.log(addData);
			} else {
				addData.image = '/anaj_images/avg.png';
			}

			await db.univarsalList.add({ ...addData });
		}).then(() => {
			toast.success($t('Added Successfully'));
		});
	}

	let AddButton: HTMLButtonElement;
</script>

<div hidden>
	<AlertDialog.Root>
		<AlertDialog.Trigger bind:el={AddButton}></AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>{$t('New')}</AlertDialog.Title>
				<AlertDialog.Description>
					<img
						src={addData.image}
						alt={addData.name}
						class=" h-32 w-32 rounded-xl object-fill p-2"
					/>
					<div>
						<input type="file" accept="image/*" bind:this={userInput} on:change={imageUpload} />
					</div>

					<Input bind:value={addData.name} minlength={1} />
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>{$t('Cancel')}</AlertDialog.Cancel>
				<AlertDialog.Action on:click={addNew}>{$t('ADD')}</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>

<div class="m-3 grid grid-cols-3 gap-2">
	{#each $unilist || [] as anaj}
		<div class="relative flex flex-col items-center gap-2 rounded border">
			<div class=" h-32 w-32 rounded-xl">
				<img src={anaj.image} alt={anaj.name} class=" h-32 w-32 rounded-xl object-fill p-2" />
			</div>
			<p class="p-1 text-center text-lg font-semibold text-gray-600">{$t(anaj.name)}</p>
		</div>
	{/each}
	<button
		on:click={() => {
			AddButton.click();
		}}
	>
		<div
			class="flex h-44 w-auto border-spacing-20 flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-300 bg-blue-50"
		>
			<p class=" text-center font-semibold text-blue-400">+ {$t('New')}</p>
		</div>
	</button>
</div>
