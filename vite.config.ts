import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'
import { defineConfig } from 'vite';


const manifest = {
	"short_name": "tapal-24",
	"name": "tapal-24",
	"icons": [
		{
			"src": "/favicon.png",
			"sizes": "512x512",
			"type": "image/png"
		}
	],
	"id": "/",
	"start_url": "/",
	"background_color": "#bbdefb",

	"scope": "/",
	"theme_color": "#bbdefb",
	"shortcuts": [
		{
			"name": "+ Create",
			"short_name": "Create",
			"description": "Create a new Board",
			"url": "/?source=pwa",

		}
	],
	"description": "Tapal 24",

}

export default defineConfig({
	plugins: [sveltekit(),
	SvelteKitPWA({ manifest: manifest })]
});
