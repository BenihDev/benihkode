import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { projectRedirects } from '../../scripts/gen-redirects.mjs';

test('distributed app entries emit landing and privacy pairs in both slash forms with a 301', () => {
	const redirects = projectRedirects([{ slug: 'echochess', category: 'app', distributed: true }]);

	// Expected values are literals from the spec, not recomputed from the code
	// under test, so a wrong origin or path shape fails here.
	assert.deepEqual(redirects, [
		{ source: '/projects/echochess', destination: 'https://www.benihkode.web.id/apps/echochess/', statusCode: 301 },
		{ source: '/projects/echochess/', destination: 'https://www.benihkode.web.id/apps/echochess/', statusCode: 301 },
		{
			source: '/projects/echochess/privacy-policy',
			destination: 'https://www.benihkode.web.id/apps/echochess/privacy/',
			statusCode: 301,
		},
		{
			source: '/projects/echochess/privacy-policy/',
			destination: 'https://www.benihkode.web.id/apps/echochess/privacy/',
			statusCode: 301,
		},
	]);
});

test('apps without the distributed marker emit only landing pairs', () => {
	const redirects = projectRedirects([{ slug: 'chatmini', category: 'app', distributed: false }]);

	assert.deepEqual(redirects, [
		{ source: '/projects/chatmini', destination: 'https://www.benihkode.web.id/apps/chatmini/', statusCode: 301 },
		{ source: '/projects/chatmini/', destination: 'https://www.benihkode.web.id/apps/chatmini/', statusCode: 301 },
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
	assert.deepEqual(projectRedirects([{ slug: 'mystery', category: 'widget', distributed: true }]), []);
	assert.deepEqual(projectRedirects([{ slug: 'mystery', category: '', distributed: false }]), []);
});

/**
 * Reads the real project entries instead of fixtures: the guard has to fail on
 * the content that ships, not on a mock that agrees with the implementation.
 */
async function contentEntries(): Promise<Map<string, { category: string; distributed: boolean }>> {
	const entries = new Map<string, { category: string; distributed: boolean }>();

	for (const file of await readdir('src/content/projects')) {
		if (!/\.mdx?$/.test(file)) continue;
		const [, frontmatter = ''] = (await readFile(join('src/content/projects', file), 'utf8')).split(/^---$/m, 2);
		const frontmatterValue = (key: string) => {
			const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
			return match?.[1].trim().replace(/^["']|["']$/g, '') ?? '';
		};
		entries.set(file.replace(/\.mdx?$/, ''), {
			category: frontmatterValue('category'),
			distributed: frontmatterValue('distributed') === 'true',
		});
	}

	return entries;
}

test('vercel.json forwards every shipped app landing, tool landing, and privacy URL derived from frontmatter', async () => {
	const entries = await contentEntries();
	assert.ok(entries.size > 0, 'expected the real project entries to be read');

	const vercel = JSON.parse(await readFile('vercel.json', 'utf8'));
	const emitted = new Map<string, { destination: string }>(
		vercel.redirects.map((redirect: { source: string; destination: string }) => [redirect.source, redirect]),
	);

	const stale: string[] = [];
	for (const [slug, entry] of entries) {
		for (const expected of projectRedirects([{ slug, ...entry }])) {
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
