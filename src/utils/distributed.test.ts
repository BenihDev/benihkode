import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const PROJECTS_DIR = 'src/content/projects';

/**
 * The nine Apps that ship a privacy policy today — the store-distributed set
 * per spec #79. Listed explicitly so this guard fails on the content that
 * ships, not on a value recomputed from the flags it is supposed to track.
 */
const DISTRIBUTED_APPS = [
	'colorpalette-pro',
	'echochess',
	'gas-flow-calculator',
	'habittracker',
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
				distributed: frontmatterValue(frontmatter, 'distributed') === 'true',
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
