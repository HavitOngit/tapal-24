<script lang="ts">
	import { page, navigating } from '$app/stores';
	// import { SignIn, SignOut } from '@auth/sveltekit/components';
	// import Button from './components/ui/button/button.svelte';
	// import { Dialog, DialogClose, DialogTrigger } from './components/ui/dialog';
	// import Avatar from './components/ui/avatar/avatar.svelte';
	// import AvatarImage from './components/ui/avatar/avatar-image.svelte';
	// import AvatarFallback from './components/ui/avatar/avatar-fallback.svelte';
	// import DialogContent from './components/ui/dialog/dialog-content.svelte';
	import {
		ContactIcon,
		ReceiptIndianRupee,
		Cloud,
		HelpCircle,
		MessageCircleHeart,
		Settings
	} from 'lucide-svelte';
	import { Dialog, DialogClose, DialogContent, DialogTrigger } from '../ui/dialog';
	import { Button } from '../ui/button';
	import Avatar from '../ui/avatar/avatar.svelte';
	import AvatarImage from '../ui/avatar/avatar-image.svelte';
	import AvatarFallback from '../ui/avatar/avatar-fallback.svelte';
	// import Table from './components/ui/table/table.svelte';
	// import TableHeader from './components/ui/table/table-header.svelte';
	// import TableRow from './components/ui/table/table-row.svelte';
	// import TableHead from './components/ui/table/table-head.svelte';
	// import TableBody from './components/ui/table/table-body.svelte';
	// import TableCell from './components/ui/table/table-cell.svelte';

	const lisnks = [
		{ name: 'Account', href: '/account', icon: ContactIcon },
		{ name: 'BackUp', href: '/backup', icon: Cloud },
		{ name: 'Payments', href: '/payments', icon: ReceiptIndianRupee },
		{ name: 'Feedback', href: '/feedback', icon: MessageCircleHeart },
		{ name: 'Help', href: '/help', icon: HelpCircle },
		{ name: 'Settings', href: '/settings', icon: Settings }
	];

	let closeBtn: HTMLButtonElement;
	function closeDiloag() {
		closeBtn.click();
	}
</script>

<header>
	<Dialog>
		<DialogTrigger>
			<!-- <img src="/impatient-kitty.gif" class="size-8" alt="account" /> -->
			<Avatar class="border">
				<AvatarImage src={$page.data?.session?.user?.image ?? '/impatient-kitty.gif'} alt="profile"
				></AvatarImage>
				<AvatarFallback>{$page.data?.session?.user?.name?.substring(0, 2)}</AvatarFallback>
			</Avatar>
		</DialogTrigger>
		<DialogContent>
			<div class="flex flex-col gap-7">
				<div class="rounded-3xl pb-3">
					<div class="flex justify-center">
						<Avatar class="size-28">
							<AvatarImage
								src={$page.data?.session?.user?.image ?? '/impatient-kitty.gif'}
								alt="profile"
							></AvatarImage>
							<AvatarFallback>{$page.data?.session?.user?.name?.substring(0, 2)}</AvatarFallback>
						</Avatar>
					</div>

					<div>
						<span class="block text-center text-lg font-semibold">
							{$page.data?.session?.user?.name}
						</span>
						<span class="block text-center text-sm text-gray-500">
							{$page.data?.session?.user?.email}
						</span>
					</div>
				</div>
				<div>
					<hr />
					<div class="mt-2 flex flex-col gap-5">
						{#each lisnks as link}
							<a href={link.href}>
								<Button variant="link" class="flex w-full justify-start" on:click={closeDiloag}>
									<div class="flex items-center justify-items-center gap-2">
										<div class="mx-4">
											<svelte:component this={link.icon} class="h-6 w-6"></svelte:component>
										</div>
										<p class="text-center">{link.name}</p>
									</div>
								</Button>
							</a>
						{/each}
					</div>
				</div>
				<div class="flex justify-center">
					{#if $page.data.session}
						<!-- <SignOut signOutPage="signout">
							<Button slot="submitButton">
								<LogOutIcon></LogOutIcon>
								<p>Sign Out</p></Button
							>
						</SignOut> -->
					{:else}
						<!-- <SignIn>
							<Button slot="submitButton">Sign In</Button>
						</SignIn> -->
					{/if}
				</div>

				<!-- <div>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead class="w-20"></TableHead>
								<TableHead></TableHead>
							</TableRow>
							<TableBody>
								{#each lisnks as link}
									<button on:click={closeDiloag}>
										<a href={link.href}>
											<TableRow class="w-full">
												<TableCell>
													<svelte:component this={link.icon} class="h-6 w-6"></svelte:component>
												</TableCell>
												<TableCell>
													<span>{link.name}</span>
												</TableCell>
											</TableRow>
										</a>
									</button>
								{/each}
							</TableBody>
						</TableHeader>
					</Table>
				</div> -->
			</div>
			<DialogClose bind:el={closeBtn}></DialogClose>
		</DialogContent>
	</Dialog>
</header>

<!-- <div class="block min-h-1">
	<div class="-top-0">
		<img
			alt="User avatar"
			src={$page.data?.session?.user?.image ?? 'https://source.boringavatars.com/marble/120'}
			class="avatar"
		/>
		{#if $page.data.session}
			<span class="signedInText">
				{$page.data.session.user?.email ?? $page.data.session.user?.name}
			</span>
			<SignOut signOutPage="signout">
				<div slot="submitButton" class="buttonPrimary"><Button>log out</Button></div>
			</SignOut>

			<!-- <button
					class="buttonPrimary"
					on:click={() => {
						browser.
					}}>Sign out</button
				> -->
<!-- {:else}
			<span class="notSignedInText">You are not signed in</span>
			<SignIn>
				<div slot="submitButton" class="buttonPrimary">Sign in</div>
			</SignIn>
		{/if}
	</div>
</div> -->
