import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
// One frontmatter parser for raw frontmatter reads: the generator's, shared
// here so a guard can never disagree with what the prebuild derived.
import { frontmatterBoolean, frontmatterValue } from '../../scripts/gen-redirects.mjs';

const PROJECTS_DIR = 'src/content/projects';
const APP_PAGES_DIR = 'src/content/app-pages';
const APPS_PAGES_DIR = 'src/pages/apps';

/**
 * Reads the real project entries instead of fixtures: the guard has to fail on
 * the content that ships, not on a mock that agrees with the implementation.
 */
async function distributedApps(): Promise<string[]> {
	const slugs: string[] = [];

	for (const file of await readdir(PROJECTS_DIR)) {
		if (!/\.mdx?$/.test(file)) continue;
		const [, frontmatter = ''] = (await readFile(join(PROJECTS_DIR, file), 'utf8')).split(/^---$/m, 2);
		if (frontmatterBoolean(frontmatter, 'distributed')) {
			slugs.push(file.replace(/\.mdx?$/, ''));
		}
	}

	return slugs;
}

/**
 * Hand-written support pages, as App slugs. A page at
 * `src/pages/apps/<slug>/support.astro` publishes `/apps/<slug>/support`; the
 * dynamic `[slug]` directory is the generated route, never a bespoke page.
 */
async function handWrittenSupportSlugs(): Promise<string[]> {
	const pages = await readdir(APPS_PAGES_DIR, { recursive: true });
	return pages
		.map((page) => page.replace(/\\/g, '/'))
		.filter((page) => /^([^/]+)\/support\.astro$/.test(page) && !page.includes('['))
		.map((page) => page.match(/^([^/]+)\/support\.astro$/)![1]);
}

/**
 * Support content documents, as App slugs. These feed the generated
 * `/apps/<slug>/support` route. The appPages collection also holds privacy
 * documents (`<slug>.md`), so only the `<slug>-support.md` naming counts
 * here. The dash (not a dot) keeps the loader's generated id predictable.
 */
async function supportContentSlugs(): Promise<string[]> {
	const docs = await readdir(APP_PAGES_DIR);
	return docs
		.filter((file) => /-support\.mdx?$/.test(file))
		.map((file) => file.replace(/-support\.mdx?$/, ''));
}

test('every distributed App has a support page behind it', async () => {
	const apps = await distributedApps();
	assert.ok(apps.length > 0, 'expected at least one distributed App');

	const handWritten = new Set(await handWrittenSupportSlugs());
	const contentDocs = new Set(await supportContentSlugs());

	const missing = apps.filter((slug) => !handWritten.has(slug) && !contentDocs.has(slug));
	assert.deepEqual(
		missing,
		[],
		`Distributed App without a support page behind it (needs a hand-written page at src/pages/apps/<slug>/support.astro or a support document at src/content/app-pages/<slug>.support.md):\n${missing.join('\n')}`,
	);
});

test('every hand-written support page belongs to a distributed App', async () => {
	const handWritten = await handWrittenSupportSlugs();
	assert.ok(handWritten.length > 0, 'expected at least one hand-written support page');

	const apps = new Set(await distributedApps());

	const orphans = handWritten.filter((slug) => !apps.has(slug));
	assert.deepEqual(
		orphans,
		[],
		`Hand-written support page for a slug that is not a distributed App (so it is unreachable):\n${orphans.join('\n')}`,
	);
});

test('every support content document belongs to a distributed App', async () => {
	const docs = await supportContentSlugs();
	assert.ok(docs.length > 0, 'expected at least one support content document');

	const apps = new Set(await distributedApps());

	const orphans = docs.filter((slug) => !apps.has(slug));
	assert.deepEqual(
		orphans,
		[],
		`Support content document for a slug that is not a distributed App (so it never renders):\n${orphans.join('\n')}`,
	);
});

test('the retired support field is gone from every project entry', async () => {
	// The schema no longer knows this field, and Astro's zod schemas strip
	// unknown keys silently — so only a guard catches a leftover in the copy.
	const leftovers: string[] = [];

	for (const file of await readdir(PROJECTS_DIR)) {
		if (!/\.mdx?$/.test(file)) continue;
		const [, frontmatter = ''] = (await readFile(join(PROJECTS_DIR, file), 'utf8')).split(/^---$/m, 2);
		if (frontmatterValue(frontmatter, 'hasSupportPage') !== '') leftovers.push(`${file}: hasSupportPage`);
	}

	assert.deepEqual(
		leftovers,
		[],
		`Retired support field still set — the distributed marker replaced hasSupportPage, and file presence is the escape hatch for hand-written pages:\n${leftovers.join('\n')}`,
	);
});
