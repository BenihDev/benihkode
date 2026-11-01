import { mapEntriesToStaticPaths } from './routing.ts';

interface PrivacyPolicyApp {
	id: string;
	data: {
		distributed?: boolean;
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
 * Maps App collection entries to Astro static paths parameters and props for
 * the generated `/apps/<slug>/privacy` route. Only store-distributed Apps get
 * a policy. Apps that ship a hand-written page at that same URL are skipped:
 * emitting the generated page too would publish a second policy at the same
 * URL and let one silently shadow the other. The hand-written slugs come from
 * file presence (the page feeds them via import.meta.glob), which replaces
 * the old `privacyPolicyUrl` frontmatter field as the escape hatch.
 * @param apps The array of App entries from getCollection('projects').
 * @param handWrittenSlugs Slugs of Apps that have their own privacy page file.
 * @returns An array of objects containing params and props for Astro's getStaticPaths.
 */
export function getPrivacyPolicyStaticPaths<T extends PrivacyPolicyApp>(
	apps: T[],
	handWrittenSlugs: ReadonlySet<string> = new Set(),
) {
	return mapEntriesToStaticPaths(apps.filter(a => a.data.distributed && !handWrittenSlugs.has(a.id)));
}

/**
 * Resolves the Privacy Policy link for an App. Hand-written and generated
 * policies publish at the same URL — `/apps/<slug>/privacy` — so the link is
 * uniform and does not depend on which kind of page is behind it.
 * @param app A project entry from getCollection('projects').
 * @returns A site-relative path to the App's privacy policy page.
 */
export function getPrivacyPolicyHref(app: PrivacyPolicyApp) {
	return `/apps/${app.id}/privacy`;
}
