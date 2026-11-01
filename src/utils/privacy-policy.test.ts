import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const PROJECTS_DIR = 'src/content/projects';
const APP_PAGES_DIR = 'src/content/app-pages';
const APPS_PAGES_DIR = 'src/pages/apps';

function frontmatterValue(frontmatter: string, key: string) {
	const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
	return match?.[1].trim().replace(/^["']|["']$/g, '') || undefined;
}

/**
 * Reads the real project entries instead of fixtures: the guard has to fail on
 * the content that ships, not on a mock that agrees with the implementation.
 */
async function distributedApps(): Promise<string[]> {
	const slugs: string[] = [];

	for (const file of await readdir(PROJECTS_DIR)) {
		if (!/\.mdx?$/.test(file)) continue;
		const [, frontmatter = ''] = (await readFile(join(PROJECTS_DIR, file), 'utf8')).split(/^---$/m, 2);
		if (frontmatterValue(frontmatter, 'distributed') === 'true') {
			slugs.push(file.replace(/\.mdx?$/, ''));
		}
	}

	return slugs;
}

/**
 * Hand-written policy pages, as App slugs. A page at
 * `src/pages/apps/<slug>/privacy.astro` publishes `/apps/<slug>/privacy`; the
 * dynamic `[slug]` directory is the generated route, never a bespoke page.
 */
async function handWrittenPrivacySlugs(): Promise<string[]> {
	const pages = await readdir(APPS_PAGES_DIR, { recursive: true });
	return pages
		.map((page) => page.replace(/\\/g, '/'))
		.filter((page) => /^([^/]+)\/privacy\.astro$/.test(page) && !page.includes('['))
		.map((page) => page.match(/^([^/]+)\/privacy\.astro$/)![1]);
}

/**
 * Privacy content documents, as App slugs. These feed the generated
 * `/apps/<slug>/privacy` route.
 */
async function privacyContentSlugs(): Promise<string[]> {
	const docs = await readdir(APP_PAGES_DIR);
	return docs.filter((file) => /\.mdx?$/.test(file)).map((file) => file.replace(/\.mdx?$/, ''));
}

test('every distributed App has a privacy policy behind it', async () => {
	const apps = await distributedApps();
	assert.ok(apps.length > 0, 'expected at least one distributed App');

	const handWritten = new Set(await handWrittenPrivacySlugs());
	const contentDocs = new Set(await privacyContentSlugs());

	const missing = apps.filter((slug) => !handWritten.has(slug) && !contentDocs.has(slug));
	assert.deepEqual(
		missing,
		[],
		`Distributed App without a privacy policy behind it (needs a hand-written page at src/pages/apps/<slug>/privacy.astro or a privacy document at src/content/app-pages/<slug>.md):\n${missing.join('\n')}`,
	);
});

test('every hand-written privacy page belongs to a distributed App', async () => {
	const handWritten = await handWrittenPrivacySlugs();
	assert.ok(handWritten.length > 0, 'expected at least one hand-written privacy page');

	const apps = new Set(await distributedApps());

	const orphans = handWritten.filter((slug) => !apps.has(slug));
	assert.deepEqual(
		orphans,
		[],
		`Hand-written privacy page for a slug that is not a distributed App (so it is unreachable):\n${orphans.join('\n')}`,
	);
});

test('every privacy content document belongs to a distributed App', async () => {
	const docs = await privacyContentSlugs();
	assert.ok(docs.length > 0, 'expected at least one privacy content document');

	const apps = new Set(await distributedApps());

	const orphans = docs.filter((slug) => !apps.has(slug));
	assert.deepEqual(
		orphans,
		[],
		`Privacy content document for a slug that is not a distributed App (so it never renders):\n${orphans.join('\n')}`,
	);
});

test('the retired privacy fields are gone from every project entry', async () => {
	// The schema no longer knows these fields, and Astro's zod schemas strip
	// unknown keys silently — so only a guard catches a leftover in the copy.
	const leftovers: string[] = [];

	for (const file of await readdir(PROJECTS_DIR)) {
		if (!/\.mdx?$/.test(file)) continue;
		const [, frontmatter = ''] = (await readFile(join(PROJECTS_DIR, file), 'utf8')).split(/^---$/m, 2);
		for (const field of ['hasPrivacyPolicy', 'privacyPolicyUrl']) {
			if (frontmatterValue(frontmatter, field) !== undefined) leftovers.push(`${file}: ${field}`);
		}
	}

	assert.deepEqual(
		leftovers,
		[],
		`Retired privacy fields still set — the distributed marker replaced hasPrivacyPolicy, and file presence replaced privacyPolicyUrl:\n${leftovers.join('\n')}`,
	);
});
