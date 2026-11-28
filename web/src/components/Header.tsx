import type { ProblemsData } from '../data/problems';

interface HeaderProps {
  data: ProblemsData;
  year: number;
  day: number | null;
}

const REPO = 'https://github.com/Pouchey/AoC';

export function Header({ data, year, day }: HeaderProps) {
  const stars = Object.values(data.problems).reduce(
    (n, p) => n + (p.firstPartCompleted ? 1 : 0) + (p.secondPartCompleted ? 1 : 0),
    0
  );
  const source = day
    ? `${REPO}/tree/main/${year}/${String(day).padStart(2, '0')}`
    : `${REPO}/tree/main/${year}`;

  return (
    <header className="relative flex items-center justify-between gap-4 py-6">
      <a
        href="./"
        className="flex items-baseline gap-2 font-medium tracking-tight text-text-primary whitespace-nowrap"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 self-center fill-accent-gold drop-shadow-[0_0_6px_#ffd166aa]"
          aria-hidden="true"
        >
          <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z" />
        </svg>
        Advent of Code
        <span className="hidden sm:inline text-text-secondary font-normal">
          solutions by Pouchey
        </span>
      </a>
      <nav className="flex items-center gap-5 text-sm whitespace-nowrap">
        <span className="text-accent-gold" title="Stars earned across all years">
          {stars} stars
        </span>
        <a
          href={source}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-secondary hover:text-accent-blue transition-colors"
        >
          <span className="hidden sm:inline">Source on </span>GitHub
        </a>
      </nav>
      <div className="neon-hairline absolute inset-x-0 bottom-0" aria-hidden="true" />
    </header>
  );
}
