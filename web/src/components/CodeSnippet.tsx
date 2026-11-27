import { useEffect, useState } from 'react';
import { createHighlighter, type Highlighter } from 'shiki';

interface CodeSnippetProps {
  code: string | null;
  language?: string;
}

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighterInstance(): Promise<Highlighter> {
  highlighterPromise ??= createHighlighter({
    themes: ['github-dark'],
    langs: ['typescript']
  });
  return highlighterPromise;
}

export function CodeSnippet({ code, language = 'typescript' }: CodeSnippetProps) {
  // Result is keyed by its inputs so loading state is derived instead of set in the effect
  const [result, setResult] = useState<{
    code: string;
    language: string;
    html: string | null;
  } | null>(null);

  useEffect(() => {
    if (!code) return;

    let cancelled = false;
    getHighlighterInstance()
      .then((highlighter) => {
        const html = highlighter.codeToHtml(code, {
          lang: language,
          theme: 'github-dark'
        });
        if (!cancelled) setResult({ code, language, html });
      })
      .catch((error) => {
        console.error('Failed to highlight code:', error);
        if (!cancelled) setResult({ code, language, html: null });
      });

    return () => {
      cancelled = true;
    };
  }, [code, language]);

  const isUpToDate = result?.code === code && result?.language === language;
  const isLoading = !!code && !isUpToDate;
  const highlightedCode = code && isUpToDate ? result.html : null;

  if (isLoading) {
    return (
      <div className="bg-bg-dark rounded-lg p-4 border border-grid-line">
        <p className="text-text-secondary text-sm">Loading code...</p>
      </div>
    );
  }

  if (!highlightedCode) {
    return (
      <div className="bg-bg-dark rounded-lg p-4 border border-grid-line">
        <p className="text-text-secondary text-sm italic">Code not available</p>
      </div>
    );
  }

  return (
    <div className="bg-bg-dark rounded-lg border border-grid-line overflow-hidden w-full max-w-full">
      <div
        className="overflow-x-auto p-4 text-sm [&_pre]:bg-transparent [&_pre]:m-0 [&_pre]:p-0 [&_pre]:font-mono [&_pre]:text-text-primary [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_pre]:whitespace-pre"
        style={{ maxWidth: '100%', width: '100%' }}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
      <style>{`
        .shiki {
          background: transparent !important;
          color: var(--color-text-primary) !important;
          overflow-x: auto !important;
          max-width: 100% !important;
          width: 100% !important;
          display: block !important;
        }
        .shiki pre {
          overflow-x: auto !important;
          max-width: 100% !important;
          width: 100% !important;
        }
        .shiki span {
          color: inherit;
        }
        /* Override Shiki colors to better match theme */
        .shiki .line {
          color: var(--color-text-primary);
        }
      `}</style>
    </div>
  );
}
