import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
// One frontmatter parser for raw frontmatter reads: the generator's, shared
// here so a guard can never disagree with what the prebuild derived.
import { frontmatterBoolean } from '../../scripts/gen-redirects.mjs';

const PROJECTS_DIR = 'src/content/projects';

/**
 * The ten Apps that ship a privacy policy today — the store-distributed set.
 * Listed explicitly so this guard fails on the content that ships, not on a
 * value recomputed from the flags it is supposed to track.
 */
const DISTRIBUTED_APPS = [
	'colorpalette-pro',
	'echochess',
	'gas-flow-calculator',
	'habittracker',
	'onething',
	'pocketbudget',
	'smartstartup',
	'solstice-cipher',
	'tutupen',
	'weathernow',
];

interface ProjectEntry {
	id: string;
	data: { distributed?: boolean };
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
				distributed: frontmatterBoolean(frontmatter, 'distributed'),
			},
		});
	}

	return entries;
}

test('the distributed marker is set on exactly the nine store-distributed Apps', async () => {
	const entries = await projectEntries();
	const distributed = entries.filter((entry) => entry.data.distributed).map((entry) => entry.id);

	assert.deepEqual(distributed.sort(), [...DISTRIBUTED_APPS].sort());
});
