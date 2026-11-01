import { mapEntriesToStaticPaths } from './routing.ts';

interface PrivacyPolicyProject {
	id: string;
	data: {
		hasPrivacyPolicy?: boolean;
		privacyPolicyUrl?: string;
	};
}

interface LandingProject {
	id: string;
	data: {
		category?: string;
	};
}

/**
 * Resolves the canonical landing URL for a project: tools live under
 * `/tools/<slug>`, apps under `/apps/<slug>`. The Portfolio index, search
 * results, and card components all link through this helper so a landing is
 * never reachable at two self-canonical URLs.
 * @param project A project entry from getCollection('projects').
 * @returns A site-relative path to the project's landing page.
 */
export function projectLandingHref(project: LandingProject) {
	return project.data.category === 'tool' ? `/tools/${project.id}` : `/apps/${project.id}`;
}

/**
 * Maps projects collection entries to Astro static paths parameters and props for privacy policy pages.
 * Entries that point at their own page via `privacyPolicyUrl` are skipped: emitting the generated page
 * too would publish a second policy at the same URL and let one silently shadow the other.
 * @param projects The array of project entries from getCollection('projects').
 * @returns An array of objects containing params and props for Astro's getStaticPaths.
 */
export function getPrivacyPolicyStaticPaths<T extends PrivacyPolicyProject>(projects: T[]) {
	return mapEntriesToStaticPaths(projects.filter(p => p.data.hasPrivacyPolicy && !p.data.privacyPolicyUrl));
}

/**
 * Resolves the Privacy Policy link for a project: the bespoke page when the entry
 * sets `privacyPolicyUrl`, otherwise the generated `/projects/<slug>/privacy-policy` route.
 * @param project A project entry from getCollection('projects').
 * @returns A site-relative path to the project's privacy policy page.
 */
export function getPrivacyPolicyHref(project: PrivacyPolicyProject) {
	return project.data.privacyPolicyUrl ?? `/projects/${project.id}/privacy-policy`;
}
