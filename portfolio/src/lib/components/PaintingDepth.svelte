<script lang="ts">
	import { onMount } from 'svelte';
	import type { PaintingDepthConfig } from '$lib/gallery-depth';

	let { src, active, config, index }: { src: string; active: boolean; config: PaintingDepthConfig; index: number } = $props();
	const id = $props.id();
	let scene: HTMLDivElement;
	let planes: HTMLDivElement[] = $state([]);
	let loaded = $state(false);
	let reduced = $state(true);
	const ready = $derived(loaded && !reduced);
	let refresh: ((visible: boolean) => void) | undefined;
	$effect(() => {
		// Always track active, including the first run before onMount assigns
		// refresh. Optional chaining alone would skip reading the dependency.
		const visible = active;
		refresh?.(visible);
	});

	onMount(() => {
		const motion = matchMedia('(prefers-reduced-motion: reduce)');
		const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
		let disposed = false, loading = false;
		let frame = 0, previousTime = 0;
		let x = 0, y = 0, targetX = 0, targetY = 0, drift = 0;
		const clamp = (value: number) => Math.max(-1, Math.min(1, value));
		const stop = () => { cancelAnimationFrame(frame); frame = 0; previousTime = 0; };
		const paint = () => {
			// A single rigid translation per plane. Never deform artwork pixels.
			const rates = [[1, .7], [4, 2.8], [10, 6]];
			planes.forEach((plane, i) => {
				if (plane) plane.style.transform = `translate3d(${(x * rates[i][0]).toFixed(3)}px, ${(y * rates[i][1]).toFixed(3)}px, 0)`;
			});
		};
		const draw = (time: number) => {
			frame = 0;
			if (!ready || !active || document.hidden) { previousTime = 0; return; }
			const delta = previousTime ? Math.min(time - previousTime, 64) : 16;
			previousTime = time;
			const ease = 1 - Math.exp(-delta / 180), nextY = clamp(targetY + drift);
			x += (targetX - x) * ease; y += (nextY - y) * ease;
			if (Math.abs(targetX - x) + Math.abs(nextY - y) < .0005) {
				x = targetX; y = nextY; previousTime = 0;
			} else frame = requestAnimationFrame(draw);
			paint();
		};
		const requestDraw = () => {
			if (!frame && ready && active && !document.hidden) frame = requestAnimationFrame(draw);
		};
		const readScroll = () => {
			// Each painting has its own scroll origin; later projects don't start
			// with a saturated drift from the total document scroll position.
			const tile = document.querySelectorAll('.project-tile')[index];
			const rect = tile?.getBoundingClientRect();
			const grid = !!document.querySelector('.gallery.grid-mode');
			drift = rect && !grid ? clamp((innerHeight / 2 - rect.top - rect.height / 2) / (innerHeight * .5)) * .65 : 0;
			requestDraw();
		};
		const resize = () => {
			const width = scene.clientWidth, height = scene.clientHeight;
			const scale = Math.max(width / config.width, height / config.height);
			const position = innerWidth <= 760 ? config.mobilePosition : config.position;
			scene.style.setProperty('--art-width', `${config.width * scale}px`);
			scene.style.setProperty('--art-height', `${config.height * scale}px`);
			scene.style.setProperty('--art-left', `${(width - config.width * scale) * position[0]}px`);
			scene.style.setProperty('--art-top', `${(height - config.height * scale) * position[1]}px`);
			readScroll();
		};
		const load = async () => {
			if (loading || loaded || motion.matches || !active) return;
			loading = true;
			try {
				await Promise.all([src, config.segmentation, config.cleanPlate, config.farPlate].map((url) => {
					const image = new Image(); image.src = url; return image.decode();
				}));
				if (!disposed) { loaded = true; resize(); requestDraw(); }
			} catch { /* The original still remains visible if any layer fails. */ }
			finally { loading = false; }
		};
		const preference = () => {
			stop(); reduced = motion.matches;
			x = y = targetX = targetY = drift = 0; paint(); resize();
			void load();
		};
		const pointer = (event: PointerEvent) => {
			if (!active || !ready || !finePointer.matches || event.pointerType !== 'mouse') return;
			targetX = clamp(event.clientX / innerWidth * 2 - 1);
			targetY = clamp(event.clientY / innerHeight * 2 - 1) * .65;
			requestDraw();
		};
		const rest = () => { targetX = targetY = 0; requestDraw(); };
		const visibility = () => { if (document.hidden) stop(); else { rest(); readScroll(); } };
		const observer = new ResizeObserver(resize); observer.observe(scene);
		refresh = (visible) => { if (!visible) stop(); else { void load(); rest(); readScroll(); } };
		preference();
		motion.addEventListener('change', preference); finePointer.addEventListener('change', preference);
		window.addEventListener('pointermove', pointer, { passive: true });
		window.addEventListener('scroll', readScroll, { passive: true });
		window.addEventListener('blur', rest);
		document.documentElement.addEventListener('pointerleave', rest);
		document.addEventListener('visibilitychange', visibility);
		return () => {
			disposed = true; refresh = undefined; stop(); observer.disconnect();
			motion.removeEventListener('change', preference); finePointer.removeEventListener('change', preference);
			window.removeEventListener('pointermove', pointer); window.removeEventListener('scroll', readScroll);
			window.removeEventListener('blur', rest); document.documentElement.removeEventListener('pointerleave', rest);
			document.removeEventListener('visibilitychange', visibility);
		};
	});
</script>

<div bind:this={scene} class="depth-scene" class:ready aria-hidden="true" data-painting-depth="three-rigid-planes" data-painting-index={index}>
	{#if loaded}
		<svg class="mask-definitions" aria-hidden="true">
			<defs>
				<filter id={`${id}-foreground-select`} color-interpolation-filters="sRGB">
					<feComponentTransfer><feFuncR type="linear" slope="20" intercept="-15" /><feFuncG type="linear" slope="20" intercept="-15" /><feFuncB type="linear" slope="20" intercept="-15" /></feComponentTransfer>
					<feMorphology operator="dilate" radius="2" />
				</filter>
				<filter id={`${id}-far-select`} color-interpolation-filters="sRGB">
					<feComponentTransfer><feFuncR type="linear" slope="-20" intercept="5" /><feFuncG type="linear" slope="-20" intercept="5" /><feFuncB type="linear" slope="-20" intercept="5" /></feComponentTransfer>
				</filter>
				<filter id={`${id}-inverse`} color-interpolation-filters="sRGB">
					<feComponentTransfer><feFuncR type="linear" slope="-1" intercept="1" /><feFuncG type="linear" slope="-1" intercept="1" /><feFuncB type="linear" slope="-1" intercept="1" /></feComponentTransfer>
				</filter>
				{#each ['foreground', 'far'] as region}
					<g id={`${id}-${region}-shape`}>
						{#if region === 'far' && config.farPath}
							<rect width={config.width} height={config.height} fill="black" />
							<path d={config.farPath} transform={`scale(${config.width / 1000} ${config.height / 1000})`} fill="white" />
						{:else}
							<image href={config.segmentation} width={config.width} height={config.height} preserveAspectRatio="none" filter={`url(#${id}-${region}-select)`} />
						{/if}
						{#if region === 'foreground' && config.foregroundFillFrom}
							<rect y={config.height * config.foregroundFillFrom} width={config.width} height={config.height * (1 - config.foregroundFillFrom)} fill="white" />
						{/if}
					</g>
					<mask id={`${id}-${region}`} maskUnits="userSpaceOnUse" x="0" y="0" width={config.width} height={config.height} style="mask-type:luminance"><use href={`#${id}-${region}-shape`} /></mask>
					<mask id={`${id}-not-${region}`} maskUnits="userSpaceOnUse" x="0" y="0" width={config.width} height={config.height} style="mask-type:luminance"><use href={`#${id}-${region}-shape`} filter={`url(#${id}-inverse)`} /></mask>
				{/each}
			</defs>
		</svg>
		<div bind:this={planes[0]} class="layer far" data-depth-layer={config.layers[0]}>
			<svg class="art" viewBox={`0 0 ${config.width} ${config.height}`}>
				<image href={config.farPlate} width={config.width} height={config.height} preserveAspectRatio="none" />
				<g mask={`url(#${id}-far)`}>
					<image href={config.cleanPlate} width={config.width} height={config.height} preserveAspectRatio="none" />
					<image href={src} width={config.width} height={config.height} mask={`url(#${id}-not-foreground)`} />
				</g>
			</svg>
		</div>
		<div bind:this={planes[1]} class="layer middle" data-depth-layer={config.layers[1]}>
			<svg class="art" viewBox={`0 0 ${config.width} ${config.height}`}>
				<g mask={`url(#${id}-not-far)`}>
					<image href={config.cleanPlate} width={config.width} height={config.height} preserveAspectRatio="none" />
					<image href={src} width={config.width} height={config.height} mask={`url(#${id}-not-foreground)`} />
				</g>
			</svg>
		</div>
		<div bind:this={planes[2]} class="layer foreground" data-depth-layer={config.layers[2]}>
			<svg class="art" viewBox={`0 0 ${config.width} ${config.height}`}><image href={src} width={config.width} height={config.height} mask={`url(#${id}-foreground)`} /></svg>
		</div>
	{/if}
</div>

<style>
	.depth-scene { position: absolute; inset: 0; opacity: 0; pointer-events: none; }
	.depth-scene.ready { opacity: 1; transition: opacity .4s ease; }
	.layer { position: absolute; inset: 0; will-change: transform; }
	.mask-definitions { position: absolute; width: 0; height: 0; overflow: hidden; }
	.art { position: absolute; left: var(--art-left); top: var(--art-top); width: var(--art-width); height: var(--art-height); max-width: none; }
	/* Shadows follow the cutout silhouettes and fall onto the planes behind,
	   not onto a frame or UI. Farther separation gives a softer penumbra. */
	.middle .art { filter: drop-shadow(2px 4px 7px rgb(24 19 11 / .16)); }
	.foreground .art { filter: drop-shadow(2px 5px 5px rgb(24 19 11 / .24)) drop-shadow(0 1px 1px rgb(18 14 8 / .12)); }
	@media (max-width: 760px) { .middle .art { filter: drop-shadow(1px 2px 4px rgb(24 19 11 / .12)); } .foreground .art { filter: drop-shadow(1px 3px 3px rgb(24 19 11 / .2)); } }
	@media (prefers-reduced-motion: reduce) { .depth-scene { display: none; transition: none; } }
</style>
