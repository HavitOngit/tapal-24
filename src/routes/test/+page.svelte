<script lang="ts">
	import { version } from '$app/environment';
	import { onMount } from 'svelte';

	onMount(async () => {
		caches.open(`cache-${version}`).then(function (cache) {
			cache.keys().then(function (requests) {
				console.log(`Cache: ${version}`);
				const images = requests.filter(function (request) {
					return request.url.endsWith('.jpg') || request.url.endsWith('.png');
				});
				console.log({ images });
			});
		});
	});
</script>
