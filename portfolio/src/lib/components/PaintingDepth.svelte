<script lang="ts">
	import { onMount } from 'svelte';
	import { createPaintingDepth } from '$lib/painting-depth';

	let { src, active }: { src: string; active: boolean } = $props();
	let canvas: HTMLCanvasElement;
	let ready = $state(false);
	let refresh: (() => void) | undefined;
	$effect(() => { if (active) refresh?.(); });

	onMount(() => {
		const motion = matchMedia('(prefers-reduced-motion: reduce)');
		const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
		const image = new Image();
		let renderer: ReturnType<typeof createPaintingDepth> = null;
		let disposed = false;
		let frame = 0;
		let previousTime = 0;
		let x = 0, y = 0, targetX = 0, targetY = 0;
		let scrollDrift = 0;
		const clamp = (value: number) => Math.max(-1, Math.min(1, value));
		const stop = () => { cancelAnimationFrame(frame); frame = 0; previousTime = 0; };
		const draw = (time: number) => {
			frame = 0;
			if (!renderer || motion.matches || !active || document.hidden) return;
			const delta = previousTime ? Math.min(time - previousTime, 64) : 16;
			previousTime = time;
			const ease = 1 - Math.exp(-delta / 160);
			const nextY = targetY + scrollDrift;
			x += (targetX - x) * ease;
			y += (nextY - y) * ease;
			if (Math.abs(targetX - x) + Math.abs(nextY - y) < .000015) {
				x = targetX; y = nextY; previousTime = 0;
			} else frame = requestAnimationFrame(draw);
			renderer.draw(x, y);
		};
		const requestDraw = () => {
			if (!frame && renderer && active && !motion.matches && !document.hidden) frame = requestAnimationFrame(draw);
		};
		const readScroll = () => {
			// Touch uses ordinary page scrolling, never device-orientation access.
			scrollDrift = clamp(window.scrollY / Math.max(innerHeight * .55, 1)) * (finePointer.matches ? .012 : .007);
			requestDraw();
		};
		const resize = () => {
			if (!renderer) return;
			renderer.resize(canvas.clientWidth, canvas.clientHeight, innerWidth <= 760);
			readScroll();
			requestDraw();
		};
		const setup = () => {
			if (disposed || motion.matches || !image.complete || !image.naturalWidth) return;
			if (!renderer) renderer = createPaintingDepth(canvas, image);
			if (!renderer) return;
			resize();
			renderer.draw(x, y);
			ready = true;
		};
		const preference = () => {
			stop();
			x = y = targetX = targetY = scrollDrift = 0;
			if (motion.matches) { ready = false; renderer?.dispose(); renderer = null; }
			else setup();
		};
		const pointer = (event: PointerEvent) => {
			if (!active || motion.matches || !finePointer.matches || event.pointerType !== 'mouse') return;
			targetX = clamp(event.clientX / innerWidth * 2 - 1) * .016;
			targetY = clamp(event.clientY / innerHeight * 2 - 1) * .010;
			requestDraw();
		};
		const rest = () => { targetX = targetY = 0; requestDraw(); };
		const visibility = () => { if (document.hidden) stop(); else { rest(); readScroll(); } };
		const contextLost = (event: Event) => {
			event.preventDefault(); stop(); ready = false; renderer?.dispose(); renderer = null;
		};
		const observer = new ResizeObserver(resize);
		observer.observe(canvas);
		refresh = () => { rest(); readScroll(); };
		image.onload = setup;
		image.src = src;
		motion.addEventListener('change', preference);
		finePointer.addEventListener('change', preference);
		window.addEventListener('pointermove', pointer, { passive: true });
		window.addEventListener('scroll', readScroll, { passive: true });
		window.addEventListener('blur', rest);
		document.documentElement.addEventListener('pointerleave', rest);
		document.addEventListener('visibilitychange', visibility);
		canvas.addEventListener('webglcontextlost', contextLost);
		canvas.addEventListener('webglcontextrestored', setup);
		return () => {
			disposed = true; refresh = undefined; stop(); observer.disconnect(); renderer?.dispose();
			image.onload = null;
			motion.removeEventListener('change', preference);
			finePointer.removeEventListener('change', preference);
			window.removeEventListener('pointermove', pointer);
			window.removeEventListener('scroll', readScroll);
			window.removeEventListener('blur', rest);
			document.documentElement.removeEventListener('pointerleave', rest);
			document.removeEventListener('visibilitychange', visibility);
			canvas.removeEventListener('webglcontextlost', contextLost);
			canvas.removeEventListener('webglcontextrestored', setup);
		};
	});
</script>

<canvas bind:this={canvas} class:ready aria-hidden="true" data-painting-depth="athens"></canvas>

<style>
	canvas { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; pointer-events: none; }
	canvas.ready { opacity: 1; transition: opacity .6s ease; }
	@media (prefers-reduced-motion: reduce) { canvas { display: none; transition: none; } }
</style>
