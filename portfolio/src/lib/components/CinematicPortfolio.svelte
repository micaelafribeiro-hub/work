<script lang="ts">
	import { onMount } from 'svelte';
	let root: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let current = $state(0);
	let motionOff = $state(false);
	let ready = $state(false);
	let failed = $state(false);
	const labels = ['The introduction', 'The practice', 'Selected work', 'The invitation'];
	const stops = [0, .34, .65, 1];
	const setChapter = (p: number) => { current = p < .235 ? 0 : p < .535 ? 1 : p < .815 ? 2 : 3; };
	function jump(index: number) {
		if (motionOff || failed) { root.querySelectorAll('.chapter')[index]?.scrollIntoView(); return; }
		const top = root.getBoundingClientRect().top + scrollY;
		window.scrollTo({ top: top + stops[index] * (root.offsetHeight - innerHeight), behavior: motionOff ? 'instant' : 'smooth' });
	}
	onMount(() => {
		let destroy: (() => void) | undefined;
		let gone = false;
		const preference = matchMedia('(prefers-reduced-motion: reduce)');
		motionOff = preference.matches;
		const update = () => {
			const p = Math.max(0, Math.min(1, -root.getBoundingClientRect().top / (root.offsetHeight - innerHeight)));
			if (motionOff || failed) setChapter(p);
		};
		window.addEventListener('scroll', update, { passive: true }); update();
		if (!motionOff) {
			import('$lib/cinematic-stage').then(async ({ createStage }) => {
				if (gone) return;
				destroy = await createStage(canvas, root, () => { if (!gone) ready = true; }, setChapter);
				if (gone) destroy();
			}).catch(() => { failed = true; ready = true; });
		} else ready = true;
		return () => { gone = true; destroy?.(); window.removeEventListener('scroll', update); };
	});
</script>

<div bind:this={root} class="cinema" class:static-mode={motionOff || failed} class:loaded={ready} data-chapter={current}>
	<div class="screen">
		<div class="art-fallback" aria-hidden="true"></div>
		<canvas bind:this={canvas} class="scene-canvas" aria-hidden="true"></canvas>
		<div class="mobile-shade" aria-hidden="true"></div>
		<div class="registration" aria-hidden="true"><i></i><i></i><i></i><i></i><span>✦</span></div>
		<header class="masthead">
			<a class="signature" href="/" aria-label="Micaela Ribeiro home">micaela<span>®</span></a>
			<span class="discipline">Product designer</span>
			<a class="contact" href="mailto:micaela.f.ribeiro@gmail.com">Let’s talk <span>↗</span></a>
		</header>

		<section class="chapter introduction" class:active={current === 0} inert={current !== 0 && !motionOff && !failed} aria-hidden={current !== 0 && !motionOff && !failed}>
			<div class="opening-copy">
				<p class="eyebrow">A portfolio by Micaela Ribeiro</p>
				<h1>A different<br />way of <em>seeing.</em></h1>
				<p class="dek">I curate digital spaces.<br />For people. With purpose. And a little wonder.</p>
				<button class="dark-button" onclick={() => jump(1)}>Step inside <span>↘</span></button>
			</div>
			<div class="opening-foot"><span class="eyebrow">01 — The perspective</span><p>From the first question to the smallest interaction,<br />I shape how a product is seen, felt, and understood.</p></div>
		</section>

		<section class="chapter practice" class:active={current === 1} inert={current !== 1 && !motionOff && !failed} aria-hidden={current !== 1 && !motionOff && !failed}>
			<div class="practice-copy"><p class="eyebrow">02 — The practice</p><h2>Good things<br />grow from<br /><em>curiosity.</em></h2><p class="dek">Research. Direction. Design.<br />A whole world behind every interface.</p><button class="line-button" onclick={() => jump(2)}>Discover the work <span>↓</span></button></div>
			<p class="margin-note">Look closer.<br />There is always more beneath the surface.</p>
		</section>

		<section class="chapter selected" class:active={current === 2} inert={current !== 2 && !motionOff && !failed} aria-hidden={current !== 2 && !motionOff && !failed}>
			<div class="exhibit-label"><span>Object no. 01</span><span>A question of value</span></div>
			<div class="selected-copy"><p class="eyebrow">03 — On view / Cord</p><h2>One question.<br /><em>A new possibility.</em></h2><p class="dek">What do people need when they’re thinking about their career?</p><p class="body-copy">Listening to 91 people uncovered a need for salary intelligence. That insight became a product—and, seven months after launch, a new paid subscription.</p><a class="dark-button" href="/work/cord">Explore Cord <span>↗</span></a><div class="other-work"><span>Also in the collection</span><a href="/work/indie-campers">Indie Campers ↗</a><a href="/work/tenzo">Tenzo ↗</a></div></div>
		</section>

		<section class="chapter invitation" class:active={current === 3} inert={current !== 3 && !motionOff && !failed} aria-hidden={current !== 3 && !motionOff && !failed}>
			<div class="invitation-copy"><p class="eyebrow">04 — The next possibility</p><h2>Let’s make<br />something<br /><em>worth finding.</em></h2><p class="dek">A new perspective starts with a conversation.</p><a class="dark-button" href="mailto:micaela.f.ribeiro@gmail.com">Say hello <span>↗</span></a></div>
			<div class="constellation-label"><span>✦</span><p>Research connects the dots.<br />Design gives them meaning.</p></div>
		</section>

		<footer class="stage-footer"><a href="/about">About Micaela ↗</a><nav aria-label="Exhibition chapters">{#each labels as label, i}<button aria-label={label} aria-current={current === i ? 'step' : undefined} onclick={() => jump(i)}><span>0{i + 1}</span><i></i></button>{/each}</nav><span class="scroll-cue">Scroll to explore <span>↓</span></span></footer>
	</div>
</div>

<style>
	:global(.home-route:has(.cinema)){max-width:none;width:100%}
	.cinema{height:520svh;color:#f5f3e9;background:#073bdb;--serif:var(--font-sans);--mono:"DM Mono",monospace}
	.screen{height:100svh;position:sticky;top:0;overflow:hidden;isolation:isolate}
	.scene-canvas,.art-fallback,.mobile-shade{position:absolute;inset:0;width:100%;height:100%}.art-fallback{background:#073bdb url('/images/stage/curtain.webp') center/cover no-repeat}.scene-canvas{opacity:0;transition:opacity .8s}.loaded .scene-canvas{opacity:1}
	.masthead{position:absolute;z-index:20;top:0;left:0;right:0;padding:27px 4vw;display:flex;align-items:center;justify-content:space-between}.signature{font:600 30px/1 var(--font-sans);letter-spacing:-2px}.signature span{font:10px var(--font-sans);vertical-align:super;margin-left:5px;letter-spacing:0}.discipline,.contact{font:10px var(--mono);letter-spacing:.06em}.contact{display:flex;gap:22px;padding:8px 12px;background:#131923;color:#fff;text-transform:uppercase}
	.registration{position:absolute;inset:0;pointer-events:none;z-index:2;opacity:.3}.registration i{position:absolute;background:currentColor}.registration i:nth-child(1){top:97px;left:0;width:100%;height:1px}.registration i:nth-child(2){bottom:91px;left:0;width:100%;height:1px}.registration i:nth-child(3){top:0;bottom:0;left:4vw;width:1px}.registration i:nth-child(4){top:0;bottom:0;right:4vw;width:1px}.registration>span{position:absolute;left:calc(4vw - 6px);bottom:80px;font-size:20px}
	.chapter{position:absolute;inset:0;z-index:5;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .65s ease,visibility .65s,transform .9s;transform:translateY(24px)}.chapter.active{opacity:1;visibility:visible;pointer-events:auto;transform:translateY(0)}
	.opening-copy{position:absolute;top:29%;left:9vw;max-width:52vw}.eyebrow{margin:0 0 24px;font:9px/1.5 var(--mono);letter-spacing:.12em;text-transform:uppercase}.chapter h1,.chapter h2{font-family:var(--serif);font-weight:400;letter-spacing:-.045em;line-height:.93;text-wrap:initial;margin:0 0 24px}.chapter h1{font-size:clamp(60px,6.8vw,118px)}.chapter h2{font-size:clamp(56px,6vw,104px)}.chapter em{font-weight:400}.dek{font:15px/1.5 var(--font-sans);letter-spacing:-.025em;margin:0 0 27px}.dark-button{display:inline-flex;gap:42px;align-items:center;justify-content:space-between;background:#151923;color:#fff;padding:12px 16px;font:9px var(--mono);text-transform:uppercase;letter-spacing:.09em;transition:background .2s,transform .2s;cursor:pointer}.dark-button:hover{background:#31415a;transform:translateY(-2px)}.dark-button span{font-size:15px}.opening-foot{position:absolute;bottom:16%;left:9vw;display:flex;gap:55px;align-items:start}.opening-foot>.eyebrow{font-size:8px;white-space:nowrap;margin-top:3px}.opening-foot>p:last-child{font:11px/1.5 var(--font-sans);margin:0;max-width:310px}
	.practice-copy{position:absolute;left:12vw;top:25%;max-width:44vw}.practice h2{font-size:clamp(70px,8vw,130px)}.practice{filter:drop-shadow(0 2px 15px #0005)}.line-button{font:10px var(--mono);padding:10px 0;border-bottom:1px solid #fff7;display:flex;justify-content:space-between;width:180px;cursor:pointer}.margin-note{position:absolute;right:9vw;bottom:17%;font:11px/1.6 var(--font-sans)}
	.selected{color:#2a2925}.selected-copy{position:absolute;left:54%;top:25%;width:36%;max-width:620px}.selected h2{font-size:clamp(48px,5.1vw,88px)}.selected .dek{max-width:360px;font-size:17px}.body-copy{font:12px/1.7 var(--font-sans);max-width:350px;margin:0 0 27px}.exhibit-label{position:absolute;bottom:20%;left:12%;width:30%;display:flex;justify-content:space-between;font:8px var(--mono);text-transform:uppercase;letter-spacing:.08em}.other-work{margin-top:32px;display:flex;flex-wrap:wrap;gap:8px 22px;font:10px var(--mono)}.other-work>span{flex-basis:100%;opacity:.6;font-size:8px;text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px}.other-work a{padding-block:5px;border-bottom:1px solid #2a292533}
	.invitation-copy{position:absolute;top:23%;left:9vw;max-width:47vw}.invitation h2{font-size:clamp(60px,6.5vw,110px)}.constellation-label{position:absolute;right:12%;bottom:22%;font:11px/1.6 var(--font-sans)}.constellation-label>span{font-size:25px}.constellation-label p{margin-top:12px}
	.stage-footer{position:absolute;bottom:0;left:0;right:0;z-index:20;padding:24px 4vw;display:flex;justify-content:space-between;align-items:center;font:9px var(--mono);text-transform:uppercase;letter-spacing:.08em}.stage-footer nav{display:flex;gap:12px}.stage-footer button{display:flex;align-items:center;gap:8px;padding:12px 0;cursor:pointer;opacity:.45;transition:opacity .3s}.stage-footer button[aria-current]{opacity:1}.stage-footer button i{height:1px;width:28px;background:currentColor}.stage-footer button[aria-current] i{height:2px}.scroll-cue{display:flex;gap:14px}.cinema[data-chapter='2'] .masthead,.cinema[data-chapter='2'] .stage-footer,.cinema[data-chapter='2'] .registration{color:#2a2925}
	.mobile-shade{display:none}
	@media(min-width:1500px){.opening-copy{top:28%}.opening-foot{bottom:19%}}
	@media(max-height:680px) and (min-width:801px){.opening-copy{top:24%}.chapter h1{font-size:70px}.opening-foot{bottom:17%}.selected-copy{top:20%}.selected h2{font-size:53px}.other-work{margin-top:15px}.invitation-copy{top:21%}.chapter .eyebrow{margin-bottom:15px}}
	@media(max-width:800px){.masthead{padding:22px 6vw}.signature{font-size:26px}.discipline{display:none}.contact{font-size:8px;gap:13px}.registration i:nth-child(1){top:78px}.registration i:nth-child(2){bottom:76px}.registration i:nth-child(3){left:6vw}.registration i:nth-child(4){right:6vw}.registration>span{left:calc(6vw - 6px);bottom:65px}.mobile-shade{display:block;background:linear-gradient(0deg,#032285b8,transparent 72%);pointer-events:none;z-index:1}.opening-copy{left:10vw;top:auto;bottom:22%;max-width:85vw}.chapter h1{font-size:clamp(54px,12vw,85px);text-shadow:0 2px 20px #0032bbaa}.eyebrow{font-size:8px;margin-bottom:16px}.dek{font-size:12px;max-width:260px}.opening-foot{left:10vw;bottom:12%;gap:15px}.opening-foot>.eyebrow{display:none}.opening-foot>p:last-child{font-size:10px;max-width:270px}.practice-copy{left:10vw;top:28%;max-width:80vw}.practice h2{font-size:68px}.margin-note{display:none}.stage-footer{padding:16px 6vw;font-size:8px}.stage-footer button{gap:4px}.stage-footer button i{width:12px}.stage-footer nav{gap:9px}.scroll-cue{display:none}.selected-copy{left:10%;top:48%;width:80%;max-width:none}.selected h2{font-size:42px;margin-bottom:15px}.selected .dek{font-size:12px;max-width:270px;margin-bottom:12px}.body-copy{font-size:10px;line-height:1.55;max-width:290px;margin-bottom:16px}.other-work{margin-top:14px;font-size:9px;gap:6px 20px}.other-work>span{display:none}.exhibit-label{top:39%;bottom:auto;left:15%;width:70%;font-size:7px}.cinema[data-chapter='2'] .mobile-shade{display:none}.invitation-copy{left:10%;top:26%;max-width:88%}.invitation h2{font-size:62px}.constellation-label{right:10%;bottom:17%;font-size:9px}.art-fallback{background-position:68% center}}
	@media(max-width:800px) and (max-height:740px){.selected-copy{top:44%}.selected h2{font-size:35px}.body-copy{max-width:100%}.selected .eyebrow{margin-bottom:10px}.selected .dek{display:none}}
	@media(max-width:800px){.exhibit-label{top:44%}}
	.static-mode{height:auto}.static-mode .screen{height:auto;overflow:visible;position:relative}.static-mode .scene-canvas{display:none}.static-mode .chapter{position:relative;height:100svh;min-height:680px;opacity:1;visibility:visible;pointer-events:auto;transform:none}.static-mode .introduction{background:url('/images/stage/curtain.webp') 65% center/cover}.static-mode .practice{background:linear-gradient(#0005,#0005),url('/images/stage/orchard.webp') center/cover}.static-mode .selected{background:#f1eddf}.static-mode .selected-copy{left:12%;width:76%}.static-mode .exhibit-label{display:none}.static-mode .invitation{background:#073bdb}.static-mode .stage-footer{position:relative;background:#073bdb;color:#fff}.static-mode .stage-footer nav{display:none}.static-mode .registration,.static-mode .mobile-shade{display:none}
</style>
