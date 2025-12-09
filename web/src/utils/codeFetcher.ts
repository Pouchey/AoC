/**
 * Fetches code from GitHub raw URL and extracts the solve1 or solve2 function
 */

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/Pouchey/AoC/main';

export async function fetchSolutionCode(year: number, day: number): Promise<string | null> {
  const dayPadded = day.toString().padStart(2, '0');
  const url = `${GITHUB_RAW_BASE}/${year}/${dayPadded}/index.ts`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    return await response.text();
  } catch (error) {
    console.error(`Failed to fetch code from ${url}:`, error);
    return null;
  }
}

/**
 * Extracts a function from TypeScript code using regex
 * This is a simple approach - for more robust parsing, consider using a TypeScript parser
 */
export function extractFunction(code: string, functionName: 'solve1' | 'solve2'): string | null {
  if (!code) return null;

  // Find the function declaration start
  // Pattern to match: export const solve1/solve2 = (input: string) => { ... }
  // or: export function solve1/solve2(...) { ... }
  const functionStartPattern = new RegExp(
    `export\\s+(?:const\\s+${functionName}\\s*=\\s*\\([^)]*\\)\\s*=>|function\\s+${functionName}\\s*\\([^)]*\\))\\s*\\{`,
    'm'
  );

  const startMatch = code.match(functionStartPattern);
  if (startMatch && startMatch.index !== undefined) {
    const startIndex = startMatch.index;
    let braceCount = 0;
    let inFunction = false;
    let endIndex = startIndex;

    // Find the opening brace
    for (let i = startIndex; i < code.length; i++) {
      if (code[i] === '{') {
        braceCount = 1;
        inFunction = true;
        endIndex = i + 1;
        break;
      }
    }

    // Find the matching closing brace
    if (inFunction) {
      for (let i = endIndex; i < code.length; i++) {
        if (code[i] === '{') {
          braceCount++;
        } else if (code[i] === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIndex = i + 1;
            return code.substring(startIndex, endIndex);
          }
        }
      }
    }
  }

  return null;
}
