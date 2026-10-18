/**
 * Run a project binary with the demo book switched on.
 *
 *   node scripts/with-fixtures.mjs astro build
 *   node scripts/with-fixtures.mjs playwright test
 *
 * Sets SAGAS_FIXTURES=1, which makes `src/content.config.ts` load
 * `tests/fixtures/books/` next to the real library, and makes the reader
 * tests target the demo chapters. A plain env-var prefix would not work in
 * the Windows shell pnpm uses for scripts, so this wrapper does it in Node.
 */
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('usage: node scripts/with-fixtures.mjs <bin> [args...]');
  process.exit(2);
}

// Quote every argument so a value with spaces (`-g "arrow keys move"`)
// reaches the binary as one argument. Double quotes work in both cmd and sh.
const quoted = args.map((arg) => `"${arg.replaceAll('"', '\\"')}"`);
const result = spawnSync(`pnpm exec ${quoted.join(' ')}`, {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, SAGAS_FIXTURES: '1' },
});
process.exit(result.status ?? 1);
