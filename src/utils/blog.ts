/**
 * Maps blog collection entries to Astro static paths parameters and props.
 * @param posts The array of blog post entries from getCollection('blog').
 * @returns An array of objects containing params and props for Astro's getStaticPaths.
 */
export function mapPostsToStaticPaths<T extends { id: string }>(posts: T[]) {
	return posts.map((post) => ({
		params: { slug: post.id },
		props: post,
	}));
}
