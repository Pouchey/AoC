# Advent of Code Solution Rules

Based on the patterns established in the `2023/` folder, follow these rules when creating solutions for Advent of Code problems.

## Folder Structure

Each day's solution should follow this structure:

```
YYYY/DD/
├── index.ts          # Main solution file (REQUIRED)
├── data/
│   ├── example       # Example input from problem (REQUIRED)
│   └── input         # Actual puzzle input (REQUIRED)
└── Subject.md        # Problem description (OPTIONAL)
```

**Example**: `2025/01/index.ts`, `2025/01/data/example`, `2025/01/data/input`

## index.ts File Requirements

Every `index.ts` file **MUST** export the following:

### Required Exports

1. **`solve1(input: string): number`**
   - Solves Part 1 of the problem
   - Takes the input file content as a string
   - Returns the solution as a number

2. **`solve2(input: string): number`**
   - Solves Part 2 of the problem
   - Takes the input file content as a string
   - Returns the solution as a number

3. **`exampleAnswer1: number`**
   - The expected answer for Part 1 using the example input
   - Used for validation by the test runner

4. **`exampleAnswer2: number`**
   - The expected answer for Part 2 using the example input
   - Used for validation by the test runner

5. **`firstPartCompleted: boolean`**
   - Set to `true` when Part 1 is complete and you're working on Part 2
   - Set to `false` when working on Part 1
   - Controls which part the runner executes

### Code Structure Pattern

Follow this structure in your `index.ts`:

```typescript
import { /* utilities */ } from '../../utils';

// Data loading function
const loadData = (input: string) => {
  // Parse and transform input
  return data;
};

// Part 1 calculation logic
const calculate1 = (data: /* type */) => {
  // Implementation
  return result;
};

// Part 2 calculation logic
const calculate2 = (data: /* type */) => {
  // Implementation
  return result;
};

// Part 1 solution
export const solve1 = (input: string) => {
  const data = loadData(input);
  return calculate1(data);
};

// Part 2 solution
export const solve2 = (input: string) => {
  const data = loadData(input);
  return calculate2(data);
};

// Expected answers for example input
export const exampleAnswer1 = 0; // Replace with actual answer
export const exampleAnswer2 = 0; // Replace with actual answer

// Progress tracking
export const firstPartCompleted = false; // Set to true when Part 1 is done
```

## Best Practices

### 1. Use Utility Functions

Import and use utilities from `../../utils`:

```typescript
import { parseLines, TGrid, assertEqual } from '../../utils';
```

Common utilities available:
- `parseLines(input)` - Split input into lines
- `TGrid<T>` - Type for 2D grids
- Grid manipulation utilities
- Array utilities
- Math utilities
- Movement utilities (for grid navigation)
- Parser utilities
- Range utilities

### 2. Separate Concerns

- **`loadData`**: Parse and transform input into a usable format
- **`calculate1` / `calculate2`**: Core logic for each part
- **`solve1` / `solve2`**: Entry points that call loadData and calculate functions

### 3. Type Safety

Use TypeScript types for better code quality:

```typescript
type Game = {
  id: number;
  sets: Cubes[];
};

const loadData = (input: string): Game[] => {
  // ...
};
```

### 4. Template Usage

When creating a new day, use `2023/00/` as a template:

```typescript
import { parseLines } from '../../utils';

const loadData = (input: string) => {
  const data = parseLines(input);
  return data;
};

export const solve1 = (input: string) => {
  const data = loadData(input);
  const result = 0;
  return result;
};

export const solve2 = (input: string) => {
  const data = loadData(input);
  const result = 0;
  return result;
};

export const exampleAnswer1 = 0;
export const exampleAnswer2 = 0;

export const firstPartCompleted = false;
```

## Running Solutions

Use the main runner:

```bash
node main.ts [day] [year]
```

- If `day` is omitted, uses current day
- If `year` is omitted, uses current year
- Example: `node main.ts 01 2025`

The runner will:
1. Create the folder structure if it doesn't exist
2. Fetch example and input data if missing
3. Run the solution on the example input and validate against `exampleAnswer1`/`exampleAnswer2`
4. Run the solution on the actual input
5. Optionally submit the answer to Advent of Code

## Progress Tracking

- Set `firstPartCompleted = false` when starting Part 1
- Set `firstPartCompleted = true` when Part 1 is complete and working on Part 2
- The runner uses this flag to determine which part to execute

## Example Files

See `2023/01/index.ts` and `2023/02/index.ts` for complete examples following these patterns.
