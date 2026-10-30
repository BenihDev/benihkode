import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getPrivacyPolicyStaticPaths } from './projects.ts';

const PROJECTS_DIR = 'src/content/projects';
const PAGES_DIR = 'src/pages';

interface ProjectEntry {
	id: string;
	data: { hasPrivacyPolicy?: boolean; privacyPolicyUrl?: string };
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
		const privacyPolicyUrl = frontmatterValue(frontmatter, 'privacyPolicyUrl');

		entries.push({
			id: file.replace(/\.mdx?$/, ''),
			data: {
				hasPrivacyPolicy: frontmatterValue(frontmatter, 'hasPrivacyPolicy') === 'true',
				...(privacyPolicyUrl ? { privacyPolicyUrl } : {}),
			},
		});
	}

	return entries;
}

test('a project that sets privacyPolicyUrl does not also get a generated privacy route', async () => {
	const entries = await projectEntries();
	const generated = new Set(getPrivacyPolicyStaticPaths(entries).map((path) => path.params.slug));

	const shadowed = entries
		.filter((entry) => entry.data.privacyPolicyUrl && generated.has(entry.id))
		.map((entry) => entry.id);
	assert.deepEqual(
		shadowed,
		[],
		`Generated privacy route collides with a bespoke page: ${shadowed.join(', ')}`,
	);

	// The mirror case: a policy link with no page behind it would 404. Every
	// hasPrivacyPolicy entry needs either the generated route or its own page.
	const unlinked = entries
		.filter((entry) => entry.data.hasPrivacyPolicy && !entry.data.privacyPolicyUrl && !generated.has(entry.id))
		.map((entry) => entry.id);
	assert.deepEqual(
		unlinked,
		[],
		`Privacy Policy link has no page behind it: ${unlinked.join(', ')}`,
	);
});

test('every privacyPolicyUrl points at a page that exists', async () => {
	const entries = (await projectEntries()).filter((entry) => entry.data.privacyPolicyUrl);
	assert.ok(entries.length > 0, 'expected at least one project to set privacyPolicyUrl');

	const missing: string[] = [];
	for (const entry of entries) {
		const page = join(PAGES_DIR, `${entry.data.privacyPolicyUrl}.astro`);
		try {
			await access(page);
		} catch {
			missing.push(`${entry.id} -> ${entry.data.privacyPolicyUrl} (${page})`);
		}
	}

	assert.deepEqual(
		missing,
		[],
		`privacyPolicyUrl points at a page that does not exist:\n${missing.join('\n')}`,
	);
});
