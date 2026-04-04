/**
 * Generic utility to map collection entries to Astro's static paths parameters and props.
 * @param entries The array of collection entries (e.g., from getCollection).
 * @returns An array of objects containing params and props for Astro's getStaticPaths.
 */
export function mapEntriesToStaticPaths<T extends { id: string }>(entries: T[]) {
	return entries.map((entry) => ({
		params: { slug: entry.id },
		props: entry,
	}));
}
