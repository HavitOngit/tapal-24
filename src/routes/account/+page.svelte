<script lang="ts">
	import type { PageData } from './$types';
	import { t } from 'svelte-intl-precompile';

	export let data: PageData;
</script>

{$t('username')}
