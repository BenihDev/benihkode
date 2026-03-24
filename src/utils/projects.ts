/**
 * Maps projects collection entries to Astro static paths parameters and props for privacy policy pages.
 * @param projects The array of project entries from getCollection('projects').
 * @returns An array of objects containing params and props for Astro's getStaticPaths.
 */
export function getPrivacyPolicyStaticPaths<T extends { id: string; data: { hasPrivacyPolicy?: boolean } }>(projects: T[]) {
	return projects
		.filter(p => p.data.hasPrivacyPolicy)
		.map((project) => ({
			params: { slug: project.id },
			props: project,
		}));
}
