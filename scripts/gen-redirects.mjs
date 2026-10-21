/**
 * Tools live at /tools/<slug>/ only. They used to also render at
 * /projects/<slug>/, so forward the old URLs instead of returning 404.
 *
 * Written to vercel.json rather than Astro's `redirects` config: Astro strips
 * trailing slashes from redirect sources, so it cannot emit both URL forms,
 * and only the slashed form matches after Vercel's trailing-slash handling.
 *
 * Run via `pnpm build` (prebuild). Derived from content frontmatter so new
 * tools are covered automatically.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const contentDir = fileURLToPath(new URL('../src/content/projects/', import.meta.url));
const configPath = fileURLToPath(new URL('../vercel.json', import.meta.url));
// Matches the canonical host the site emits; redirecting to a relative path
// would land on the apex host and cost an extra hop.
const SITE_ORIGIN = 'https://www.benihkode.web.id';

const redirects = [];
for (const file of readdirSync(contentDir)) {
	if (!/\.mdx?$/.test(file)) continue;
	const slug = file.replace(/\.mdx?$/, '');
	const frontmatter = readFileSync(new URL(file, `file://${contentDir}`), 'utf8').split(/^---$/m)[1] ?? '';
	if (!/^category:\s*["']?tool["']?\s*$/m.test(frontmatter)) continue;

	// Both forms need their own entry: Vercel matched the slashless source
	// exactly and returned 404 for the slashed variant, which is the form
	// most inbound links and search results use.
	for (const source of [`/projects/${slug}`, `/projects/${slug}/`]) {
		redirects.push({ source, destination: `${SITE_ORIGIN}/tools/${slug}/`, permanent: true });
	}
}

// Preserve any other Vercel settings a human added.
const existing = existsSync(configPath) ? JSON.parse(readFileSync(configPath, 'utf8')) : {};
writeFileSync(configPath, `${JSON.stringify({ ...existing, redirects }, null, 2)}\n`);

console.log(`vercel.json: ${redirects.length} redirects (${redirects.length / 2} tools, both slash forms)`);
