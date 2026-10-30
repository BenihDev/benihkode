import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const PROJECTS_DIR = 'src/content/projects';
const PAGES_DIR = 'src/pages';

interface ProjectEntry {
	id: string;
	data: { hasSupportPage?: boolean };
}

function frontmatterValue(frontmatter: string, key: string) {
	const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
	return match?.[1].trim().replace(/^["']|["']$/g, '') || undefined;
}

/**
 * Reads the real project entries instead of fixtures: the guard has to fail on
 * the content that ships, not on a mock that agrees with the implementation.
 */
async function projectEntries(): Promise<ProjectEntry[]> {
	const entries: ProjectEntry[] = [];

	for (const file of await readdir(PROJECTS_DIR)) {
		if (!/\.mdx?$/.test(file)) continue;
		const [, frontmatter = ''] = (await readFile(join(PROJECTS_DIR, file), 'utf8')).split(/^---$/m, 2);

		entries.push({
			id: file.replace(/\.mdx?$/, ''),
			data: {
				hasSupportPage: frontmatterValue(frontmatter, 'hasSupportPage') === 'true',
			},
		});
	}

	return entries;
}

test('every hasSupportPage entry has a support page behind it', async () => {
	const entries = (await projectEntries()).filter((entry) => entry.data.hasSupportPage);
	assert.ok(entries.length > 0, 'expected at least one project to set hasSupportPage');

	// Support pages are hand-written only: there is no generated route, so a
	// flag with no page ships a 404 link from the project card.
	const missing: string[] = [];
	for (const entry of entries) {
		const page = join(PAGES_DIR, 'projects', entry.id, 'support.astro');
		try {
			await access(page);
		} catch {
			missing.push(`${entry.id} -> ${page}`);
		}
	}

	assert.deepEqual(
		missing,
		[],
		`hasSupportPage is set but the page does not exist:\n${missing.join('\n')}`,
	);
});

/**
 * Hand-written support pages, as project slugs. Any page here without a
 * matching `hasSupportPage: true` entry is unreachable from the site.
 */
async function bespokeSupportPages(): Promise<string[]> {
	const pages = await readdir(PAGES_DIR, { recursive: true });
	return pages
		.map((page) => page.replace(/\\/g, '/'))
		.filter((page) => page.endsWith('/support.astro') && !page.includes('['))
		.map((page) => page.replace(/\.astro$/, ''));
}

test('every bespoke support page is referenced by a hasSupportPage entry', async () => {
	const bespoke = await bespokeSupportPages();
	assert.ok(bespoke.length > 0, 'expected at least one bespoke support page');

	const referenced = new Set(
		(await projectEntries())
			.filter((entry) => entry.data.hasSupportPage)
			.map((entry) => `projects/${entry.id}/support`),
	);

	const orphans = bespoke.filter((page) => !referenced.has(page));
	assert.deepEqual(
		orphans,
		[],
		`Bespoke support page no project entry points at (so it would be unreachable):\n${orphans.join('\n')}`,
	);
});
