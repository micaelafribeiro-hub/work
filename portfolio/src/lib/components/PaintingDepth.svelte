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
		let x = 0, y = 0, targetX = 0, targetY = 0, drift = 0, artWidth = 1000;
		const clamp = (value: number) => Math.max(-1, Math.min(1, value));
		const stop = () => { cancelAnimationFrame(frame); frame = 0; previousTime = 0; };
		const paint = () => {
			// A single rigid translation per plane. Never deform artwork pixels.
			// Travel is per 1000px of painting width. The back plane stays put so
			// its frame edge is never revealed; the frontmost travels furthest.
			// Masked planes must stay within the 12 source-pixel original overlap
			// at each join (about 4.7 per 1000 of a 2560px painting), or the
			// reconstructed plates show as pale outlines around the figures.
			const cutouts = 'cutouts' in config;
			const count = cutouts ? config.cutouts.length : 3;
			const rates = (cutouts ? [[0, 0], [7, 5], [16, 11]] : [[0, 0], [4, 3], [8.5, 6]]).slice(-count);
			rates[0] = [0, 0];
			const unit = artWidth / 1000;
			planes.forEach((plane, i) => {
				if (plane) plane.style.transform = `translate3d(${(x * rates[i][0] * unit).toFixed(3)}px, ${(y * rates[i][1] * unit).toFixed(3)}px, 0)`;
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
			artWidth = config.width * scale;
			scene.style.setProperty('--art-width', `${artWidth}px`);
			scene.style.setProperty('--art-height', `${config.height * scale}px`);
			scene.style.setProperty('--art-left', `${(width - config.width * scale) * position[0]}px`);
			scene.style.setProperty('--art-top', `${(height - config.height * scale) * position[1]}px`);
			readScroll();
		};
		const load = async () => {
			if (loading || loaded || motion.matches || !active) return;
			loading = true;
			try {
				const urls = 'cutouts' in config ? config.cutouts : [src, config.segmentation, config.cleanPlate, config.farPlate];
				await Promise.all(urls.map((url) => {
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
	{#if loaded && 'cutouts' in config}
		<!-- Complete layers need no masks or reconstruction. Their alpha edges
		     are the artwork's own, so a soft shadow can separate the planes. -->
		{#each config.cutouts as cutout, i}
			<div bind:this={planes[i]} class="layer cutout" class:middle={i > 0 && i < config.cutouts.length - 1} class:front={i > 0 && i === config.cutouts.length - 1} data-depth-layer={config.layers[i]}>
				<img class="art" src={cutout} alt="" draggable="false" />
			</div>
		{/each}
	{:else if loaded && !('cutouts' in config)}
		<svg class="mask-definitions" aria-hidden="true">
			<defs>
				<filter id={`${id}-foreground-select`} color-interpolation-filters="sRGB">
					<feComponentTransfer><feFuncR type="linear" slope="20" intercept="-15" /><feFuncG type="linear" slope="20" intercept="-15" /><feFuncB type="linear" slope="20" intercept="-15" /></feComponentTransfer>
				</filter>
				<filter id={`${id}-far-select`} color-interpolation-filters="sRGB">
					<feComponentTransfer><feFuncR type="linear" slope="-20" intercept="5" /><feFuncG type="linear" slope="-20" intercept="5" /><feFuncB type="linear" slope="-20" intercept="5" /></feComponentTransfer>
				</filter>
				<filter id={`${id}-inverse`} color-interpolation-filters="sRGB">
					<feComponentTransfer><feFuncR type="linear" slope="-1" intercept="1" /><feFuncG type="linear" slope="-1" intercept="1" /><feFuncB type="linear" slope="-1" intercept="1" /></feComponentTransfer>
				</filter>
				<!-- These filters affect coverage only, never the artwork pixels.
				     Keep original pixels under each join: complementary alpha masks
				     leave a 25% hole at a 50% edge even when perfectly aligned. -->
				<filter id={`${id}-core`} color-interpolation-filters="sRGB"><feMorphology operator="erode" radius="12" /></filter>
				<filter id={`${id}-coverage`} color-interpolation-filters="sRGB"><feMorphology operator="dilate" radius="12" /></filter>
				<filter id={`${id}-edge`} color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation=".65" /></filter>
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
				<mask id={`${id}-foreground-core`} maskUnits="userSpaceOnUse" x="0" y="0" width={config.width} height={config.height} style="mask-type:luminance"><use href={`#${id}-foreground-shape`} filter={`url(#${id}-core)`} /></mask>
				<mask id={`${id}-far-coverage`} maskUnits="userSpaceOnUse" x="0" y="0" width={config.width} height={config.height} style="mask-type:luminance"><use href={`#${id}-far-shape`} filter={`url(#${id}-coverage)`} /></mask>
				<mask id={`${id}-foreground-edge`} maskUnits="userSpaceOnUse" x="0" y="0" width={config.width} height={config.height} style="mask-type:luminance"><use href={`#${id}-foreground-shape`} filter={`url(#${id}-edge)`} /></mask>
				<g id={`${id}-underpainting`}>
					<image href={src} width={config.width} height={config.height} />
					<!-- Reconstruct only the concealed interior. The original edge
					     remains beneath the moving foreground as an opaque overlap. -->
					<image href={config.cleanPlate} width={config.width} height={config.height} preserveAspectRatio="none" mask={`url(#${id}-foreground-core)`} />
				</g>
			</defs>
		</svg>
		<div bind:this={planes[0]} class="layer far" data-depth-layer={config.layers[0]}>
			<svg class="art" viewBox={`0 0 ${config.width} ${config.height}`}>
				<image href={config.farPlate} width={config.width} height={config.height} preserveAspectRatio="none" />
				<use href={`#${id}-underpainting`} mask={`url(#${id}-far-coverage)`} />
			</svg>
		</div>
		<div bind:this={planes[1]} class="layer middle" data-depth-layer={config.layers[1]}>
			<svg class="art" viewBox={`0 0 ${config.width} ${config.height}`}>
				<use href={`#${id}-underpainting`} mask={`url(#${id}-not-far)`} />
			</svg>
		</div>
		<div bind:this={planes[2]} class="layer foreground" data-depth-layer={config.layers[2]}>
			<svg class="art" viewBox={`0 0 ${config.width} ${config.height}`}><image href={src} width={config.width} height={config.height} mask={`url(#${id}-foreground-edge)`} /></svg>
		</div>
	{/if}
</div>

<style>
	.depth-scene { position: absolute; inset: 0; opacity: 0; pointer-events: none; }
	.depth-scene.ready { opacity: 1; transition: opacity .4s ease; }
	.layer { position: absolute; inset: 0; will-change: transform; }
	.mask-definitions { position: absolute; width: 0; height: 0; overflow: hidden; }
	.art { position: absolute; left: var(--art-left); top: var(--art-top); width: var(--art-width); height: var(--art-height); max-width: none; }
	/* Cutout figures get a tight contact shadow that defines the silhouette and
	   a broad cast shadow that lifts it, sized to the painting. Masked planes
	   stay unshadowed: their mattes carry a thin ring of the surrounding wall,
	   which a shadow turns into a pale sticker outline. */
	.cutout.middle .art { filter: drop-shadow(0 calc(var(--art-width) * .002) calc(var(--art-width) * .003) rgb(24 20 14 / .3)) drop-shadow(calc(var(--art-width) * .005) calc(var(--art-width) * .013) calc(var(--art-width) * .017) rgb(24 20 14 / .38)); }
	.cutout.front .art { filter: drop-shadow(0 calc(var(--art-width) * .003) calc(var(--art-width) * .004) rgb(24 20 14 / .35)) drop-shadow(calc(var(--art-width) * .008) calc(var(--art-width) * .02) calc(var(--art-width) * .024) rgb(24 20 14 / .46)); }
	@media (prefers-reduced-motion: reduce) { .depth-scene { display: none; transition: none; } }
</style>
