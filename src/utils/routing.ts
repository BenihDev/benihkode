/**
 * Maps collection entries to Astro static paths parameters and props.
 * @param entries The array of entries from a collection (e.g., getCollection('blog')).
 * @returns An array of objects containing params and props for Astro's getStaticPaths.
 */
export function mapEntriesToStaticPaths<T extends { id: string }>(entries: T[]) {
	return entries.map((entry) => ({
		params: { slug: entry.id },
		props: entry,
	}));
}
