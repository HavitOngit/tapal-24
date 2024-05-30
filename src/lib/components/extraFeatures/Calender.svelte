<script lang="ts">
	import { CalendarDays } from 'lucide-svelte';
	import { type DateValue, DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Popover from '$lib/components/ui/popover';
	import Badge from '../ui/badge/badge.svelte';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	export let value: DateValue | undefined = undefined;
	export const today = new Date();
</script>

<Popover.Root>
	<Popover.Trigger>
		<!-- <Button
			variant="outline"
			class={cn('w-[240px] justify-start text-left font-normal', !value && 'text-muted-foreground')}
			builders={[builder]}
		>
			<CalendarDays class="mr-2 h-4 w-4" />
			{value ? df.format(value.toDate(getLocalTimeZone())) : df.format(today)}
		</Button> -->
		<button>
			<Badge>
				{value ? df.format(value.toDate(getLocalTimeZone())) : df.format(today)}
			</Badge>
		</button>
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0" align="start">
		<Calendar bind:value />
	</Popover.Content>
</Popover.Root>
