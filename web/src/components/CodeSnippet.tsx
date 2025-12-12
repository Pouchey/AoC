import { useEffect, useState } from 'react';
import { getHighlighter, type Highlighter } from 'shiki';

interface CodeSnippetProps {
  code: string | null;
  language?: string;
}

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighterInstance(): Promise<Highlighter> {
  if (highlighterPromise === null) {
    highlighterPromise = getHighlighter({
      themes: ['github-dark'],
      langs: ['typescript']
    });
  }
  return highlighterPromise;
}

export function CodeSnippet({ code, language = 'typescript' }: CodeSnippetProps) {
  const [highlightedCode, setHighlightedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!code) {
      setHighlightedCode(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getHighlighterInstance()
      .then((highlighter) => {
        const html = highlighter.codeToHtml(code, {
          lang: language,
          theme: 'github-dark'
        });
        setHighlightedCode(html);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to highlight code:', error);
        setHighlightedCode(null);
        setIsLoading(false);
      });
  }, [code, language]);

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
