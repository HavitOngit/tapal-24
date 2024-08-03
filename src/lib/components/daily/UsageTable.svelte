<script lang="ts">
	import { t } from 'svelte-intl-precompile';
	import * as Table from '$lib/components/ui/table';
	import { Columns, Sticker } from 'lucide-svelte';

	type usageData = {
		name: string;
		amount: number;
	};
	export let usageData: usageData[];
	export let Rates: any[];
</script>

<div class=" max-h-96 overflow-y-auto">
	<Table.Root>
		<Table.Header class="sticky top-0">
			<Table.Row>
				<Table.Head class="w-[100px]" />
				<Table.Head>{$t('quantity')}</Table.Head>

				<Table.Head>{$t('Rate (g)')}</Table.Head>
			</Table.Row>
		</Table.Header>

		<Table.Body>
			{#each usageData as usage}
				<Table.Row>
					<Table.Cell class="font-medium">{$t(usage.name)}</Table.Cell>
					<Table.Cell>{usage.amount}kg</Table.Cell>
					<Table.Cell>{Number(Rates.find((obj) => obj.name == usage.name).rate)}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
