<script lang="ts">
	import { onMount } from 'svelte';

	let { src, active }: { src: string; active: boolean } = $props();
	const id = $props.id();
	const plate = '/images/exhibition/athens-layers/clean-plate.png';
	const matte = '/images/exhibition/athens-layers/foreground-matte.png';
	let scene: HTMLDivElement;
	let rear: HTMLDivElement;
	let front: HTMLDivElement;
	let ready = $state(false);
	let refresh: (() => void) | undefined;
	$effect(() => { if (active) refresh?.(); });

	onMount(() => {
		const motion = matchMedia('(prefers-reduced-motion: reduce)');
		const pointerMedia = matchMedia('(hover: hover) and (pointer: fine)');
		let disposed = false;
		let loaded = false;
		let frame = 0;
		let previousTime = 0;
		let x = 0, y = 0, targetX = 0, targetY = 0, drift = 0;
		const clamp = (value: number) => Math.max(-1, Math.min(1, value));
		const stop = () => { cancelAnimationFrame(frame); frame = 0; previousTime = 0; };
		// Each layer receives one rigid translation: no displacement map,
		// per-pixel deformation, tilt, or animated scaling.
		const paint = () => {
			rear.style.transform = `translate3d(${(x * 2).toFixed(3)}px, ${(y * 1.2).toFixed(3)}px, 0)`;
			front.style.transform = `translate3d(${(x * 10).toFixed(3)}px, ${(y * 6).toFixed(3)}px, 0)`;
		};
		const draw = (time: number) => {
			frame = 0;
			if (!ready || !active || motion.matches || document.hidden) { previousTime = 0; return; }
			const elapsed = previousTime ? Math.min(time - previousTime, 64) : 16;
			previousTime = time;
			const ease = 1 - Math.exp(-elapsed / 180);
			const nextY = clamp(targetY + drift);
			x += (targetX - x) * ease;
			y += (nextY - y) * ease;
			if (Math.abs(targetX - x) + Math.abs(nextY - y) < .0005) {
				x = targetX; y = nextY; previousTime = 0;
			} else frame = requestAnimationFrame(draw);
			paint();
		};
		const requestDraw = () => {
			if (!frame && ready && active && !motion.matches && !document.hidden) frame = requestAnimationFrame(draw);
		};
		const readScroll = () => {
			drift = clamp(scrollY / Math.max(innerHeight * .55, 1)) * .6;
			requestDraw();
		};
		const resize = () => {
			// One shared source coordinate system keeps masks registered on mobile.
			const width = scene.clientWidth, height = scene.clientHeight;
			const scale = Math.max(width / 2560, height / 1672);
			scene.style.setProperty('--art-width', `${2560 * scale}px`);
			scene.style.setProperty('--art-height', `${1672 * scale}px`);
			scene.style.setProperty('--art-left', `${(width - 2560 * scale) * .5}px`);
			scene.style.setProperty('--art-top', `${(height - 1672 * scale) * (innerWidth <= 760 ? .5 : .6)}px`);
			readScroll();
		};
		const preference = () => {
			stop(); x = y = targetX = targetY = drift = 0; paint();
			ready = loaded && !motion.matches;
			resize();
		};
		const pointer = (event: PointerEvent) => {
			if (!active || !ready || !pointerMedia.matches || event.pointerType !== 'mouse') return;
			targetX = clamp(event.clientX / innerWidth * 2 - 1);
			targetY = clamp(event.clientY / innerHeight * 2 - 1) * .65;
			requestDraw();
		};
		const rest = () => { targetX = targetY = 0; requestDraw(); };
		const visibility = () => { if (document.hidden) stop(); else { rest(); readScroll(); } };
		const observer = new ResizeObserver(resize);
		observer.observe(scene);
		refresh = () => { rest(); readScroll(); };
		const images = [src, plate, matte].map((url) => {
			const image = new Image(); image.src = url; return image;
		});
		Promise.all(images.map((image) => image.decode())).then(() => {
			if (disposed) return;
			loaded = true;
			preference();
		}).catch(() => { /* Keep the original static painting if an asset fails. */ });
		motion.addEventListener('change', preference);
		pointerMedia.addEventListener('change', preference);
		window.addEventListener('pointermove', pointer, { passive: true });
		window.addEventListener('scroll', readScroll, { passive: true });
		window.addEventListener('blur', rest);
		document.documentElement.addEventListener('pointerleave', rest);
		document.addEventListener('visibilitychange', visibility);
		return () => {
			disposed = true; refresh = undefined; stop(); observer.disconnect();
			motion.removeEventListener('change', preference);
			pointerMedia.removeEventListener('change', preference);
			window.removeEventListener('pointermove', pointer);
			window.removeEventListener('scroll', readScroll);
			window.removeEventListener('blur', rest);
			document.documentElement.removeEventListener('pointerleave', rest);
			document.removeEventListener('visibilitychange', visibility);
		};
	});
</script>

<div bind:this={scene} class="depth-scene" class:ready aria-hidden="true" data-painting-depth="rigid-layers">
	<svg class="mask-definitions" aria-hidden="true">
		<defs>
			<filter id={`${id}-edge`} x="-1%" y="-1%" width="102%" height="102%" color-interpolation-filters="sRGB">
				<feComponentTransfer>
					<feFuncR type="linear" slope="20" intercept="-10" />
					<feFuncG type="linear" slope="20" intercept="-10" />
					<feFuncB type="linear" slope="20" intercept="-10" />
				</feComponentTransfer>
				<feMorphology operator="dilate" radius="5" />
			</filter>
			<filter id={`${id}-inverse`} color-interpolation-filters="sRGB">
				<feComponentTransfer>
					<feFuncR type="linear" slope="-1" intercept="1" />
					<feFuncG type="linear" slope="-1" intercept="1" />
					<feFuncB type="linear" slope="-1" intercept="1" />
				</feComponentTransfer>
			</filter>
			<g id={`${id}-silhouette`}>
				<image href={matte} width="2560" height="1672" preserveAspectRatio="none" filter={`url(#${id}-edge)`} />
				<rect x="0" y="1003" width="2560" height="669" fill="white" />
			</g>
			<mask id={`${id}-foreground`} maskUnits="userSpaceOnUse" x="0" y="0" width="2560" height="1672" style="mask-type:luminance">
				<use href={`#${id}-silhouette`} />
			</mask>
			<mask id={`${id}-background`} maskUnits="userSpaceOnUse" x="0" y="0" width="2560" height="1672" style="mask-type:luminance">
				<use href={`#${id}-silhouette`} filter={`url(#${id}-inverse)`} />
			</mask>
		</defs>
	</svg>
	<div bind:this={rear} class="layer rear" data-depth-layer="architecture">
		<img class="art" src={plate} alt="" draggable="false" />
		<svg class="art" viewBox="0 0 2560 1672"><image href={src} width="2560" height="1672" mask={`url(#${id}-background)`} /></svg>
	</div>
	<div bind:this={front} class="layer front" data-depth-layer="figures">
		<svg class="art" viewBox="0 0 2560 1672"><image href={src} width="2560" height="1672" mask={`url(#${id}-foreground)`} /></svg>
	</div>
</div>

<style>
	.depth-scene { position: absolute; inset: 0; opacity: 0; pointer-events: none; }
	.depth-scene.ready { opacity: 1; transition: opacity .4s ease; }
	.layer { position: absolute; inset: 0; will-change: transform; }
	.mask-definitions { position: absolute; width: 0; height: 0; overflow: hidden; }
	.art { position: absolute; left: var(--art-left); top: var(--art-top); width: var(--art-width); height: var(--art-height); max-width: none; }
	/* A fixed upper-left light: shadows fall behind the masked silhouette,
	   not around the rectangular image. Soft penumbra, no glowing outline. */
	.front .art { filter: drop-shadow(2px 5px 5px rgb(24 19 11 / .24)) drop-shadow(0 1px 1px rgb(18 14 8 / .14)); }
	@media (max-width: 760px) { .front .art { filter: drop-shadow(1px 3px 3px rgb(24 19 11 / .2)); } }
	@media (prefers-reduced-motion: reduce) { .depth-scene { display: none; transition: none; } }
</style>
