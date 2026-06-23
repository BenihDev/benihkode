import { getCollection, type CollectionEntry } from 'astro:content';
import { blogSorter, orderSorter } from './sorters.ts';

/**
 * ⚡ Bolt Optimization: Cached collection fetching and sorting.
 * This ensures that file system reads and sorting logic are only executed once during the build.
 */

let blogCache: CollectionEntry<'blog'>[] | null = null;
let projectsCache: CollectionEntry<'projects'>[] | null = null;
let ideasCache: CollectionEntry<'ideas'>[] | null = null;

/**
 * Gets all blog posts sorted by publication date (newest first).
 */
export async function getSortedBlogPosts(): Promise<CollectionEntry<'blog'>[]> {
	if (blogCache) return blogCache;

	const posts = await getCollection('blog');
	blogCache = posts.sort(blogSorter);
	return blogCache;
}

/**
 * Gets all projects sorted by their defined order.
 */
export async function getSortedProjects(): Promise<CollectionEntry<'projects'>[]> {
	if (projectsCache) return projectsCache;

	const projects = await getCollection('projects');
	projectsCache = projects.sort(orderSorter);
	return projectsCache;
}

/**
 * Gets all ideas sorted by their defined order.
 */
export async function getSortedIdeas(): Promise<CollectionEntry<'ideas'>[]> {
	if (ideasCache) return ideasCache;

	const ideas = await getCollection('ideas');
	ideasCache = ideas.sort(orderSorter);
	return ideasCache;
}
