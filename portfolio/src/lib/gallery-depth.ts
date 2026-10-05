type DepthBase = {
	width: number;
	height: number;
	position: [number, number];
	mobilePosition: [number, number];
};

/** Three planes cut from one original painting with a segmentation matte. */
export type MaskedDepth = DepthBase & {
	segmentation: string;
	cleanPlate: string;
	farPlate: string;
	/** Far opening traced in normalized 1000 × 1000 artwork coordinates. */
	farPath?: string;
	/** A continuous foreground base (e.g. the banquet floor and its dogs). */
	foregroundFillFrom?: number;
	layers: [string, string, string];
};

/** Ready-made, aligned images, back to front: an opaque plate, then alpha cutouts. */
export type CutoutDepth = DepthBase & {
	cutouts: [string, string] | [string, string, string];
	/** One name per cutout. */
	layers: string[];
};

export type PaintingDepthConfig = MaskedDepth | CutoutDepth;

// Matte colors: white = foreground, gray = middle, black = far background.
// All cutouts retain the original artwork's pixels. Generated plates are
// underneath them and become visible only in the small disocclusion gaps.
export const galleryDepth: Record<string, PaintingDepthConfig> = {
	// AI-generated reinterpretations supplied as separate layers, so every plane
	// is complete and nothing needs reconstructing behind the figures.
	cord: {
		width: 1561, height: 1008, position: [.5, .8], mobilePosition: [.5, .5],
		cutouts: [
			'/images/exhibition/depth/cord/cutouts/background.webp',
			'/images/exhibition/depth/cord/cutouts/philosophers.webp',
			'/images/exhibition/depth/cord/cutouts/foreground.webp'
		],
		layers: ['Vaulted hall, arch and sky', 'Plato, Aristotle and the upper group', 'Foreground groups']
	},
	'indie-campers': {
		width: 1569, height: 1003, position: [.5, .15], mobilePosition: [.59, .5],
		cutouts: [
			'/images/exhibition/depth/indie-campers/cutouts/background.webp',
			'/images/exhibition/depth/indie-campers/cutouts/side-figures.webp',
			'/images/exhibition/depth/indie-campers/cutouts/venus-shell.webp'
		],
		layers: ['Sky, sea, shoreline and trees', 'Zephyr, Chloris and the Hora', 'Venus and her shell']
	},
	tenzo: {
		width: 1448, height: 1086, position: [.5, .68], mobilePosition: [.57, .5],
		cutouts: [
			'/images/exhibition/depth/tenzo/cutouts/background.webp',
			'/images/exhibition/depth/tenzo/cutouts/terrace.webp',
			'/images/exhibition/depth/tenzo/cutouts/banquet.webp'
		],
		layers: ['Architecture and sky', 'Upper terrace, servants and onlookers', 'Banquet, guests and musicians']
	}
};
