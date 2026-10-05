<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	let canvas: HTMLCanvasElement;
	let exhibition: HTMLElement;
	let loaded = $state(false);
	let progress = 0;
	let reducedMotion = false;

	const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
	const range = (value: number, start: number, end: number) => clamp((value - start) / (end - start));
	const ease = (value: number) => value * value * (3 - 2 * value);

	onMount(() => {
		if (!canvas || !exhibition) return;
		reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1.12;
		renderer.shadowMap.enabled = true;

		const scene = new THREE.Scene();
		const cream = new THREE.Color('#eee9df');
		const midnight = new THREE.Color('#07101d');
		scene.background = cream;
		scene.fog = new THREE.FogExp2(cream, 0.027);

		const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
		camera.position.set(0, 0, 8.5);

		const world = new THREE.Group();
		scene.add(world);

		const ambient = new THREE.HemisphereLight('#fff8e9', '#263cff', 2.5);
		scene.add(ambient);
		const key = new THREE.DirectionalLight('#fff4dd', 6);
		key.position.set(-4, 6, 5);
		key.castShadow = true;
		scene.add(key);
		const electric = new THREE.PointLight('#5267ff', 80, 14, 2);
		electric.position.set(3, 1, 3);
		scene.add(electric);
		const acid = new THREE.PointLight('#cfff32', 35, 8, 2);
		acid.position.set(-3, -1, 2);
		scene.add(acid);

		const loader = new THREE.TextureLoader();
		const paintingTexture = loader.load('/images/exhibition/cord-money-changer.webp', () => { loaded = true; });
		paintingTexture.colorSpace = THREE.SRGBColorSpace;
		paintingTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

		const painting = new THREE.Group();
		painting.position.set(1.45, -0.05, -0.3);
		world.add(painting);

		const mat = new THREE.MeshBasicMaterial({ map: paintingTexture, transparent: true });
		const image = new THREE.Mesh(new THREE.PlaneGeometry(3.36, 4.28), mat);
		image.position.z = 0.04;
		painting.add(image);

		const frameMat = new THREE.MeshStandardMaterial({ color: '#efe8da', roughness: 0.52, metalness: 0.04 });
		const framePieces = [
			[3.7, 0.13, 0.12, 0, 2.2], [3.7, 0.13, 0.12, 0, -2.2],
			[0.13, 4.53, 0.12, -1.79, 0], [0.13, 4.53, 0.12, 1.79, 0]
		];
		for (const [w, h, d, x, y] of framePieces) {
			const piece = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), frameMat);
			piece.position.set(x, y, 0.1);
			piece.castShadow = true;
			painting.add(piece);
		}

		const shadow = new THREE.Mesh(
			new THREE.PlaneGeometry(4.6, 5.3),
			new THREE.MeshBasicMaterial({ color: '#7b725f', transparent: true, opacity: 0.15 })
		);
		shadow.position.set(0.25, -0.24, -0.16);
		painting.add(shadow);

		const createTextTexture = (mode: 'scan' | 'signal') => {
			const c = document.createElement('canvas');
			c.width = 1024; c.height = 640;
			const x = c.getContext('2d')!;
			x.clearRect(0, 0, c.width, c.height);
			x.fillStyle = mode === 'scan' ? 'rgba(8,16,31,.91)' : 'rgba(239,235,226,.96)';
			x.fillRect(0, 0, c.width, c.height);
			x.strokeStyle = mode === 'scan' ? '#d0ff38' : '#111111';
			x.lineWidth = 3; x.strokeRect(2, 2, c.width - 4, c.height - 4);
			x.fillStyle = mode === 'scan' ? '#d0ff38' : '#111111';
			x.font = '22px monospace';
			x.letterSpacing = '5px';
			x.fillText(mode === 'scan' ? 'OBJECT / 01 — ANALYSIS' : 'CORD / MARKET SIGNAL', 54, 62);
		if (mode === 'scan') {
			x.font = '84px serif'; x.fillText('Value is invisible.', 54, 185);
			x.font = '26px monospace';
			x.fillText('VOICE SAMPLE       91', 54, 290);
			x.fillText('SYSTEM BIAS        DETECTED', 54, 340);
			x.fillText('CLARITY INDEX      87%', 54, 390);
			x.fillStyle = '#536bff'; x.fillRect(54, 492, 760, 18);
			x.fillStyle = '#d0ff38'; x.fillRect(54, 492, 565, 18);
		} else {
			x.font = '130px serif'; x.fillText('£82.5k', 54, 220);
			x.font = '26px monospace';
			x.fillText('VERIFIED MARKET RANGE', 54, 312);
			x.fillStyle = '#536bff'; x.fillRect(54, 430, 760, 18);
			x.fillStyle = '#d0ff38'; x.fillRect(54, 430, 618, 18);
			x.fillStyle = '#111111'; x.fillText('CLARITY / 87%', 54, 510);
		}
		const texture = new THREE.CanvasTexture(c);
		texture.colorSpace = THREE.SRGBColorSpace;
		texture.minFilter = THREE.LinearFilter;
		return texture;
	};

		const scanPanel = new THREE.Mesh(
			new THREE.PlaneGeometry(4.8, 3),
			new THREE.MeshBasicMaterial({ map: createTextTexture('scan'), transparent: true, opacity: 0 })
		);
		scanPanel.position.set(3.6, -0.35, -1.8);
		scanPanel.rotation.y = -0.35;
		world.add(scanPanel);

		const signalPanel = new THREE.Mesh(
			new THREE.PlaneGeometry(4, 2.5),
			new THREE.MeshBasicMaterial({ map: createTextTexture('signal'), transparent: true, opacity: 0 })
		);
		signalPanel.position.set(0, -0.15, -3.2);
		world.add(signalPanel);

		const sculpture = new THREE.Group();
		sculpture.position.set(-0.25, -0.5, 1.7);
		world.add(sculpture);
		const gold = new THREE.MeshPhysicalMaterial({ color: '#ffd65a', metalness: 0.64, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.08 });
		const blackMetal = new THREE.MeshPhysicalMaterial({ color: '#101216', metalness: 0.82, roughness: 0.2, clearcoat: 1 });
		const glass = new THREE.MeshPhysicalMaterial({ color: '#93a7ff', metalness: 0.05, roughness: 0.04, transmission: 0.82, transparent: true, opacity: 0.74, thickness: 0.6, ior: 1.45 });

		const base = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.86, 0.18, 64), blackMetal);
		base.position.y = -1.55; base.castShadow = true; sculpture.add(base);
		const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.075, 2.7, 24), gold);
		stem.position.y = -0.15; stem.castShadow = true; sculpture.add(stem);
		const crown = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 16), gold);
		crown.position.y = 1.24; sculpture.add(crown);
		const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.7, 20), gold);
		beam.rotation.z = Math.PI / 2; beam.position.y = 0.96; sculpture.add(beam);

		const cylinderBetween = (a: THREE.Vector3, b: THREE.Vector3, radius: number, material: THREE.Material) => {
			const delta = new THREE.Vector3().subVectors(b, a);
			const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, delta.length(), 12), material);
			mesh.position.copy(a).add(b).multiplyScalar(0.5);
			mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.clone().normalize());
			return mesh;
		};
		for (const side of [-1, 1]) {
			const panY = side === -1 ? -0.1 : 0.18;
			const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.34, 0.1, 48), gold);
			pan.position.set(side * 1.12, panY, 0); pan.castShadow = true; sculpture.add(pan);
			for (const z of [-0.32, 0.32]) sculpture.add(cylinderBetween(new THREE.Vector3(side * 1.25, 0.92, 0), new THREE.Vector3(side * 1.12, panY + 0.05, z), 0.009, gold));
		}
		const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.08, 64), gold);
		coin.rotation.x = Math.PI / 2; coin.position.set(1.12, 0.38, 0); sculpture.add(coin);
		const coinRing = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.018, 12, 64), blackMetal);
		coinRing.position.copy(coin.position); sculpture.add(coinRing);

		const portal = new THREE.Group();
		world.add(portal);
		for (let i = 0; i < 3; i++) {
			const ring = new THREE.Mesh(new THREE.TorusGeometry(1.45 + i * 0.32, 0.018 + i * 0.006, 12, 128), i === 1 ? glass : new THREE.MeshBasicMaterial({ color: i === 0 ? '#d0ff38' : '#536bff', transparent: true, opacity: 0 }));
			ring.rotation.x = Math.PI / 2.7; ring.rotation.z = i * 0.4; ring.scale.setScalar(0.01); portal.add(ring);
		}
		portal.position.set(0.2, 0, -0.4);

		const starPositions = new Float32Array(210 * 3);
		for (let i = 0; i < starPositions.length; i += 3) {
			starPositions[i] = (Math.random() - 0.5) * 15;
			starPositions[i + 1] = (Math.random() - 0.5) * 9;
			starPositions[i + 2] = (Math.random() - 0.5) * 9 - 2;
		}
		const starGeo = new THREE.BufferGeometry(); starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
		const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: '#9eb1ff', size: 0.025, transparent: true, opacity: 0 }));
		world.add(stars);

		const laser = new THREE.Mesh(new THREE.BoxGeometry(0.012, 5.5, 0.012), new THREE.MeshBasicMaterial({ color: '#d0ff38', transparent: true, opacity: 0 }));
		laser.position.set(0, 0, 2); world.add(laser);

		const pointer = new THREE.Vector2();
		const onPointer = (event: PointerEvent) => pointer.set((event.clientX / innerWidth - 0.5) * 2, (event.clientY / innerHeight - 0.5) * 2);
		const onScroll = () => {
			const rect = exhibition.getBoundingClientRect();
			progress = clamp(-rect.top / (rect.height - innerHeight));
			exhibition.style.setProperty('--progress', String(progress));
		};
		const resize = () => {
			const width = canvas.clientWidth, height = canvas.clientHeight;
			renderer.setSize(width, height, false);
			camera.aspect = width / height; camera.updateProjectionMatrix();
		};
		window.addEventListener('resize', resize);
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('pointermove', onPointer, { passive: true });
		resize(); onScroll();

		const startTime = performance.now();
		let frame = 0;
		const render = () => {
			frame = requestAnimationFrame(render);
			const t = (performance.now() - startTime) / 1000;
			const p = reducedMotion ? 0.02 : progress;
			const extract = ease(range(p, 0.12, 0.38));
			const analyse = ease(range(p, 0.36, 0.68));
			const resolve = ease(range(p, 0.67, 0.94));

			const bg = cream.clone().lerp(midnight, analyse);
			scene.background = bg; scene.fog!.color.copy(bg);
			painting.position.x = THREE.MathUtils.lerp(1.45, -3.4, analyse);
			painting.position.z = THREE.MathUtils.lerp(-0.3, -2.8, analyse);
			painting.rotation.y = THREE.MathUtils.lerp(0, 0.32, analyse);
			painting.rotation.z = THREE.MathUtils.lerp(-0.012, -0.07, extract);
			mat.opacity = 1 - resolve * 0.82;

			sculpture.position.x = THREE.MathUtils.lerp(-0.25, analyse ? -1.55 : -0.25, analyse);
			sculpture.position.z = THREE.MathUtils.lerp(1.7, -0.15, analyse);
			sculpture.rotation.y = t * 0.08 + pointer.x * 0.09 + analyse * 0.7;
			sculpture.rotation.z = Math.sin(t * 0.65) * 0.018 + extract * 0.04;
			sculpture.scale.setScalar(THREE.MathUtils.lerp(0.01, 1, extract) * (1 - resolve * 0.62));
			beam.rotation.z = Math.PI / 2 + Math.sin(t * 0.7) * 0.035;
			coin.rotation.z = t * 0.45;

			portal.children.forEach((child, i) => {
				child.scale.setScalar(THREE.MathUtils.lerp(0.01, 1 + i * 0.06, analyse));
				child.rotation.z += 0.0015 * (i % 2 ? -1 : 1);
				const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
				if ('opacity' in material) material.opacity = analyse * (1 - resolve * 0.7);
			});
			(stars.material as THREE.PointsMaterial).opacity = analyse * (1 - resolve * 0.2);
			stars.rotation.y = t * 0.015;
			(laser.material as THREE.MeshBasicMaterial).opacity = analyse * (1 - resolve);
			laser.position.x = -2.4 + ((t * 0.52) % 1) * 4.8;

			const scanMat = scanPanel.material as THREE.MeshBasicMaterial;
			scanMat.opacity = analyse * (1 - resolve);
			scanPanel.position.x = THREE.MathUtils.lerp(3.6, 1.55, analyse);
			scanPanel.position.z = THREE.MathUtils.lerp(-1.8, 0.35, analyse);
			scanPanel.rotation.y = THREE.MathUtils.lerp(-0.35, -0.08, analyse) + pointer.x * 0.025;

			const signalMat = signalPanel.material as THREE.MeshBasicMaterial;
			signalMat.opacity = resolve;
			signalPanel.position.x = THREE.MathUtils.lerp(0, -1.7, resolve);
			signalPanel.position.z = THREE.MathUtils.lerp(-3.2, 0.8, resolve);
			signalPanel.rotation.y = pointer.x * 0.025;

			camera.position.x += ((pointer.x * 0.14) - camera.position.x) * 0.035;
			camera.position.y += ((pointer.y * 0.1) - camera.position.y) * 0.035;
			camera.position.z = THREE.MathUtils.lerp(8.5, 7.3, analyse) + resolve * 0.8;
			camera.lookAt(0, 0, 0);
			electric.intensity = 20 + analyse * 105;
			acid.intensity = analyse * 55;
			renderer.render(scene, camera);
		};
		render();

		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('resize', resize);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('pointermove', onPointer);
			paintingTexture.dispose();
			scene.traverse((object) => {
				if (object instanceof THREE.Mesh) { object.geometry?.dispose(); const materials = Array.isArray(object.material) ? object.material : [object.material]; materials.forEach((m) => m.dispose()); }
			});
			renderer.dispose();
		};
	});
</script>

<svelte:window />

<main bind:this={exhibition} class="exhibition" class:is-loaded={loaded}>
	<div class="stage" aria-hidden="true"><canvas bind:this={canvas}></canvas><div class="grain"></div></div>

	<nav class="nav">
		<a class="monogram" href="/" aria-label="Micaela Ribeiro home">MR</a>
		<p>Digital curator<br />Product designer</p>
		<div><a href="#cord">Exhibition 01</a><a href="/about">About</a><a href="mailto:micaela.f.ribeiro@gmail.com">Contact ↗</a></div>
	</nav>

	<div class="loader"><span></span><p>Preparing the exhibition</p></div>

	<section class="beat beat-one">
		<p class="eyebrow">Micaela Ribeiro presents / 2026</p>
		<h1>Value,<br /><em>reframed.</em></h1>
		<p class="intro">A digital exhibition about the invisible systems that decide what people are worth.</p>
		<p class="direction">Scroll to enter <span>↓</span></p>
	</section>

	<section class="beat beat-two" id="cord">
		<div class="caption"><span>Object 01</span><span>Balance / extraction</span></div>
		<h2>The artefact<br />leaves the frame.</h2>
		<p>Research turned an inherited imbalance into something we could inspect.</p>
	</section>

	<section class="beat beat-three">
		<div class="caption"><span>Reading 02</span><span>91 voices / one signal</span></div>
		<h2>From quiet bias<br />to clear evidence.</h2>
		<p>Cord makes salary intelligence legible—without erasing the human stories inside it.</p>
	</section>

	<section class="beat beat-four">
		<div class="final-copy">
			<p class="eyebrow">Exhibition 01 / Cord</p>
			<h2>Know your worth.</h2>
			<p>Research, product strategy and interface design for a fairer salary conversation.</p>
			<a href="/work/cord">Enter the case study <span>↗</span></a>
		</div>
		<p class="next">Next exhibition / Indie Campers</p>
	</section>
</main>

<style>
	:global(.home-route:has(.exhibition)) { max-width:none; padding:0; }
	.exhibition { --paper:#eee9df; --ink:#11120f; position:relative; height:520svh; color:var(--ink); background:var(--paper); }
	.stage { position:sticky; z-index:0; top:0; width:100%; height:100svh; overflow:hidden; background:var(--paper); }
	canvas { display:block; width:100%; height:100%; }
	.grain { position:absolute; inset:0; pointer-events:none; opacity:.13; mix-blend-mode:soft-light; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.38'/%3E%3C/svg%3E"); }
	.nav { position:fixed; z-index:50; inset:0 0 auto; padding:1rem 1.35rem; display:grid; grid-template-columns:1fr auto 1fr; align-items:start; color:currentColor; mix-blend-mode:difference; filter:invert(1); font:.55rem/1.35 var(--font-mono); letter-spacing:.09em; text-transform:uppercase; pointer-events:none; }
	.nav a { pointer-events:auto; }.nav .monogram { font:400 2rem/.72 "Instrument Serif",serif; letter-spacing:-.05em; }.nav p{margin:0;text-align:center}.nav div{justify-self:end;display:flex;gap:1.5rem}
	.loader { position:fixed; z-index:100; inset:0; display:grid; place-content:center; gap:1.2rem; background:#07101d; color:#d0ff38; transition:opacity .7s ease,visibility .7s; }
	.loader span { width:10rem;height:1px;background:#ffffff33;overflow:hidden;position:relative}.loader span:after{content:"";position:absolute;inset:0;background:#d0ff38;animation:load 1.1s ease-in-out infinite}.loader p{margin:0;text-align:center;font:.55rem var(--font-mono);letter-spacing:.1em;text-transform:uppercase}.is-loaded .loader{opacity:0;visibility:hidden}
	.beat { position:absolute; z-index:10; width:100%; height:100svh; padding:8rem 4vw 4vw; pointer-events:none; }
	.beat a { pointer-events:auto; }
	.beat-one { top:0; display:flex; flex-direction:column; justify-content:center; align-items:flex-start; }
	.eyebrow,.direction,.caption,.beat>p,.next { font:.56rem/1.5 var(--font-mono); letter-spacing:.08em; text-transform:uppercase; }
	.beat-one h1 { margin:1.7rem 0 2rem; font:400 clamp(6.2rem,12vw,12.8rem)/.67 "Instrument Serif",serif; letter-spacing:-.06em; }
	.beat-one h1 em { display:block; margin-left:.32em; font-weight:400; }.intro{max-width:24rem;margin-left:.5rem;font:1rem/1.5 var(--font-sans)!important;text-transform:none!important;letter-spacing:0!important}.direction{position:absolute;left:4vw;bottom:2rem}.direction span{display:inline-block;margin-left:.5rem;animation:down 1.7s ease-in-out infinite}
	.beat-two { top:110svh; color:#fff; mix-blend-mode:difference; }
	.caption { display:flex;justify-content:space-between;border-top:1px solid currentColor;padding-top:.65rem; }
	.beat h2 { margin:13svh 0 1.5rem; font:400 clamp(4.5rem,8vw,9rem)/.78 "Instrument Serif",serif; letter-spacing:-.05em; }
	.beat-two h2,.beat-two>p{max-width:48rem}.beat-two>p,.beat-three>p{font:1rem/1.55 var(--font-sans);text-transform:none;letter-spacing:0;max-width:26rem}
	.beat-three { top:245svh; color:#fff; mix-blend-mode:difference; display:flex;flex-direction:column;align-items:flex-end;text-align:right; }
	.beat-three .caption{width:100%}.beat-three h2{margin-top:12svh}.beat-three>p{margin-right:.4rem}
	.beat-four { top:410svh; height:110svh; padding-right:6vw; color:#eee9df; display:flex;flex-direction:column;justify-content:center;align-items:flex-end;text-align:left; }
	.final-copy { width:min(28rem,80vw); margin-top:8svh; }.final-copy h2{margin:1rem 0;font:400 clamp(4.5rem,7vw,7rem)/.82 "Instrument Serif",serif;letter-spacing:-.05em}.final-copy>p:not(.eyebrow){font:1rem/1.55 var(--font-sans)}.final-copy a{display:flex;justify-content:space-between;margin:2.5rem auto 0;padding:1rem 1.2rem;border:1px solid currentColor;font:.58rem var(--font-mono);letter-spacing:.08em;text-transform:uppercase;transition:background .25s,color .25s}.final-copy a:hover{color:#07101d;background:#d0ff38}.next{position:absolute;bottom:2rem;right:2rem}
	@keyframes load{from{transform:translateX(-100%)}to{transform:translateX(100%)}}@keyframes down{50%{transform:translateY(.4rem)}}
	@media(max-width:800px){.nav{grid-template-columns:1fr 1fr}.nav>p,.nav div a:first-child{display:none}.beat{padding:7rem 1rem 2rem}.beat-one{justify-content:flex-start;padding-top:22svh}.beat-one h1{font-size:clamp(5rem,25vw,8rem)}.intro{max-width:18rem}.direction{left:1rem}.beat h2{font-size:clamp(4rem,18vw,7rem);margin-top:18svh}.beat-two>p,.beat-three>p{max-width:20rem}.beat-three{align-items:flex-start;text-align:left}.final-copy{width:92vw}.next{right:1rem}.caption span:last-child{display:none}}
	@media(prefers-reduced-motion:reduce){.direction span,.loader span:after{animation:none}.exhibition{height:100svh}.beat:not(.beat-one){display:none}}
</style>
