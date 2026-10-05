<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import { page } from '$app/state';
	import { onNavigate } from '$app/navigation';

	// Cinematic page changes: shared elements (painting, framed tile, title)
	// morph between pages; app.css choreographs the rest.
	onNavigate((navigation) => {
		if (!document.startViewTransition || navigation.from?.url.pathname === navigation.to?.url.pathname) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	let { children } = $props();

	const nav = [
		{ href: '/work', label: 'Exhibitions' },
		{ href: '/about', label: 'About' }
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<a href="#main" class="skip-link focus:skip-link-focus">Skip to content</a>

<div
	class:home-route={page.url.pathname === '/'}
	class:case-route={page.url.pathname.startsWith('/work/')}
	class="site-shell min-h-screen flex flex-col mx-auto max-w-[var(--container-content)]"
>
	<header
		class="site-header px-5 sm:px-6 md:px-10 py-4 sm:py-5 flex items-center justify-between gap-6"
		style="view-transition-name: site-header;"
	>
		<a href="/" class="wordmark inline-flex items-center min-h-[2.75rem] py-2">
			<span aria-hidden="true">MR</span>
			<span class="sr-only">Micaela, Home</span>
		</a>

		<div class="hidden md:flex items-center status-chip" aria-label="Design practice">
			<span>Digital exhibitions · 2021—now</span>
		</div>

		<nav aria-label="Primary" class="flex gap-1 nav-cluster">
			{#each nav as item}
				{@const active = page.url.pathname === item.href || page.url.pathname.startsWith(item.href + '/')}
				<a
					href={item.href}
					aria-current={active ? 'page' : undefined}
					class:active
					class="nav-link inline-flex items-center min-h-[2.75rem] px-4 py-2"
				>
					{item.label}
				</a>
			{/each}
		</nav>
	</header>

	<main id="main" class="flex-1">
		{@render children()}
	</main>

	<footer
		class="site-footer mx-5 sm:mx-6 md:mx-10 py-8 mt-16 sm:mt-24 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
	>
		<span class="micro-label">© {new Date().getFullYear()} Micaela Ribeiro</span>
		<span class="footer-thought">Curating products, systems and attention.</span>
		<a href="mailto:micaela.f.ribeiro@gmail.com" class="micro-label link-arrow">Start a conversation ↗</a>
	</footer>
</div>
