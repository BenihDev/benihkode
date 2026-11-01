import { mapEntriesToStaticPaths } from './routing.ts';

interface DistributedApp {
	id: string;
	data: {
		category?: 'tool' | 'app';
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
 * The entries eligible for the generated store-facing App pages: distributed
 * AND category app. The category check is defense in depth — a tool mis-flagged
 * `distributed` must not grow an app-only page. Hand-written pages at the same
 * URL win: emitting the generated page too would publish a second page there
 * and let one silently shadow the other.
 */
function distributedAppStaticPaths<T extends DistributedApp>(
	apps: T[],
	handWrittenSlugs: ReadonlySet<string>,
) {
	return mapEntriesToStaticPaths(
		apps.filter(a => a.data.distributed && a.data.category === 'app' && !handWrittenSlugs.has(a.id)),
	);
}

/**
 * Resolves the canonical URL for an App's store-facing page. Hand-written and
 * generated pages publish at the same URL — `/apps/<slug>/<segment>` — so the
 * link is uniform and does not depend on which kind of page is behind it.
 */
function appPageHref(app: DistributedApp, segment: 'privacy' | 'support') {
	return `/apps/${app.id}/${segment}`;
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
export function getPrivacyPolicyStaticPaths<T extends DistributedApp>(
	apps: T[],
	handWrittenSlugs: ReadonlySet<string> = new Set(),
) {
	return distributedAppStaticPaths(apps, handWrittenSlugs);
}

/**
 * Resolves the Privacy Policy link for an App. Hand-written and generated
 * policies publish at the same URL — `/apps/<slug>/privacy` — so the link is
 * uniform and does not depend on which kind of page is behind it.
 * @param app A project entry from getCollection('projects').
 * @returns A site-relative path to the App's privacy policy page.
 */
export function getPrivacyPolicyHref(app: DistributedApp) {
	return appPageHref(app, 'privacy');
}

/**
 * Maps App collection entries to Astro static paths parameters and props for
 * the generated `/apps/<slug>/support` route. Only store-distributed Apps get
 * a support page. Apps that ship a hand-written page at that same URL are
 * skipped: emitting the generated page too would publish a second support
 * page at the same URL and let one silently shadow the other. The
 * hand-written slugs come from file presence (the page feeds them via
 * import.meta.glob), the same escape hatch the privacy route uses.
 * @param apps The array of App entries from getCollection('projects').
 * @param handWrittenSlugs Slugs of Apps that have their own support page file.
 * @returns An array of objects containing params and props for Astro's getStaticPaths.
 */
export function getSupportStaticPaths<T extends DistributedApp>(
	apps: T[],
	handWrittenSlugs: ReadonlySet<string> = new Set(),
) {
	return distributedAppStaticPaths(apps, handWrittenSlugs);
}

/**
 * Resolves the Support link for an App. Hand-written and generated support
 * pages publish at the same URL — `/apps/<slug>/support` — so the link is
 * uniform and does not depend on which kind of page is behind it.
 * @param app A project entry from getCollection('projects').
 * @returns A site-relative path to the App's support page.
 */
export function getSupportHref(app: DistributedApp) {
	return appPageHref(app, 'support');
}

/**
 * Slugs of Apps that ship their own hand-written page for the given kind —
 * the file-presence escape hatch. The route templates feed this the keys of
 * their `import.meta.glob(...)` map; the glob itself must stay at the call
 * site because Vite needs a literal pattern, so only the key-to-slug
 * extraction lives here (shared by the privacy and support routes).
 * @param pageKind The generated page kind, 'privacy' or 'support'.
 * @param pagePaths The record returned by import.meta.glob for that kind.
 * @returns The distinct App slugs that have a hand-written page file.
 */
export function handWrittenAppPageSlugs(
	pageKind: 'privacy' | 'support',
	pagePaths: Record<string, unknown>,
) {
	const slugs = new Set<string>();
	for (const path of Object.keys(pagePaths)) {
		const slug = path.match(new RegExp(`/apps/([^/]+)/${pageKind}\\.astro$`))?.[1];
		// The bracketed [slug] segment is the generated route's own directory,
		// never a bespoke page.
		if (slug && !slug.includes('[')) slugs.add(slug);
	}
	return slugs;
}
