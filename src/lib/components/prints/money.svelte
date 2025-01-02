<script lang="ts">
	import type { oneRate } from '$lib/custom_types';
	import { onMount } from 'svelte';

	interface Onevouture {
		name: string;
		value: number;
		holding?: number;
	}
	interface calcData {
		name: number;
		money: number;
		hajari: number;
		items: {
			rate_data: oneRate;
			money: number;
			used: number;
			vauture: Onevouture[];
		}[];
	}
	export let data1: calcData;
	export let data2: calcData;
	export let date: string;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	const WIDTH = 1200;
	const HEIGHT = 1600;
	const PADDING = 40;
	const LINE_HEIGHT = 30;

	onMount(() => {
		ctx = canvas.getContext('2d');
		drawReport();
	});

	function drawReport() {
		// Clear canvas and set background
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, WIDTH, HEIGHT);

		// Set default text styles
		ctx.fillStyle = '#000000';
		ctx.font = '20px Arial';

		let y = PADDING;

		// Draw header
		ctx.font = 'bold 32px Arial';
		ctx.fillText('Financial Report', PADDING, y);
		y += LINE_HEIGHT * 2;

		// Draw summary
		ctx.font = '24px Arial';
		const totalAttendance = (data1.hajari || 0) + (data2.hajari || 0);
		const totalMoney = (data1.money || 0) + (data2.money || 0);

		ctx.fillText(`Date: ${date}`, PADDING, y);
		y += LINE_HEIGHT;
		ctx.fillText(`Total Attendance: ${totalAttendance}`, PADDING, y);
		y += LINE_HEIGHT;
		ctx.fillText(`Total Money: ${totalMoney}`, PADDING, y);
		y += LINE_HEIGHT * 2;

		// Draw data sets
		drawDataSet('Data Set 1', data1, y);
		y += calculateDataSetHeight(data1) + LINE_HEIGHT * 2;
		drawDataSet('Data Set 2', data2, y);
	}

	function drawDataSet(title: string, data: calcData, startY: number) {
		let y = startY;

		// Draw section title
		ctx.font = 'bold 28px Arial';
		ctx.fillText(title, PADDING, y);
		y += LINE_HEIGHT * 1.5;

		// Draw main data
		ctx.font = '20px Arial';
		ctx.fillText(`Name: ${data.name}`, PADDING, y);
		y += LINE_HEIGHT;
		ctx.fillText(`Money: ${data.money}`, PADDING, y);
		y += LINE_HEIGHT;
		ctx.fillText(`Hajari: ${data.hajari}`, PADDING, y);
		y += LINE_HEIGHT * 1.5;

		// Draw items
		data.items.forEach((item, index) => {
			// Draw item header
			ctx.font = 'bold 24px Arial';
			ctx.fillText(`Item ${index + 1}`, PADDING + 20, y);
			y += LINE_HEIGHT;

			// Draw item details
			ctx.font = '20px Arial';
			ctx.fillText(`Rate Name: ${item.rate_data.name}`, PADDING + 40, y);
			y += LINE_HEIGHT;
			ctx.fillText(`Rate: ${item.rate_data.rate}`, PADDING + 40, y);
			y += LINE_HEIGHT;
			ctx.fillText(`Money: ${item.money}`, PADDING + 40, y);
			y += LINE_HEIGHT;
			ctx.fillText(`Used: ${item.used}`, PADDING + 40, y);
			y += LINE_HEIGHT;

			const leftMoney = item.money - (item.used || 0);
			ctx.fillText(`Left Money: ${leftMoney}`, PADDING + 40, y);
			y += LINE_HEIGHT * 1.5;

			// Draw voutures
			item.vauture.forEach((v, vIndex) => {
				ctx.font = 'bold 22px Arial';
				ctx.fillText(`Vouture ${vIndex + 1}`, PADDING + 60, y);
				y += LINE_HEIGHT;

				ctx.font = '20px Arial';
				ctx.fillText(`Name: ${v.name}`, PADDING + 80, y);
				y += LINE_HEIGHT;
				ctx.fillText(`Value: ${v.value}`, PADDING + 80, y);
				y += LINE_HEIGHT;
				if (v.holding) {
					ctx.fillText(`Holding: ${v.holding}`, PADDING + 80, y);
					y += LINE_HEIGHT;
				}
				y += LINE_HEIGHT * 0.5;
			});

			y += LINE_HEIGHT;
		});
	}

	function calculateDataSetHeight(data: calcData): number {
		let height = LINE_HEIGHT * 6; // Basic info

		data.items.forEach((item) => {
			height += LINE_HEIGHT * 7; // Item basic info
			height += item.vauture.length * LINE_HEIGHT * 4; // Vouture entries
		});

		return height;
	}

	// Sharing functions
	async function downloadCanvas() {
		const link = document.createElement('a');
		link.download = `financial-report-${date}.png`;
		link.href = canvas.toDataURL('image/png');
		link.click();
	}

	async function shareCanvas() {
		try {
			const blob = await new Promise<Blob>((resolve) => {
				canvas.toBlob((blob) => resolve(blob));
			});

			if (navigator.share) {
				await navigator.share({
					files: [new File([blob], 'financial-report.png', { type: 'image/png' })],
					title: 'Financial Report',
					text: `Financial Report - ${date}`
				});
			} else {
				// Fallback for browsers that don't support native sharing
				downloadCanvas();
			}
		} catch (error) {
			console.error('Error sharing canvas:', error);
			alert('Failed to share canvas. Please try downloading instead.');
		}
	}
</script>

<div class="report-container">
	<canvas bind:this={canvas} width={WIDTH} height={HEIGHT} />

	<div class="button-container">
		<button on:click={downloadCanvas}>Download</button>
		<button on:click={shareCanvas}>Share</button>
	</div>
</div>

<style>
	.report-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
	}

	canvas {
		border: 1px solid #ccc;
		max-width: 100%;
		height: auto;
	}

	.button-container {
		display: flex;
		gap: 1rem;
	}

	button {
		padding: 0.5rem 1rem;
		background-color: #4caf50;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover {
		background-color: #45a049;
	}
</style>
