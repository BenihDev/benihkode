import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

/**
 * Lists the markdown files the docs-contract guard scans, as repo-relative
 * paths. Discovery is git-tracked files only: agent runs leave untracked,
 * self-ignored trees (like .zwork transcripts) and scratch files next to the
 * real docs, and a directory walk sweeps those in — failing the guard on
 * files git never sees and CI never checks out. `git ls-files` is exactly
 * that checkout set, so the guard fails identically locally and in CI.
 * @param cwd The repository root to list from (defaults to the process cwd).
 * @returns Sorted repo-relative paths of tracked *.md / *.mdx files.
 */
export async function markdownFiles(cwd: string = process.cwd()): Promise<string[]> {
	// Git pathspec globs match across directory separators, so one pattern
	// covers the repo root, .agents/, and every nested docs directory.
	const { stdout } = await execFileAsync('git', ['ls-files', '*.md', '*.mdx'], { cwd });
	return stdout.split('\n').filter(Boolean).sort();
}
