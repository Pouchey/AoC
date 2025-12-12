import { useState, useEffect, startTransition } from 'react';
import { fetchSolutionCode, extractFunction } from '../../utils/codeFetcher';

export function useSolutionCode(year: number, day: number) {
  const [code1, setCode1] = useState<string | null>(null);
  const [code2, setCode2] = useState<string | null>(null);
  const [loadDataCode, setLoadDataCode] = useState<string | null>(null);
  const [isLoadingCode, setIsLoadingCode] = useState(true);

  useEffect(() => {
    let cancelled = false;

    startTransition(() => {
      setIsLoadingCode(true);
    });

    fetchSolutionCode(year, day)
      .then((fullCode) => {
        if (cancelled) return;

        if (fullCode) {
          const solve1Code = extractFunction(fullCode, 'solve1');
          const solve2Code = extractFunction(fullCode, 'solve2');
          const loadData = extractFunction(fullCode, 'loadData');
          setCode1(solve1Code);
          setCode2(solve2Code);
          setLoadDataCode(loadData);
        } else {
          setCode1(null);
          setCode2(null);
          setLoadDataCode(null);
        }
        setIsLoadingCode(false);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('Failed to fetch code:', error);
        setCode1(null);
        setCode2(null);
        setLoadDataCode(null);
        setIsLoadingCode(false);
      });

    return () => {
      cancelled = true;
    };
  }, [year, day]);

  return { code1, code2, loadDataCode, isLoadingCode };
}
