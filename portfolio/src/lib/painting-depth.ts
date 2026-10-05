/** A reversible, hand-shaped depth interpretation of Raphael's composition.
 * The source reproduction is sampled directly: no generated/repainted pixels.
 * This is 2.5D parallax, not reconstructed, hidden 3D geometry.
 */
const vertexSource = `
attribute vec2 position;
varying vec2 screenUV;
void main() {
  screenUV = vec2(position.x * .5 + .5, .5 - position.y * .5);
  gl_Position = vec4(position, 0., 1.);
}`;

const fragmentSource = `
precision mediump float;
uniform sampler2D painting;
uniform vec2 crop;
uniform vec2 alignment;
uniform vec2 camera;
varying vec2 screenUV;

float groupDepth(vec2 uv, vec2 center, vec2 radius) {
  return 1. - smoothstep(.65, 1.15, length((uv - center) / radius));
}

float depthAt(vec2 uv) {
  // The central opening recedes; the surrounding vault sits nearer the viewer.
  vec2 perspective = (uv - vec2(.515, .55)) / vec2(.53, .66);
  float vault = .13 + .42 * smoothstep(.12, 1.05, length(perspective));
  // The lower steps advance towards the viewer instead of moving as a flat wall.
  float floor = mix(.22, .95, smoothstep(.57, 1., uv.y));
  float depth = max(vault, floor);
  // Broad, soft volumes for the seated scholars. Feathering avoids cutout seams.
  depth = mix(depth, .86, groupDepth(uv, vec2(.245, .825), vec2(.145, .20)));
  depth = mix(depth, .92, groupDepth(uv, vec2(.437, .842), vec2(.069, .14)));
  depth = mix(depth, .84, groupDepth(uv, vec2(.828, .812), vec2(.135, .20)));
  return depth;
}

void main() {
  vec2 uv = screenUV * crop + (1. - crop) * alignment;
  // Sample the depth in original-artwork coordinates so mobile crops keep the
  // same spatial interpretation. Two inverse steps reduce stretching at edges.
  vec2 ray = camera * crop;
  vec2 displaced = uv;
  for (int i = 0; i < 2; i++) {
    displaced = uv - ray * (.18 + depthAt(displaced) * .82);
  }
  gl_FragColor = texture2D(painting, clamp(displaced, vec2(.001), vec2(.999)));
}`;

export function createPaintingDepth(canvas: HTMLCanvasElement, image: HTMLImageElement) {
	const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, powerPreference: 'low-power' });
	if (!gl) return null;
	const shaders: WebGLShader[] = [];
	let program: WebGLProgram | null = null;
	let buffer: WebGLBuffer | null = null;
	let texture: WebGLTexture | null = null;
	const dispose = () => {
		gl.useProgram(null);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindTexture(gl.TEXTURE_2D, null);
		if (texture) gl.deleteTexture(texture);
		if (buffer) gl.deleteBuffer(buffer);
		if (program) gl.deleteProgram(program);
		for (const shader of shaders) gl.deleteShader(shader);
	};
	try {
		const compile = (type: number, source: string) => {
			const shader = gl.createShader(type);
			if (!shader) throw new Error('Shader unavailable');
			shaders.push(shader);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Shader compilation failed');
			return shader;
		};
		program = gl.createProgram();
		if (!program) throw new Error('Program unavailable');
		gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
		gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Program linking failed');
		gl.useProgram(program);
		buffer = gl.createBuffer();
		texture = gl.createTexture();
		if (!buffer || !texture) throw new Error('GPU resources unavailable');
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
		const position = gl.getAttribLocation(program, 'position');
		gl.enableVertexAttribArray(position);
		gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.uniform1i(gl.getUniformLocation(program, 'painting'), 0);
		const crop = gl.getUniformLocation(program, 'crop');
		const alignment = gl.getUniformLocation(program, 'alignment');
		const camera = gl.getUniformLocation(program, 'camera');
		return {
			resize(width: number, height: number, mobile: boolean) {
				// Cap fill rate on retina/mobile displays; the original image remains
				// the loading, unsupported-device, and reduced-motion fallback.
				const ratio = Math.min(devicePixelRatio || 1, 1.5, 2560 / Math.max(width, height));
				canvas.width = Math.max(1, Math.round(width * ratio));
				canvas.height = Math.max(1, Math.round(height * ratio));
				gl.viewport(0, 0, canvas.width, canvas.height);
				const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
				gl.uniform2f(crop, width / (image.naturalWidth * scale), height / (image.naturalHeight * scale));
				gl.uniform2f(alignment, .5, mobile ? .5 : .6);
			},
			draw(x: number, y: number) {
				gl.uniform2f(camera, x, y);
				gl.drawArrays(gl.TRIANGLES, 0, 6);
			},
			dispose
		};
	} catch {
		dispose();
		return null;
	}
}
