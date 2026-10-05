<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let active = $state(0);
	let progress = 0;
	let reducedMotion = false;

	const rooms = [
		{ no: '00', code: 'MR–000', title: 'Entrance', subtitle: 'A digital exhibition by Micaela Ribeiro', href: '#', years: 'Lisbon / 2026' },
		{ no: '01', code: 'MR–001', title: 'Cord', subtitle: 'Research as provocation', href: '/work/cord', years: '2021—2023' },
		{ no: '02', code: 'MR–002', title: 'Indie Campers', subtitle: 'A system for movement', href: '/work/indie-campers', years: '2024—Now' },
		{ no: '03', code: 'MR–003', title: 'Tenzo', subtitle: 'Making data legible', href: '/work/tenzo', years: '2023—2024' }
	];

	onMount(() => {
		let disposed = false;
		let frame = 0;
		let targetProgress = 0;
		let pointerX = 0;
		let pointerY = 0;
		reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const boot = async () => {
			const THREE = await import('three');
			if (disposed) return;

			const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
			renderer.outputColorSpace = THREE.SRGBColorSpace;
			renderer.shadowMap.enabled = true;
			renderer.shadowMap.type = THREE.PCFShadowMap;

			const scene = new THREE.Scene();
			scene.background = new THREE.Color(0xd8d4ca);
			scene.fog = new THREE.Fog(0xd8d4ca, 13, 48);

			const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 100);
			camera.position.set(0, 1.55, 11);

			const ambient = new THREE.HemisphereLight(0xfffdf5, 0x56504a, 2.1);
			scene.add(ambient);

			const floor = new THREE.Mesh(
				new THREE.PlaneGeometry(18, 72),
				new THREE.MeshStandardMaterial({ color: 0xbdb6aa, roughness: .82, metalness: .03 })
			);
			floor.rotation.x = -Math.PI / 2;
			floor.position.set(0, -2.4, -20);
			floor.receiveShadow = true;
			scene.add(floor);

			const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xe9e5dc, roughness: .95 });
			const leftWall = new THREE.Mesh(new THREE.BoxGeometry(.25, 9, 72), wallMaterial);
			leftWall.position.set(-7.5, 1.6, -20);
			leftWall.receiveShadow = true;
			scene.add(leftWall);
			const rightWall = leftWall.clone();
			rightWall.position.x = 7.5;
			scene.add(rightWall);
			const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(15, 72), new THREE.MeshStandardMaterial({ color: 0xded9cf, roughness: 1 }));
			ceiling.rotation.x = Math.PI / 2;
			ceiling.position.set(0, 6, -20);
			scene.add(ceiling);

			for (let z = 6; z > -48; z -= 7) {
				const strip = new THREE.Mesh(new THREE.BoxGeometry(7.5, .08, .22), new THREE.MeshBasicMaterial({ color: 0xfff8e8 }));
				strip.position.set(0, 5.88, z);
				scene.add(strip);
				const light = new THREE.PointLight(0xfff4df, 8, 13, 2);
				light.position.set(0, 4.8, z);
				scene.add(light);
			}

			const makeTexture = (title: string, number: string, bg: string, fg: string, detail: string) => {
				const art = document.createElement('canvas');
				art.width = 1200;
				art.height = 1500;
				const ctx = art.getContext('2d');
				if (!ctx) return new THREE.CanvasTexture(art);
				ctx.fillStyle = bg;
				ctx.fillRect(0, 0, art.width, art.height);
				ctx.strokeStyle = fg;
				ctx.lineWidth = 3;
				ctx.strokeRect(44, 44, 1112, 1412);
				ctx.fillStyle = fg;
				ctx.font = '32px DM Mono, monospace';
				ctx.fillText(`EXHIBITION ${number}`, 82, 115);
				ctx.textAlign = 'right';
				ctx.fillText(detail.toUpperCase(), 1110, 115);
				ctx.textAlign = 'left';
				ctx.font = '230px Instrument Serif, Georgia, serif';
				const words = title.split(' ');
				words.forEach((word, i) => ctx.fillText(word, 72, 470 + i * 220));
				ctx.font = '560px Instrument Serif, Georgia, serif';
				ctx.globalAlpha = .18;
				ctx.fillText(number, 620, 1370);
				ctx.globalAlpha = 1;
				const texture = new THREE.CanvasTexture(art);
				texture.colorSpace = THREE.SRGBColorSpace;
				texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
				return texture;
			};

			const makeLabel = (title: string, note: string) => {
				const label = document.createElement('canvas');
				label.width = 720;
				label.height = 300;
				const ctx = label.getContext('2d');
				if (!ctx) return new THREE.CanvasTexture(label);
				ctx.fillStyle = '#f7f5ef';
				ctx.fillRect(0, 0, 720, 300);
				ctx.fillStyle = '#111';
				ctx.font = '68px Instrument Serif, Georgia, serif';
				ctx.fillText(title, 40, 85);
				ctx.font = '21px DM Mono, monospace';
				ctx.fillText(note.toUpperCase(), 42, 146);
				ctx.fillStyle = '#777';
				ctx.font = '18px DM Mono, monospace';
				ctx.fillText('MICAELA RIBEIRO / DIGITAL PRODUCT', 42, 245);
				const texture = new THREE.CanvasTexture(label);
				texture.colorSpace = THREE.SRGBColorSpace;
				return texture;
			};

			const roomData = [
				{ title: 'Cord', number: '01', bg: '#ff5b36', fg: '#111111', detail: 'Research → revenue', z: -3, side: -1 },
				{ title: 'Indie Campers', number: '02', bg: '#536bff', fg: '#c9ff2e', detail: 'Chaos → system', z: -17, side: 1 },
				{ title: 'Tenzo', number: '03', bg: '#b99bff', fg: '#111111', detail: 'Data → decisions', z: -31, side: -1 }
			];

			roomData.forEach((room, index) => {
				const group = new THREE.Group();
				group.position.z = room.z;
				const sideX = room.side * 4.85;

				const frame = new THREE.Mesh(new THREE.BoxGeometry(5.35, 6.65, .22), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: .55 }));
				frame.position.set(sideX, 1.15, 0);
				frame.castShadow = true;
				group.add(frame);
				const artwork = new THREE.Mesh(new THREE.PlaneGeometry(5.05, 6.35), new THREE.MeshBasicMaterial({ map: makeTexture(room.title, room.number, room.bg, room.fg, room.detail) }));
				artwork.position.set(sideX, 1.15, .121);
				group.add(artwork);

				const label = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1), new THREE.MeshBasicMaterial({ map: makeLabel(room.title, room.detail) }));
				label.position.set(room.side * 1.05, -.7, .08);
				group.add(label);

				const spot = new THREE.SpotLight(0xfff3dc, 75, 18, .62, .55, 1.4);
				spot.position.set(sideX * .68, 5.1, 2.2);
				spot.target = frame;
				spot.castShadow = true;
				group.add(spot);

				if (index === 0) {
					const ring = new THREE.Mesh(new THREE.TorusGeometry(1.45, .055, 16, 96), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: .3 }));
					ring.position.set(1.9, .45, 1.4);
					ring.rotation.y = -.35;
					ring.castShadow = true;
					group.add(ring);
				} else if (index === 1) {
					for (let i = 0; i < 5; i++) {
						const pillar = new THREE.Mesh(new THREE.BoxGeometry(.38, 1.4 + i * .55, .38), new THREE.MeshStandardMaterial({ color: i === 4 ? 0xc9ff2e : 0x111111, roughness: .55 }));
						pillar.position.set(-2 + i * .65, -1.65 + i * .28, 1.1);
						pillar.castShadow = true;
						group.add(pillar);
					}
				} else {
					const form = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 1), new THREE.MeshStandardMaterial({ color: 0xffe15a, roughness: .2, metalness: .08, flatShading: true }));
					form.position.set(2.1, -.8, 1.2);
					form.castShadow = true;
					group.add(form);
				}
				scene.add(group);
			});

			const endWall = new THREE.Mesh(new THREE.BoxGeometry(15, 9, .35), new THREE.MeshStandardMaterial({ color: 0x171717, roughness: .9 }));
			endWall.position.set(0, 1.5, -42);
			scene.add(endWall);
			const endType = new THREE.Mesh(new THREE.PlaneGeometry(8, 3), new THREE.MeshBasicMaterial({ map: makeLabel('The gallery continues', 'New work / always in progress') }));
			endType.position.set(0, 1.3, -41.8);
			scene.add(endType);

			const resize = () => {
				const width = canvas.clientWidth;
				const height = canvas.clientHeight;
				camera.aspect = width / height;
				camera.updateProjectionMatrix();
				renderer.setSize(width, height, false);
			};
			const scroll = () => {
				const max = document.documentElement.scrollHeight - window.innerHeight;
				targetProgress = max > 0 ? window.scrollY / max : 0;
				const nextActive = targetProgress < .08 ? 0 : targetProgress < .28 ? 1 : targetProgress < .58 ? 2 : 3;
				if (nextActive !== active) active = nextActive;
			};
			const pointer = (event: PointerEvent) => {
				pointerX = event.clientX / window.innerWidth - .5;
				pointerY = event.clientY / window.innerHeight - .5;
			};

			window.addEventListener('resize', resize);
			window.addEventListener('scroll', scroll, { passive: true });
			window.addEventListener('pointermove', pointer, { passive: true });
			resize();
			scroll();

			const render = () => {
				progress += (targetProgress - progress) * (reducedMotion ? 1 : .055);
				const distance = progress * 47;
				camera.position.z = 11 - distance;
				camera.position.x = Math.sin(progress * Math.PI * 5.1) * 1.05 + pointerX * .65;
				camera.position.y = 1.45 - Math.sin(progress * Math.PI * 3) * .16 - pointerY * .28;
				camera.rotation.z = pointerX * -.008;
				camera.lookAt(camera.position.x * .15, .45, camera.position.z - 7.5);
				renderer.render(scene, camera);
				frame = requestAnimationFrame(render);
			};
			render();

			return () => {
				window.removeEventListener('resize', resize);
				window.removeEventListener('scroll', scroll);
				window.removeEventListener('pointermove', pointer);
				cancelAnimationFrame(frame);
				renderer.dispose();
			};
		};

		let clean: undefined | (() => void);
		boot().then((cleanup) => { clean = cleanup; });
		return () => { disposed = true; clean?.(); };
	});
</script>

<div class="world-stage">
	<canvas bind:this={canvas} aria-label="A real-time three-dimensional gallery containing three product exhibitions"></canvas>
	<div class="world-vignette" aria-hidden="true"></div>

	<nav class="world-nav" aria-label="Gallery navigation">
		<a href="/" class="world-mark">MR</a>
		<p>Digital exhibition<br />Lisbon / 2026</p>
		<div><a href="/about">About</a><a href="mailto:micaela.f.ribeiro@gmail.com">Contact ↗</a></div>
	</nav>

	<div class:away={active !== 0} class="entrance-copy">
		<p>Curated by Micaela Ribeiro</p>
		<h1>Interfaces<br />are <em>spaces.</em></h1>
		<div><span>Product design as digital curation</span><span>Scroll to enter ↓</span></div>
	</div>

	<aside class:visible={active !== 0} class="room-interface" aria-live="polite">
		<div class="room-index"><span>Exhibition {rooms[active].no}</span><span>{rooms[active].code}</span></div>
		<div class="room-copy"><p>{rooms[active].subtitle}</p><h2>{rooms[active].title}</h2></div>
		<div class="room-actions"><span>{rooms[active].years}</span>{#if active > 0}<a href={rooms[active].href}>Enter exhibition <i>↗</i></a>{/if}</div>
	</aside>

	<div class="room-progress" aria-hidden="true">
		{#each rooms as room, index}<span class:active={index === active}>{room.no}</span>{/each}
	</div>
	<p class="movement-note">Scroll / move through the gallery</p>
</div>

<div class="world-scroll" aria-hidden="true">
	{#each rooms as room}<section><span>{room.title}</span></section>{/each}
</div>

<style>
	:global(.home-route:has(.world-stage)) { max-width: none; }
	.world-stage { position: fixed; z-index: 2; inset: 0; width: 100%; height: 100svh; overflow: hidden; color: #111; background: #d8d4ca; }
	canvas { width: 100%; height: 100%; display: block; }
	.world-vignette { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(90deg, rgba(0,0,0,.13), transparent 16% 84%, rgba(0,0,0,.13)), linear-gradient(0deg, rgba(0,0,0,.12), transparent 22%); mix-blend-mode: multiply; }
	.world-nav { position: absolute; z-index: 10; top: 0; left: 0; width: 100%; padding: 1.25rem 1.5rem; display: grid; grid-template-columns: 1fr auto 1fr; align-items: start; color: #111; border-bottom: 1px solid rgba(17,17,17,.38); font-family: var(--font-mono); font-size: .55rem; line-height: 1.45; letter-spacing: .08em; text-transform: uppercase; }
	.world-nav .world-mark { font-family: "Instrument Serif", Georgia, serif; font-size: 2rem; line-height: .7; letter-spacing: -.04em; }
	.world-nav > p { margin: 0; text-align: center; }
	.world-nav > div { justify-self: end; display: flex; gap: 1.5rem; }
	.entrance-copy { position: absolute; z-index: 8; inset: 0; padding: 17vh 5vw 5vh; display: flex; flex-direction: column; justify-content: space-between; pointer-events: none; transition: opacity .5s ease, transform .7s cubic-bezier(.2,.8,.2,1); }
	.entrance-copy.away { opacity: 0; transform: translateY(-4rem); }
	.entrance-copy > p { margin: 0; font-family: var(--font-mono); font-size: .56rem; letter-spacing: .08em; text-transform: uppercase; }
	.entrance-copy h1 { max-width: 8ch; margin: auto 0; font-family: "Instrument Serif", Georgia, serif; font-size: clamp(7rem,15vw,16rem); font-weight: 400; line-height: .68; letter-spacing: -.05em; text-shadow: 0 .1rem 1.5rem rgba(241,238,230,.3); }
	.entrance-copy h1 em { margin-left: .55em; font-weight: 400; }
	.entrance-copy > div { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: .56rem; letter-spacing: .08em; text-transform: uppercase; }
	.room-interface { position: absolute; z-index: 9; top: 16%; left: 4%; width: min(31rem,38vw); min-height: 22rem; padding: 1.35rem; display: flex; flex-direction: column; color: #111; background: rgba(247,245,239,.91); border: 1px solid rgba(17,17,17,.3); box-shadow: 0 2rem 5rem rgba(17,17,17,.17); backdrop-filter: blur(18px); opacity: 0; pointer-events: none; transform: translateX(-3rem); transition: opacity .5s ease, transform .6s cubic-bezier(.2,.8,.2,1); }
	.room-interface.visible { opacity: 1; pointer-events: auto; transform: none; }
	.room-index,
	.room-actions { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: .52rem; letter-spacing: .08em; text-transform: uppercase; }
	.room-copy { margin: auto 0; }
	.room-copy p { margin: 0 0 .8rem; font-family: var(--font-mono); font-size: .54rem; letter-spacing: .08em; text-transform: uppercase; }
	.room-copy h2 { margin: 0; font-family: "Instrument Serif", Georgia, serif; font-size: clamp(4rem,6vw,6.5rem); font-weight: 400; line-height: .78; letter-spacing: -.045em; }
	.room-actions { align-items: end; padding-top: 1rem; border-top: 1px solid #aaa59b; }
	.room-actions a { font-size: .6rem; }
	.room-actions i { margin-left: .5rem; font-size: 1rem; font-style: normal; }
	.room-progress { position: absolute; z-index: 10; top: 50%; right: 1.5rem; display: flex; flex-direction: column; gap: .8rem; font-family: var(--font-mono); font-size: .5rem; transform: translateY(-50%); }
	.room-progress span { width: 1.65rem; height: 1.65rem; display: grid; place-items: center; border: 1px solid transparent; border-radius: 50%; opacity: .42; transition: opacity .3s, border-color .3s, background .3s; }
	.room-progress span.active { border-color: #111; background: rgba(247,245,239,.8); opacity: 1; }
	.movement-note { position: absolute; z-index: 10; right: 1.5rem; bottom: 1.3rem; margin: 0; font-family: var(--font-mono); font-size: .49rem; letter-spacing: .07em; text-transform: uppercase; writing-mode: vertical-rl; }
	.world-scroll { position: relative; z-index: 1; height: 520vh; pointer-events: none; }
	.world-scroll section { height: 130vh; }
	.world-scroll span { opacity: 0; }

	@media (max-width: 800px) {
		.world-nav { padding: 1rem; grid-template-columns: 1fr 1fr; }
		.world-nav > p { display: none; }
		.world-nav > div { gap: 1rem; }
		.entrance-copy { padding: 16vh 1rem 2rem; }
		.entrance-copy h1 { font-size: clamp(5.5rem,28vw,9rem); }
		.entrance-copy h1 em { margin-left: .15em; }
		.entrance-copy > div span:first-child { display: none; }
		.entrance-copy > div { justify-content: flex-end; }
		.room-interface { top: auto; right: 1rem; bottom: 1rem; left: 1rem; width: auto; min-height: 14rem; }
		.room-copy h2 { font-size: clamp(3.6rem,17vw,6rem); }
		.room-progress { top: 7rem; right: .75rem; transform: none; }
		.movement-note { display: none; }
	}

	@media (prefers-reduced-motion: reduce) {
		.room-interface,
		.entrance-copy { transition: none; }
	}
</style>
