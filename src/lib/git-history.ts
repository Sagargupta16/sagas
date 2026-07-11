import { execFileSync } from 'node:child_process';

export interface WritingHistory {
  firstDrafted: Date | null;
  lastRevised: Date | null;
  revisions: number; // number of commits that touched the file
}

const EMPTY: WritingHistory = {
  firstDrafted: null,
  lastRevised: null,
  revisions: 0,
};

// Astro runs dev and build from the project root, so cwd is the repo root.
// (Deriving from import.meta.url breaks once this module is bundled.)
const repoRoot = process.cwd();

/**
 * Build-time only: read the git commit history for one content file so the
 * site can show how a chapter was written in the open. Returns EMPTY when git
 * data is unavailable (shallow clone, untracked file, git missing) so the
 * build never fails on it.
 */
export function writingHistory(relPath: string): WritingHistory {
  try {
    const out = execFileSync(
      'git',
      ['log', '--follow', '--format=%cI', '--', relPath],
      { cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    )
      .trim()
      .split('\n')
      .filter(Boolean);

    if (out.length === 0) return EMPTY;

    // git log is newest-first
    const lastRevised = new Date(out[0]);
    const firstDrafted = new Date(out[out.length - 1]);
    return { firstDrafted, lastRevised, revisions: out.length };
  } catch {
    return EMPTY;
  }
}
