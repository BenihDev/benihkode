/**
 * Forwards the old /projects/<slug> URLs to where each project actually
 * renders: tools at /tools/<slug>/, apps at /apps/<slug>/. The same file also
 * forwards site-level pages that moved under the project that owns them.
 *
 * Written to vercel.json rather than Astro's `redirects` config: Astro strips
 * trailing slashes from redirect sources, so it cannot emit both URL forms,
 * and only the slashed form matches after Vercel's trailing-slash handling.
 *
 * Run via `pnpm build` (prebuild). Redirects are derived from content
 * frontmatter so new tools and apps are covered automatically. The pair
 * builder is exported so unit tests can verify the generated pairs against
 * the real content.
 */
import { existsSync, readFileSync, readdirSync, realpathSync, writeFileSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const contentDir = fileURLToPath(new URL('../src/content/projects/', import.meta.url));
const configPath = fileURLToPath(new URL('../vercel.json', import.meta.url));
// Matches the canonical host the site emits; redirecting to a relative path
// would land on the apex host and cost an extra hop.
export const SITE_ORIGIN = 'https://www.benihkode.web.id';

/**
 * Builds the /projects/<slug> forwarding pairs for the given content entries:
 * landing pages for every project, plus support pages and privacy policies for
 * the store-distributed Apps. Both forms need their own entry: Vercel matched
 * the slashless source exactly and returned 404 for the slashed variant, which
 * is the form most inbound links and search results use.
 * @param entries Objects of { slug, category, distributed } derived from project frontmatter.
 * @returns Vercel redirect objects in content order.
 */
export function projectRedirects(entries) {
	const redirects = [];
	for (const { slug, category, distributed } of entries) {
		if (category === 'tool') {
			for (const source of [`/projects/${slug}`, `/projects/${slug}/`]) {
				redirects.push({ source, destination: `${SITE_ORIGIN}/tools/${slug}/`, permanent: true });
			}
		} else if (category === 'app') {
			// statusCode 301 rather than permanent: `permanent: true` emits a 308,
			// and this is a GET-only page move, where 301 is the conventional
			// permanent redirect.
			for (const source of [`/projects/${slug}`, `/projects/${slug}/`]) {
				redirects.push({ source, destination: `${SITE_ORIGIN}/apps/${slug}/`, statusCode: 301 });
			}
			if (distributed) {
				for (const source of [`/projects/${slug}/support`, `/projects/${slug}/support/`]) {
					redirects.push({ source, destination: `${SITE_ORIGIN}/apps/${slug}/support/`, statusCode: 301 });
				}
				for (const source of [`/projects/${slug}/privacy-policy`, `/projects/${slug}/privacy-policy/`]) {
					redirects.push({ source, destination: `${SITE_ORIGIN}/apps/${slug}/privacy/`, statusCode: 301 });
				}
			}
		}
		// Other categories have no canonical landing; the content schema only
		// accepts tool and app anyway.
	}
	return redirects;
}

/**
 * Reads a raw value from a frontmatter block, unquoted. The generator cannot
 * use the content schema (it runs before Astro), so it parses frontmatter
 * directly. Exported so the guard tests parse frontmatter exactly like the
 * generator does instead of carrying their own copies.
 */
export function frontmatterValue(frontmatter, key) {
	const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
	return match?.[1].trim().replace(/^["']|["']$/g, '') ?? '';
}

/**
 * Parses a frontmatter boolean the way Astro's YAML loader accepts it:
 * case-insensitive true/yes. Anything else — including the key being absent —
 * is not distributed.
 */
export function frontmatterBoolean(frontmatter, key) {
	return /^(true|yes)$/i.test(frontmatterValue(frontmatter, key));
}

/**
 * Parses one project entry from raw frontmatter the way the content schema
 * would: category falls back to 'app' when the frontmatter omits it (the zod
 * schema is z.enum(['tool', 'app']).default('app')), and distributed is a
 * YAML boolean, not a bare 'true' string compare.
 * @param slug The entry slug (the content file name without extension).
 * @param frontmatter The raw frontmatter block of the content file.
 * @returns An entry of { slug, category, distributed } for projectRedirects().
 */
export function projectEntry(slug, frontmatter) {
	return {
		slug,
		category: frontmatterValue(frontmatter, 'category') || 'app',
		distributed: frontmatterBoolean(frontmatter, 'distributed'),
	};
}

function main() {
	const entries = [];
	for (const file of readdirSync(contentDir)) {
		if (!/\.mdx?$/.test(file)) continue;
		const slug = file.replace(/\.mdx?$/, '');
		const frontmatter = readFileSync(new URL(file, `file://${contentDir}`), 'utf8').split(/^---$/m)[1] ?? '';
		entries.push(projectEntry(slug, frontmatter));
	}

	const redirects = projectRedirects(entries);

	// Preserve any other Vercel settings a human added.
	const existing = existsSync(configPath) ? JSON.parse(readFileSync(configPath, 'utf8')) : {};

	const toolRedirectCount = redirects.filter((redirect) => redirect.destination.includes('/tools/')).length;
	const appRedirectCount = redirects.filter((redirect) => redirect.destination.includes('/apps/') && !redirect.source.includes('/support') && !redirect.source.includes('/privacy-policy')).length;
	const supportRedirectCount = redirects.filter((redirect) => redirect.source.includes('/support')).length;
	const privacyRedirectCount = redirects.filter((redirect) => redirect.source.includes('/privacy-policy')).length;

	// Site-level pages that moved under the app that owns them. /support was
	// EchoChess-only, so it now lives at the app's own URL. Both slash forms are
	// listed for the same reason as the project redirects above.
	const movedPages = [
		{ source: '/support', destination: `${SITE_ORIGIN}/apps/echochess/support/` },
		{ source: '/support/', destination: `${SITE_ORIGIN}/apps/echochess/support/` },
	];
	for (const page of movedPages) {
		// statusCode 301 rather than permanent: `permanent: true` emits a 308, and
		// this is a GET-only page move, where 301 is the conventional permanent
		// redirect.
		redirects.push({ ...page, statusCode: 301 });
	}

	writeFileSync(configPath, `${JSON.stringify({ ...existing, redirects }, null, 2)}\n`);

	console.log(
		`vercel.json: ${redirects.length} redirects (${toolRedirectCount / 2} tools, ${appRedirectCount / 2} app landings, ${supportRedirectCount / 2} support pages, ${privacyRedirectCount / 2} privacy policies, ${movedPages.length} moved pages)`,
	);
}

// Only run when invoked directly (`node scripts/gen-redirects.mjs` via the
// prebuild); importing the module — the unit tests do — must stay free of
// side effects.
const invokedDirectly = Boolean(process.argv[1])
	&& import.meta.url === pathToFileURL(realpathSync(resolve(process.argv[1]))).href;
if (invokedDirectly) main();
