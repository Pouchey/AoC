/**
 * Advent of Code puzzles unlock at midnight EST (UTC-5), whatever the local timezone.
 */
export const getAocNow = () => {
  const est = new Date(Date.now() - 5 * 60 * 60 * 1000);
  return { year: est.getUTCFullYear(), month: est.getUTCMonth() + 1, day: est.getUTCDate() };
};

/** Since 2025, Advent of Code has 12 days instead of 25. */
export const getDaysInEvent = (year: number) => (year >= 2025 ? 12 : 25);

/**
 * Resolves the [day] [year] CLI arguments, defaulting to today's puzzle during December.
 * Throws a readable error when the day can't be inferred or is out of range.
 */
export const resolveDayYear = (dayArg?: string, yearArg?: string) => {
  const now = getAocNow();
  const year = yearArg ? parseInt(yearArg, 10) : now.year;

  let dayNum: number;
  if (dayArg) {
    dayNum = parseInt(dayArg, 10);
  } else if (now.month === 12 && year === now.year) {
    dayNum = now.day;
  } else {
    throw new Error('No day given and we are not in December: pass it explicitly, e.g. `1 2026`.');
  }

  const maxDay = getDaysInEvent(year);
  if (Number.isNaN(year) || Number.isNaN(dayNum) || dayNum < 1 || dayNum > maxDay) {
    throw new Error(
      `Invalid day/year "${dayArg ?? dayNum} ${yearArg ?? year}" (days 1-${maxDay}).`
    );
  }

  return { day: dayNum.toString().padStart(2, '0'), year: year.toString() };
};
