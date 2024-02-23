<script lang="ts">
	import type { Attendance } from '$lib/custom_types';
	import AttendanceSlot from '../daily/Attendance.svelte';

	export let attendance: Attendance;

	let boys: number = attendance.boys;
	let girls: number = attendance.girls;

	$: total = boys + girls;
</script>

<AttendanceSlot bind:boys bind:girls></AttendanceSlot>
