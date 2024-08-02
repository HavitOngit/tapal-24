<script lang="ts">
import { t } from 'svelte-intl-precompile';
	import type { PageData } from './$types';

	import Button from '$lib/components/ui/button/button.svelte';
	import { db } from '$lib/db';
	import { exportDB } from 'dexie-export-import';
	import { DatabaseBackupIcon, DownloadIcon } from 'lucide-svelte';

	async function download() {
		const blob = await exportDB(db, { prettyJson: true });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `anajDB-${new Date().toLocaleDateString()}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<div class=" flex h-screen flex-col items-center justify-center gap-10">
	<div class="flex flex-col">
		<DatabaseBackupIcon size={150}></DatabaseBackupIcon>
		<p class="text-center text-3xl font-bold">{$t("BackUp")}</p>
	</div>

	<div>
		<Button on:click={download} class="flex gap-2">
			<DownloadIcon></DownloadIcon>
			<p>{$t("Download")}</p>
		</Button>
	</div>
</div>
