export type PaintingDepthConfig = {
	width: number;
	height: number;
	position: [number, number];
	mobilePosition: [number, number];
	segmentation: string;
	cleanPlate: string;
	farPlate: string;
	layers: [string, string, string];
	/** Far opening traced in normalized 1000 × 1000 artwork coordinates. */
	farPath?: string;
	/** A continuous foreground base (e.g. the banquet floor and its dogs). */
	foregroundFillFrom?: number;
};

// Matte colors: white = foreground, gray = middle, black = far background.
// All cutouts retain the original artwork's pixels. Generated plates are
// underneath them and become visible only in the small disocclusion gaps.
export const galleryDepth: Record<string, PaintingDepthConfig> = {
	cord: {
		width: 2560, height: 1672, position: [.5, .6], mobilePosition: [.5, .5],
		segmentation: '/images/exhibition/depth/cord/segmentation.webp',
		cleanPlate: '/images/exhibition/depth/cord/clean-plate.webp',
		farPlate: '/images/exhibition/depth/cord/far-plate.webp',
		farPath: 'M430 745 L430 419 C438 367 474 350 514 350 C553 350 588 369 600 421 L600 745 Z',
		layers: ['Distant building and sky', 'Stairs and main arch', 'People and their objects']
	},
	'indie-campers': {
		width: 2560, height: 1608, position: [.5, .48], mobilePosition: [.59, .5],
		segmentation: '/images/exhibition/depth/indie-campers/segmentation.svg',
		cleanPlate: '/images/exhibition/depth/indie-campers/clean-plate.webp',
		farPlate: '/images/exhibition/depth/indie-campers/far-plate.webp',
		layers: ['Sky', 'Sea, shoreline and trees', 'Figures, drapery and shell']
	},
	tenzo: {
		width: 2560, height: 1740, position: [.5, .57], mobilePosition: [.57, .5],
		segmentation: '/images/exhibition/depth/tenzo/segmentation.webp',
		cleanPlate: '/images/exhibition/depth/tenzo/clean-plate.webp',
		farPlate: '/images/exhibition/depth/tenzo/far-plate.webp',
		farPath: 'M348 0 H682 L684 40 L687 80 L682 122 L663 162 L655 215 L677 280 L681 402 V505 H329 V340 L339 311 L344 227 L348 196 L350 140 L342 105 L342 70 L350 52 Z',
		foregroundFillFrom: .75,
		layers: ['Sky and distant bell tower', 'Architecture and upper terrace', 'Banquet, guests and musicians']
	}
};
