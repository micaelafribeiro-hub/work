import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// Scroll controls a continuous stage. The painted scenes use depth displacement;
// the framed lens and constellation are geometry in the same WebGL renderer.
export async function createStage(canvas: HTMLCanvasElement, root: HTMLElement, onReady: () => void, onProgress: (value: number) => void) {
	const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
	renderer.setPixelRatio(Math.min(devicePixelRatio, 1.65));
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = .95;
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(38, 1, .1, 80);
	camera.position.z = 9;
	const textureLoader = new THREE.TextureLoader();
	let dead = false;
	const textures = await Promise.all(['/images/stage/curtain.webp','/images/stage/orchard.webp'].map(url => textureLoader.loadAsync(url))).catch(error => { renderer.dispose(); throw error; });
	textures.forEach(t => { t.colorSpace = THREE.SRGBColorSpace; t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter; });
	const uniforms = {
		uHero: { value: textures[0] }, uGarden: { value: textures[1] }, uProgress: { value: 0 },
		uAspect: { value: 1 }, uImageAspect: { value: textures[0].image.width / textures[0].image.height },
		uGardenAspect: { value: textures[1].image.width / textures[1].image.height },
		uPointer: { value: new THREE.Vector2() }, uTime: { value: 0 }
	};
	const bg = new THREE.Mesh(new THREE.PlaneGeometry(2,2), new THREE.ShaderMaterial({
		uniforms, depthTest:false, depthWrite:false, toneMapped:false,
		vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.999,1.);}`,
		fragmentShader: `
			uniform sampler2D uHero,uGarden; uniform float uProgress,uAspect,uImageAspect,uGardenAspect,uTime; uniform vec2 uPointer; varying vec2 vUv;
			vec2 cover(vec2 uv,float ratio){vec2 s=vec2(min(uAspect/ratio,1.),min(ratio/uAspect,1.));return (uv-.5)*s+vec2(uAspect<1.? .70:.5,.5);}
			float noise(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
			void main(){
				float p=uProgress; float enter=smoothstep(.13,.29,p);float paper=smoothstep(.46,.57,p);float outro=smoothstep(.77,.88,p);
				vec2 uv=cover(vUv,uImageAspect);uv=(uv-vec2(.75,.48))/(1.+enter*.45)+vec2(.75,.48);
				vec3 sampleHero=texture2D(uHero,uv).rgb;
				float subject=1.-smoothstep(.03,.3,sampleHero.b-max(sampleHero.r,sampleHero.g));
				uv+=uPointer*.012*(.2+subject*.8);uv.y+=sin(uTime*.5+uv.x*3.)*.001*subject;
				vec3 hero=texture2D(uHero,uv).rgb;
				vec2 guv=cover(vUv,uGardenAspect);guv=(guv-.5)/(1.+smoothstep(.26,.5,p)*.25)+.5;
				vec3 gs=texture2D(uGarden,guv).rgb;float gd=1.-dot(gs,vec3(.2126,.7152,.0722));guv+=uPointer*.025*gd;
				vec3 garden=texture2D(uGarden,guv).rgb*.79;
				vec3 col=mix(hero,garden,enter);
				vec3 cream=vec3(.925,.901,.837)+(noise(gl_FragCoord.xy)-.5)*.012;
				col=mix(col,cream,paper);
				vec3 blue=mix(vec3(.005,.085,.58),vec3(.015,.21,.95),vUv.y);
				col=mix(col,blue,outro);
				gl_FragColor=vec4(col,1.);
				#include <colorspace_fragment>
			}`
	}));
	bg.frustumCulled=false;bg.renderOrder=-100;scene.add(bg);

	const environment = new RoomEnvironment();
	const pmrem = new THREE.PMREMGenerator(renderer);
	const env = pmrem.fromScene(environment, .035);
	scene.environment=env.texture;
	scene.add(new THREE.HemisphereLight(0xfff6de,0x263865,2));
	const key = new THREE.DirectionalLight(0xfff4df,4);key.position.set(-3,5,7);scene.add(key);
	const gold=new THREE.MeshStandardMaterial({color:0xba8d36,metalness:.9,roughness:.25});
	const ivory=new THREE.MeshStandardMaterial({color:0xe4dac4,roughness:.72});
	const ink=new THREE.MeshStandardMaterial({color:0x223252,metalness:.55,roughness:.24});
	const exhibit=new THREE.Group();scene.add(exhibit);
	const back=new THREE.Mesh(new THREE.BoxGeometry(3.35,3.7,.12),ivory);exhibit.add(back);
	for(let tier=0;tier<4;tier++){
		const w=3.4-tier*.14,h=3.75-tier*.14,z=.06+tier*.028;
		for(const [a,b,x,y] of [[w,.06,0,h/2],[w,.06,0,-h/2],[.06,h,-w/2,0],[.06,h,w/2,0]]){
			const rail=new THREE.Mesh(new THREE.BoxGeometry(a,b,.075),tier%2?ivory:gold);rail.position.set(x,y,z);exhibit.add(rail);
		}
	}
	// A dimensional lens: the act of looking is the exhibit, not a fabricated product metric.
	const lens = new THREE.Group();exhibit.add(lens);lens.position.z=.45;
	const rim=new THREE.Mesh(new THREE.TorusGeometry(.87,.11,24,96),gold);lens.add(rim);
	const inner=new THREE.Mesh(new THREE.SphereGeometry(.78,64,32),new THREE.MeshPhysicalMaterial({color:0x214aec,metalness:.7,roughness:.12,clearcoat:1}));inner.scale.z=.32;lens.add(inner);
	const orbit=new THREE.Mesh(new THREE.TorusGeometry(1.1,.012,12,96),gold);orbit.rotation.x=.45;orbit.rotation.y=.6;lens.add(orbit);
	const handle=new THREE.Mesh(new THREE.CylinderGeometry(.07,.085,.95,24),gold);handle.position.set(-.78,-.95,0);handle.rotation.z=-.65;lens.add(handle);
	for(let i=0;i<20;i++){
		const tick=new THREE.Mesh(new THREE.BoxGeometry(.012,.075,.012),ink);const a=i/20*Math.PI*2;tick.position.set(Math.sin(a)*1.29,Math.cos(a)*1.29,.14);tick.rotation.z=-a;exhibit.add(tick);
	}

	const constellation=new THREE.Group();scene.add(constellation);
	const nodes: THREE.Mesh[]=[];
	const locations=[[.5,1.1,0],[1.5,1.65,-.4],[2.6,1.05,.3],[1.8,.15,.7],[3.05,-.5,-.3],[.55,-.7,.2],[1.5,-1.3,-.4],[3.2,1.9,-1]];
	const glowCanvas=document.createElement('canvas');glowCanvas.width=64;glowCanvas.height=64;
	const cx=glowCanvas.getContext('2d')!;const glow=cx.createRadialGradient(32,32,0,32,32,32);glow.addColorStop(0,'rgba(255,255,245,1)');glow.addColorStop(.12,'rgba(220,255,240,.9)');glow.addColorStop(.4,'rgba(117,222,255,.2)');glow.addColorStop(1,'rgba(117,222,255,0)');cx.fillStyle=glow;cx.fillRect(0,0,64,64);
	const glowTexture=new THREE.CanvasTexture(glowCanvas);
	const nodeMaterial=new THREE.MeshBasicMaterial({color:0xe6fffa});
	locations.forEach(([x,y,z])=>{const node=new THREE.Mesh(new THREE.SphereGeometry(.032,12,12),nodeMaterial);node.position.set(x,y,z);const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));sprite.scale.set(.5,.5,.5);node.add(sprite);nodes.push(node);constellation.add(node);});
	const points:THREE.Vector3[]=[];
	for(const [a,b] of [[0,1],[1,2],[2,3],[3,4],[3,5],[5,6],[6,4],[2,7],[0,5]])points.push(new THREE.Vector3(...locations[a]),new THREE.Vector3(...locations[b]));
	constellation.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:0x72c5ff,transparent:true,opacity:.4})));
	const dust=new Float32Array(210*3);for(let i=0;i<dust.length;i+=3){dust[i]=(Math.random()-.5)*13;dust[i+1]=(Math.random()-.5)*8;dust[i+2]=-Math.random()*3;}
	const particles=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(dust,3)),new THREE.PointsMaterial({size:.025,color:0xb9dcff,transparent:true,opacity:.5}));constellation.add(particles);
	let width=0,height=0,target=0,smooth=0,last=performance.now(),frame=0;
	const pointer=new THREE.Vector2();
	const resize=()=>{width=canvas.clientWidth;height=canvas.clientHeight;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();uniforms.uAspect.value=camera.aspect;};
	const readScroll=()=>{target=THREE.MathUtils.clamp(-root.getBoundingClientRect().top/(root.offsetHeight-innerHeight),0,1);};
	const move=(e:PointerEvent)=>{pointer.set(e.clientX/innerWidth-.5,.5-e.clientY/innerHeight);};
	const reset=()=>pointer.set(0,0);
	const animate=(now:number)=>{
		if(dead)return;
		const dt=Math.min((now-last)/1000,.05);last=now;
		smooth+=(target-smooth)*(1-Math.exp(-dt*7));
		onProgress(smooth);
		uniforms.uProgress.value=smooth;uniforms.uTime.value=now*.001;
		uniforms.uPointer.value.lerp(pointer,1-Math.exp(-dt*5));
		const appear=THREE.MathUtils.smoothstep(smooth,.47,.57)*(1-THREE.MathUtils.smoothstep(smooth,.76,.84));
		exhibit.visible=appear>.005;
		const mobile=width<801;
		exhibit.position.set(mobile?0:-2.05,mobile?1.27:.05,0);
		exhibit.scale.setScalar(appear*(mobile?.43:.82));
		exhibit.rotation.set(-.06+pointer.y*.035,.1+pointer.x*.06,-.055+(smooth-.65)*.08);
		lens.rotation.y=Math.sin(now*.0004)*.2;orbit.rotation.z=now*.00012;
		constellation.visible=smooth>.77;constellation.scale.setScalar(THREE.MathUtils.smoothstep(smooth,.77,.91));
		constellation.rotation.y=pointer.x*.16;constellation.rotation.x=-pointer.y*.12;
		if(mobile){constellation.position.set(-1,-.8,-2);}else constellation.position.set(0,0,0);
		nodes.forEach((n,i)=>n.children[0].scale.setScalar(.35+Math.sin(now*.0015+i)*.08));
		renderer.render(scene,camera);
		frame=requestAnimationFrame(animate);
	};
	window.addEventListener('resize',resize);window.addEventListener('scroll',readScroll,{passive:true});window.addEventListener('pointermove',move,{passive:true});window.addEventListener('blur',reset);
	const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);}else{last=performance.now();frame=requestAnimationFrame(animate);}};
	document.addEventListener('visibilitychange',visibility);
	resize();readScroll();smooth=target;frame=requestAnimationFrame(animate);onReady();
	return ()=>{dead=true;cancelAnimationFrame(frame);window.removeEventListener('resize',resize);window.removeEventListener('scroll',readScroll);window.removeEventListener('pointermove',move);window.removeEventListener('blur',reset);document.removeEventListener('visibilitychange',visibility);const geometries=new Set<THREE.BufferGeometry>();const materials=new Set<THREE.Material>();scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Points||o instanceof THREE.LineSegments){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));}else if(o instanceof THREE.Sprite)materials.add(o.material);});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());glowTexture.dispose();env.dispose();environment.dispose();pmrem.dispose();renderer.dispose();};
}
