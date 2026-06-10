import { error } from '@sveltejs/kit';
import { getProject, getAdjacent } from '$lib/projects';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const project = getProject(params.slug);
	if (!project) throw error(404, 'Project not found');
	const { prev, next } = getAdjacent(params.slug);
	return { project, prev, next };
};
