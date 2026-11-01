import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { projectRedirects } from '../../scripts/gen-redirects.mjs';

test('app entries emit both slash forms pointing at /apps/<slug> with a 301', () => {
	const redirects = projectRedirects([{ slug: 'echochess', category: 'app' }]);

	// Expected values are literals from the spec, not recomputed from the code
	// under test, so a wrong origin or path shape fails here.
	assert.deepEqual(redirects, [
		{ source: '/projects/echochess', destination: 'https://www.benihkode.web.id/apps/echochess/', statusCode: 301 },
		{ source: '/projects/echochess/', destination: 'https://www.benihkode.web.id/apps/echochess/', statusCode: 301 },
	]);
});

test('tool entries keep their existing pairs pointing at /tools/<slug>', () => {
	const redirects = projectRedirects([{ slug: 'gitprgen', category: 'tool' }]);

	assert.deepEqual(redirects, [
		{ source: '/projects/gitprgen', destination: 'https://www.benihkode.web.id/tools/gitprgen/', permanent: true },
		{ source: '/projects/gitprgen/', destination: 'https://www.benihkode.web.id/tools/gitprgen/', permanent: true },
	]);
});

test('entries with a category outside tool/app emit no redirect', () => {
	assert.deepEqual(projectRedirects([{ slug: 'mystery', category: 'widget' }]), []);
	assert.deepEqual(projectRedirects([{ slug: 'mystery', category: '' }]), []);
});

/**
 * Reads the real project entries instead of fixtures: the guard has to fail on
 * the content that ships, not on a mock that agrees with the implementation.
 */
async function contentCategories(): Promise<Map<string, string>> {
	const categories = new Map<string, string>();

	for (const file of await readdir('src/content/projects')) {
		if (!/\.mdx?$/.test(file)) continue;
		const [, frontmatter = ''] = (await readFile(join('src/content/projects', file), 'utf8')).split(/^---$/m, 2);
		const match = frontmatter.match(/^category:\s*(.+)$/m);
		categories.set(file.replace(/\.mdx?$/, ''), match?.[1].trim().replace(/^["']|["']$/g, '') ?? '');
	}

	return categories;
}

test('vercel.json forwards every shipped app and tool landing derived from frontmatter', async () => {
	const categories = await contentCategories();
	assert.ok(categories.size > 0, 'expected the real project entries to be read');

	const vercel = JSON.parse(await readFile('vercel.json', 'utf8'));
	const emitted = new Map<string, { destination: string }>(
		vercel.redirects.map((redirect: { source: string; destination: string }) => [redirect.source, redirect]),
	);

	const stale: string[] = [];
	for (const [slug, category] of categories) {
		for (const expected of projectRedirects([{ slug, category }])) {
			const actual = emitted.get(expected.source);
			if (!actual || actual.destination !== expected.destination) {
				stale.push(`${expected.source} -> ${expected.destination} (missing or stale; run pnpm build)`);
			}
		}
	}

	assert.deepEqual(
		stale,
		[],
		`vercel.json is missing or has stale redirect pairs:\n${stale.join('\n')}`,
	);
});
