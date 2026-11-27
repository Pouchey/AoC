// Example files are committed; inputs are git-ignored, so they only exist on a local checkout.
// Lazy globs: each file becomes its own chunk, loaded only when a visualization needs it.
const examples = import.meta.glob<string>('/../20[0-9][0-9]/[0-3][0-9]/data/example', {
  query: '?raw',
  import: 'default'
});
const examples2 = import.meta.glob<string>('/../20[0-9][0-9]/[0-3][0-9]/data/example2', {
  query: '?raw',
  import: 'default'
});
const inputs = import.meta.glob<string>('/../20[0-9][0-9]/[0-3][0-9]/data/inpu[t]', {
  query: '?raw',
  import: 'default'
});

export type DataSource = 'example' | 'input';

const path = (year: number, day: number, file: string) =>
  `../${year}/${String(day).padStart(2, '0')}/data/${file}`;

export const hasInput = (year: number, day: number) => path(year, day, 'input') in inputs;

export async function loadData(year: number, day: number, part: 1 | 2, source: DataSource) {
  if (source === 'input') {
    const load = inputs[path(year, day, 'input')];
    if (load) return load();
  }
  const load2 = part === 2 ? examples2[path(year, day, 'example2')] : undefined;
  const load = load2 ?? examples[path(year, day, 'example')];
  if (!load) throw new Error('No example for this day');
  return load();
}
