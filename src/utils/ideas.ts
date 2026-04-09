import { mapEntriesToStaticPaths } from './routing.ts';

/**
 * Maps ideas collection entries to Astro static paths parameters and props.
 * @param ideas The array of idea entries from getCollection('ideas').
 * @returns An array of objects containing params and props for Astro's getStaticPaths.
 */
export function mapIdeasToStaticPaths<T extends { id: string }>(ideas: T[]) {
	return mapEntriesToStaticPaths(ideas);
}
