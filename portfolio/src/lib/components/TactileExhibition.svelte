<script lang="ts">
	import { onMount, tick } from 'svelte';

	type Project = {
		slug: string; name: string; number: string; image: string; object: string;
		kicker: string; line: string; note: string; words: string[]; accent: string;
	};

	const projects: Project[] = [
		{ slug:'cord', name:'Cord', number:'01', image:'/images/exhibition/cord-money-changer.webp', object:'An instrument for worth', kicker:'Research / Product / Growth', line:'Making invisible value visible.', note:'91 voices became a salary product—and then a new revenue stream.', words:['worth','evidence','salary','voice','equity','signal','clarity'], accent:'#ff4f32' },
		{ slug:'indie-campers', name:'Indie Campers', number:'02', image:'/images/exhibition/indie-travellers.webp', object:'A system for movement', kicker:'Lead design / Systems / Direction', line:'Turning a journey into a coherent system.', note:'A design language built to move across markets, teams and millions of visits.', words:['route','freedom','system','road','scale','arrival','motion'], accent:'#536bff' },
		{ slug:'tenzo', name:'Tenzo', number:'03', image:'/images/exhibition/tenzo-still-life.webp', object:'A lens for service', kicker:'Founding design / Data / 0→1', line:'Making restaurant operations legible.', note:'Complex live data curated into decisions people can make at a glance.', words:['service','rhythm','data','table','signal','shift','decision'], accent:'#a77aff' }
	];

	let selected = $state(0);
	let root: HTMLElement;
	let scratch: HTMLCanvasElement;
	let scratching = false;
	let scratched = $state(false);
	let soundOn = $state(false);
	let changing = $state(false);
	let audio: AudioContext | null = null;
	let resizeObserver: ResizeObserver;

	const project = () => projects[selected];

	function paintCover() {
		if (!scratch) return;
		const rect = scratch.getBoundingClientRect();
		const scale = Math.min(devicePixelRatio, 2);
		scratch.width = Math.max(1, Math.floor(rect.width * scale));
		scratch.height = Math.max(1, Math.floor(rect.height * scale));
		const ctx = scratch.getContext('2d')!;
		ctx.scale(scale, scale);
		ctx.globalCompositeOperation = 'source-over';
		ctx.fillStyle = '#c9c1b1';
		ctx.fillRect(0, 0, rect.width, rect.height);
		for (let i = 0; i < 1500; i++) {
			const alpha = Math.random() * .075;
			ctx.fillStyle = `rgba(55,45,35,${alpha})`;
			ctx.fillRect(Math.random() * rect.width, Math.random() * rect.height, 1, 1);
		}
		ctx.fillStyle = '#26221d';
		ctx.textAlign = 'center';
		ctx.font = `italic ${Math.max(24, rect.width * .07)}px "Instrument Serif", serif`;
		ctx.fillText('rub to reveal', rect.width / 2, rect.height / 2 - 4);
		ctx.font = '10px "DM Mono", monospace';
		ctx.letterSpacing = '2px';
		ctx.fillText(`WORK ${project().number} / ${project().name.toUpperCase()}`, rect.width / 2, rect.height / 2 + 30);
		scratched = false;
	}

	function scratchAt(event: PointerEvent) {
		if (!scratching || !scratch) return;
		const rect = scratch.getBoundingClientRect();
		const scale = scratch.width / rect.width;
		const x = (event.clientX - rect.left) * scale;
		const y = (event.clientY - rect.top) * scale;
		const ctx = scratch.getContext('2d')!;
		ctx.globalCompositeOperation = 'destination-out';
		ctx.lineCap = 'round'; ctx.lineJoin = 'round';
		ctx.lineWidth = Math.max(70, rect.width * .14) * scale;
		ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + .1, y + .1); ctx.stroke();
		if (!scratched) scratched = true;
		root.style.setProperty('--scratch-x', `${event.clientX - rect.left}px`);
		root.style.setProperty('--scratch-y', `${event.clientY - rect.top}px`);
		if (soundOn && Math.random() > .86) chime(.65 + (x / scratch.width) * .6, .025);
	}

	function startScratch(event: PointerEvent) {
		scratching = true; scratch.setPointerCapture(event.pointerId); scratchAt(event);
	}

	async function selectProject(index: number) {
		if (index === selected) return;
		selected = index;
		changing = true;
		chime(.7 + index * .18, .13);
		await tick();
		setTimeout(() => { paintCover(); changing = false; }, 260);
	}

	function chime(pitch = 1, volume = .08) {
		if (!soundOn && volume < .1) return;
		audio ??= new AudioContext();
		const now = audio.currentTime;
		const gain = audio.createGain();
		gain.gain.setValueAtTime(volume, now);
		gain.gain.exponentialRampToValueAtTime(.0001, now + 1.4);
		gain.connect(audio.destination);
		[0, 7, 12].forEach((offset, i) => {
			const osc = audio!.createOscillator();
			osc.type = i === 0 ? 'sine' : 'triangle';
			osc.frequency.value = 220 * pitch * Math.pow(2, offset / 12);
			osc.connect(gain); osc.start(now + i * .015); osc.stop(now + 1.5);
		});
	}

	function toggleSound() {
		soundOn = !soundOn;
		if (soundOn) chime(.85, .1);
	}

	function move(event: PointerEvent) {
		if (!root) return;
		const nx = event.clientX / innerWidth - .5;
		const ny = event.clientY / innerHeight - .5;
		root.style.setProperty('--mx', nx.toFixed(3));
		root.style.setProperty('--my', ny.toFixed(3));
		root.style.setProperty('--cx', `${event.clientX}px`);
		root.style.setProperty('--cy', `${event.clientY}px`);
		root.querySelectorAll<HTMLElement>('.thread').forEach((thread, index) => {
			const rect = thread.getBoundingClientRect();
			const dx = event.clientX - (rect.left + rect.width / 2);
			const dy = event.clientY - (rect.top + rect.height * .35);
			const force = Math.max(0, 1 - Math.hypot(dx, dy) / 260);
			thread.style.setProperty('--push', `${Math.sign(dx || 1) * force * (24 + index % 3 * 8)}px`);
			thread.style.setProperty('--swing', `${Math.sign(dx || 1) * force * (5 + index % 2 * 3)}deg`);
		});
	}

	onMount(() => {
		paintCover();
		resizeObserver = new ResizeObserver(paintCover); resizeObserver.observe(scratch);
		return () => { resizeObserver.disconnect(); audio?.close(); };
	});
</script>

<svelte:window onpointermove={move} />

<main bind:this={root} class="instrument" class:is-changing={changing} style={`--accent:${project().accent}`}>
	<nav class="nav">
		<a href="/" class="brand">Micaela Ribeiro</a>
		<div><button class="active">Selected work</button><a href="/about">Index</a><a href="mailto:micaela.f.ribeiro@gmail.com">Contact</a></div>
		<button class="sound" onclick={toggleSound}>{soundOn ? 'Sound on' : 'Sound off'} <i class:live={soundOn}></i></button>
	</nav>

	<section class="installation" aria-live="polite">
		<div class="project-copy">
			<p class="kicker">{project().kicker}</p>
			<h1>{project().name}</h1>
			<p class="line">{project().line}</p>
			<p class="note">{project().note}</p>
			<a href={`/work/${project().slug}`}>Enter the work <span>↗</span></a>
		</div>

		<div class="portal">
			<div class="object-shadow"></div>
			<div class="lintel">
				<img src={project().image} alt="" />
				<span>{project().object}</span>
			</div>

			<div class="threads" aria-hidden="true">
				{#each Array(11) as _, i}
					<div class="thread" style={`--i:${i};--h:${68 + (i % 4) * 7}%;--delay:${(i * .07).toFixed(2)}s`}>
						<i></i>
						<p>{Array(6).fill(project().words[i % project().words.length]).join(' · ')}</p>
					</div>
				{/each}
			</div>

			<div class="reveal" class:has-scratched={scratched}>
				<img src={project().image} alt={`${project().name} project artwork`} />
				<div class="depth depth-one"></div><div class="depth depth-two"></div>
				<canvas bind:this={scratch} aria-label={`Scratch to reveal the ${project().name} project`} onpointerdown={startScratch} onpointermove={scratchAt} onpointerup={() => scratching = false} onpointercancel={() => scratching = false}></canvas>
				<span class="revealed-label">{project().number} / discovered</span>
			</div>
		</div>

		<button class="picker previous" onclick={() => selectProject((selected + projects.length - 1) % projects.length)} aria-label="Previous project">
			<span>{projects[(selected + projects.length - 1) % projects.length].number}</span>
			<b>{projects[(selected + projects.length - 1) % projects.length].name}</b>
		</button>
		<button class="picker next" onclick={() => selectProject((selected + 1) % projects.length)} aria-label="Next project">
			<span>{projects[(selected + 1) % projects.length].number}</span>
			<b>{projects[(selected + 1) % projects.length].name}</b>
		</button>
	</section>

	<footer><span>Lisbon / Portugal</span><span>Move to disturb · Rub to discover</span><span>Portfolio / 2026</span></footer>
	<div class="cursor" aria-hidden="true"></div>
</main>

<style>
	:global(.home-route:has(.instrument)){max-width:none;padding:0}
	.instrument{--paper:#e8dfcf;--ink:#2c251e;position:relative;height:100svh;min-height:44rem;overflow:hidden;color:var(--ink);background-color:var(--paper);background-image:radial-gradient(#493c2d14 .7px,transparent .8px),linear-gradient(96deg,#fff2,transparent 45%,#4d3e2d08);background-size:4px 4px,100% 100%;cursor:none;transition:background-color .5s ease}
	.instrument:before{content:"";position:absolute;inset:0;opacity:.21;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.55' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.3'/%3E%3C/svg%3E");mix-blend-mode:multiply}
	.nav{position:absolute;z-index:30;top:0;left:0;width:100%;padding:1.35rem 2rem;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;font:.56rem var(--font-mono);letter-spacing:.06em;text-transform:uppercase}.brand{font:400 1rem "Instrument Serif",serif;text-transform:none;letter-spacing:0}.nav>div{display:flex;gap:2rem}.nav button,.nav a{cursor:none}.nav .active{border-bottom:1px solid;padding-bottom:.2rem}.sound{justify-self:end;display:flex;align-items:center;gap:.6rem;text-transform:uppercase}.sound i{width:.45rem;aspect-ratio:1;border:1px solid;border-radius:50%}.sound i.live{background:var(--accent);box-shadow:0 0 0 .2rem color-mix(in srgb,var(--accent) 25%,transparent)}
	.installation{position:relative;width:100%;height:100%;perspective:1200px}.project-copy{position:absolute;z-index:10;left:8vw;top:50%;width:min(25rem,28vw);transform:translateY(-42%);transition:opacity .2s,transform .5s cubic-bezier(.2,.8,.2,1)}.kicker{font:.55rem var(--font-mono);letter-spacing:.06em;text-transform:uppercase}.project-copy h1{margin:1rem 0 .6rem;font:400 clamp(4.5rem,7vw,8rem)/.8 "Instrument Serif",serif;letter-spacing:-.055em}.line{margin:0;font:italic 400 clamp(1.4rem,2vw,2.1rem)/1.05 "Instrument Serif",serif}.note{max-width:20rem;margin:2rem 0;font:.86rem/1.55 var(--font-sans)}.project-copy a{width:12rem;padding:.75rem 0;display:flex;justify-content:space-between;border-bottom:1px solid;font:.55rem var(--font-mono);letter-spacing:.06em;text-transform:uppercase;cursor:none}
	.portal{position:absolute;z-index:3;top:10%;left:50%;width:min(46vw,46rem);height:84%;transform:translateX(-34%) rotateY(calc(var(--mx,0) * 3deg)) rotateX(calc(var(--my,0) * -2deg));transform-style:preserve-3d;transition:opacity .2s,filter .25s,transform .12s ease-out}.object-shadow{position:absolute;z-index:-2;top:16%;left:21%;width:65%;height:28%;border-radius:50%;background:#392e2266;filter:blur(3rem);transform:translate(2rem,2rem) translateZ(-5rem)}
	.lintel{position:absolute;z-index:8;top:5%;left:15%;width:72%;height:24%;overflow:hidden;clip-path:polygon(9% 12%,91% 12%,100% 58%,87% 78%,60% 87%,50% 100%,40% 87%,13% 78%,0 58%);filter:drop-shadow(1.3rem 1.8rem 1rem #3c302b40);transform:translateZ(5rem) translate(calc(var(--mx,0)*-12px),calc(var(--my,0)*-8px));transition:transform .14s ease-out}.lintel img{width:100%;height:100%;object-fit:cover;filter:saturate(.82) contrast(1.05)}.lintel:after{content:"";position:absolute;inset:0;border:1px solid #fff5;box-shadow:inset 0 0 0 .6rem #301f1124}.lintel span{position:absolute;left:50%;bottom:14%;padding:.35rem .7rem;color:#fff;background:#201912cc;transform:translateX(-50%);font:.48rem var(--font-mono);letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}
	.threads{position:absolute;z-index:1;top:23%;left:19%;width:64%;height:67%;display:flex;justify-content:space-between;transform:translateZ(1rem)}.thread{position:relative;width:7%;height:var(--h);transform-origin:50% 0;transform:translateX(var(--push,0)) rotate(var(--swing,0deg));transition:transform .65s cubic-bezier(.17,.67,.2,1.25);animation:arrive 1s var(--delay) both}.thread i{position:absolute;top:0;left:50%;width:1px;height:100%;background:#46372c40}.thread p{position:absolute;top:3%;left:50%;width:max-content;max-height:96%;margin:0;overflow:hidden;color:#40372d;font:.53rem/1.35 var(--font-mono);letter-spacing:.06em;text-transform:uppercase;writing-mode:vertical-rl;transform:translateX(-50%)}.thread:nth-child(3n) p{font-family:"Instrument Serif",serif;font-size:.78rem;font-style:italic;text-transform:none}.thread:nth-child(even){height:82%}
	.reveal{position:absolute;z-index:6;top:35%;left:25%;width:50%;aspect-ratio:1.03;overflow:hidden;border:.55rem solid #7d5e34;border-image:linear-gradient(135deg,#3b2816,#c9a46a,#54391c,#e1c38c,#392614) 1;box-shadow:.8rem 1.2rem 1.8rem #382b1e4d;transform:translateZ(7rem) translate(calc(var(--mx,0)*18px),calc(var(--my,0)*12px));transition:transform .15s ease-out}.reveal>img{width:100%;height:100%;object-fit:cover;transform:scale(1.12) translate(calc(var(--mx,0)*-2%),calc(var(--my,0)*-2%));transition:transform .16s ease-out}.reveal canvas{position:absolute;z-index:5;inset:0;width:100%;height:100%;touch-action:none;cursor:none}.depth{position:absolute;pointer-events:none;border:1px solid #fff8}.depth-one{z-index:2;inset:7%;transform:translate(calc(var(--mx,0)*-20px),calc(var(--my,0)*-14px));clip-path:circle(28% at 62% 45%);backdrop-filter:saturate(1.45) contrast(1.08)}.depth-two{z-index:3;inset:14%;transform:translate(calc(var(--mx,0)*28px),calc(var(--my,0)*20px));clip-path:ellipse(30% 45% at 38% 54%);backdrop-filter:brightness(1.15)}.revealed-label{position:absolute;z-index:4;right:.7rem;bottom:.6rem;padding:.35rem .45rem;color:#fff;background:#18130e99;font:.43rem var(--font-mono);letter-spacing:.08em;text-transform:uppercase;opacity:0;transition:opacity .4s}.has-scratched .revealed-label{opacity:1}
	.picker{position:absolute;z-index:15;top:47%;width:5rem;padding:.8rem .35rem;border:1px solid #4b403559;display:flex;flex-direction:column;gap:.2rem;background:#e8dfcf99;backdrop-filter:blur(.3rem);cursor:none;transition:transform .25s,background .25s}.picker:hover{background:#f4eee4;transform:translateY(-.25rem)}.picker span{font:.48rem var(--font-mono)}.picker b{font:400 .85rem "Instrument Serif",serif}.previous{left:1.5rem}.next{right:1.5rem}
	footer{position:absolute;z-index:20;right:2rem;bottom:1.1rem;left:2rem;display:flex;justify-content:space-between;font:.48rem var(--font-mono);letter-spacing:.07em;text-transform:uppercase}.cursor{position:fixed;z-index:100;top:0;left:0;width:1.4rem;aspect-ratio:1;border:1px solid #2c251e;border-radius:50%;pointer-events:none;transform:translate(calc(var(--cx,-4rem) - 50%),calc(var(--cy,-4rem) - 50%));mix-blend-mode:multiply}.cursor:after{content:"";position:absolute;width:.2rem;aspect-ratio:1;top:50%;left:50%;border-radius:50%;background:var(--accent);transform:translate(-50%,-50%)}
	.is-changing .portal{opacity:.2;filter:blur(1rem);transform:translateX(-30%) rotateY(7deg)}.is-changing .project-copy{opacity:0;transform:translateY(-42%) translateX(-2rem)}
	@keyframes arrive{from{opacity:0;transform:translateY(-3rem) rotate(-5deg)}to{opacity:1}}
	@media(max-width:850px){.instrument{min-height:42rem;cursor:auto}.nav{padding:1rem;grid-template-columns:1fr 1fr}.nav>div{display:none}.portal{top:13%;left:50%;width:92vw;height:70%;transform:translateX(-50%)}.project-copy{z-index:12;left:1rem;top:auto;bottom:3.5rem;width:75vw;transform:none}.project-copy h1{font-size:clamp(3.5rem,17vw,6rem)}.line{font-size:1.25rem}.note{display:none}.project-copy a{margin-top:1rem}.reveal{top:32%;left:24%;width:52%}.picker{top:41%;width:3.3rem}.previous{left:.4rem}.next{right:.4rem}.picker b{font-size:.65rem}.cursor{display:none}footer{display:none}.sound{cursor:auto}.nav a,.nav button,.project-copy a,.picker{cursor:auto}}
	@media(prefers-reduced-motion:reduce){.portal,.lintel,.reveal,.reveal>img,.thread{transition:none}.thread{animation:none}}
</style>
