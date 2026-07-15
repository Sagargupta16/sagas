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
 * One `git log --name-only` pass over the content tree, parsed into a
 * path -> commit-dates map. Built lazily on first use and cached for the
 * whole build, so a 200-chapter library still costs one child process
 * instead of 200.
 */
let historyMap: Map<string, string[]> | null = null;

function buildHistoryMap(): Map<string, string[]> {
  const map = new Map<string, string[]>();
  try {
    const out = execFileSync(
      'git',
      ['log', '--format=%x01%cI', '--name-only', '--', 'src/content'],
      { cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    );
    let currentDate = '';
    for (const raw of out.split('\n')) {
      const line = raw.trim();
      if (!line) continue;
      if (line.startsWith('\u0001')) {
        currentDate = line.slice(1);
        continue;
      }
      if (!currentDate) continue;
      const key = line.replaceAll('\\', '/');
      const dates = map.get(key);
      if (dates) dates.push(currentDate);
      else map.set(key, [currentDate]);
    }
  } catch {
    // git missing, shallow clone without history, or not a repo:
    // every lookup falls back to EMPTY and the build continues.
  }
  return map;
}

/**
 * Build-time only: read the git commit history for one content file so the
 * site can show how a chapter was written in the open. Returns EMPTY when git
 * data is unavailable so the build never fails on it.
 */
export function writingHistory(relPath: string): WritingHistory {
  historyMap ??= buildHistoryMap();
  const key = relPath.replaceAll('\\', '/');
  const dates = historyMap.get(key);
  if (!dates || dates.length === 0) return EMPTY;

  // git log is newest-first
  return {
    lastRevised: new Date(dates[0]),
    firstDrafted: new Date(dates[dates.length - 1]),
    revisions: dates.length,
  };
}
