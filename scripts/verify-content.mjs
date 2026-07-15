/**
 * Cross-file content invariants the zod schema cannot see.
 * Run with `pnpm verify:content`; CI runs it on every PR.
 *
 * Checks:
 *  1. every chapter belongs to a book folder that has a book.md
 *  2. chapter `order` values are unique within a book
 *  3. the NN- filename prefix matches the `order` frontmatter
 *  4. `final` chapters without `publishedOn` are flagged (invisible to RSS)
 *  5. `publishedOn` is never in the future (no speculative publishing)
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const BOOKS_DIR = join(process.cwd(), 'src', 'content', 'books');

/** Minimal frontmatter reader -- enough for order/status/publishedOn. */
function frontmatter(file) {
  const text = readFileSync(file, 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].trim();
  }
  return data;
}

const errors = [];
const warnings = [];

if (!existsSync(BOOKS_DIR)) {
  console.log('verify:content -- no books directory yet, nothing to check.');
  process.exit(0);
}

const bookDirs = readdirSync(BOOKS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

for (const dir of bookDirs) {
  const bookFile = join(BOOKS_DIR, dir, 'book.md');
  const chaptersDir = join(BOOKS_DIR, dir, 'chapters');
  const hasBook = existsSync(bookFile);
  if (!hasBook) {
    errors.push(`${dir}: missing book.md (chapters would 404 at build)`);
  }

  if (!existsSync(chaptersDir)) continue;
  const chapterFiles = readdirSync(chaptersDir).filter(
    (f) => f.endsWith('.md') && !f.startsWith('_'),
  );

  const seenOrders = new Map();
  for (const file of chapterFiles) {
    const fm = frontmatter(join(chaptersDir, file));
    const order = Number(fm.order);

    if (!Number.isInteger(order) || order < 1) {
      errors.push(`${dir}/chapters/${file}: order must be a positive integer`);
      continue;
    }

    const prefix = file.match(/^(\d+)-/)?.[1];
    if (prefix && Number(prefix) !== order) {
      errors.push(
        `${dir}/chapters/${file}: filename prefix ${prefix} does not match order ${order}`,
      );
    }

    if (seenOrders.has(order)) {
      errors.push(
        `${dir}/chapters/${file}: duplicate order ${order} (also in ${seenOrders.get(order)})`,
      );
    }
    seenOrders.set(order, file);

    if (fm.publishedOn) {
      const published = new Date(fm.publishedOn);
      if (Number.isNaN(published.valueOf())) {
        errors.push(`${dir}/chapters/${file}: publishedOn is not a date`);
      } else if (published.valueOf() > Date.now()) {
        errors.push(
          `${dir}/chapters/${file}: publishedOn is in the future (no speculative publishing)`,
        );
      }
    } else if (fm.status === 'final') {
      warnings.push(
        `${dir}/chapters/${file}: final but missing publishedOn (invisible to RSS)`,
      );
    }
  }
}

for (const warning of warnings) console.warn(`warn: ${warning}`);
for (const error of errors) console.error(`error: ${error}`);

if (errors.length > 0) {
  console.error(`\nverify:content failed with ${errors.length} error(s).`);
  process.exit(1);
}
console.log(
  `verify:content passed -- ${bookDirs.length} book(s), ${warnings.length} warning(s).`,
);
