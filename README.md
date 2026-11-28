# Advent of Code Solutions

Solutions for [Advent of Code](https://adventofcode.com/) yearly event, written in TypeScript.

## 🚀 Quick Start

### Prerequisites

- Node.js (v24 recommended, same as CI)
- npm

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory with your Advent of Code session cookie:

```env
AOC_SESSION_COOKIE=your_session_cookie_here
# Optional: identifies the tool to AoC (recommended: add a way to contact you)
AOC_USER_AGENT=github.com/<you>/<repo> by <contact>
# Optional: only for npm run get-leaderboard
AOC_LEADERBOARD_ID=123456
```

To get your session cookie:

1. Log in to [adventofcode.com](https://adventofcode.com/)
2. Open browser developer tools (F12)
3. Go to Application/Storage → Cookies
4. Copy the value of the `session` cookie

## 📖 Usage

### Running a Solution

Run a solution for a specific day and year:

```bash
npm start [day] [year]
```

**Examples:**

```bash
npm start           # Runs today's puzzle (December only, AoC time = UTC-5)
npm start 1 2025    # Runs day 1 of 2025
npm start 03 2025   # Runs day 3 of 2025
```

The runner will:

1. ✅ Create the folder structure if it doesn't exist
2. ✅ Fetch example and input data from Advent of Code (if missing)
3. ✅ Run the solution on the example input and validate the answer
4. ✅ Run the solution on the actual input
5. ✅ Optionally submit the answer to Advent of Code

### Getting Problem Descriptions

Fetch the problem description for a specific day:

```bash
npm run get-subject [day] [year]
```

**Examples:**

```bash
npm run get-subject           # Gets today's problem description
npm run get-subject 1 2025    # Gets day 1, 2025 problem description
```

This will create `Part1.md` and `Part2.md` files in the day's folder with the problem descriptions.

> ℹ️ Since 2025, Advent of Code has **12 days** per event (25 before).

> ⚠️ Puzzle inputs are **not committed** (`**/data/input` is git-ignored), as
> [requested by the AoC author](https://adventofcode.com/about#faq_copying).
> They are downloaded again automatically when missing.

### Code quality

```bash
npm test            # every solution vs its exampleAnswer (npm test -- 2025 7 for one day)
npm run test:viz    # web visualizations vs exampleAnswer (-- --input: vs solutions on local input)
npm run typecheck   # tsc on solutions + utils
npm run lint        # ESLint (flat config) + Prettier
npm run lint:fix
```

## 📁 Project Structure

```
AoC/
├── YYYY/                    # Year folder (e.g., 2023, 2025)
│   └── DD/                  # Day folder (e.g., 01, 02)
│       ├── index.ts         # Solution file (REQUIRED)
│       ├── Part1.md         # Part 1 problem description (optional)
│       ├── Part2.md         # Part 2 problem description (optional)
│       └── data/
│           ├── example       # Example input (REQUIRED)
│           └── input         # Puzzle input (REQUIRED, git-ignored)
├── utils/                   # Utility functions
│   ├── aoc.ts              # Advent of Code API helpers
│   ├── array.ts            # Array utilities
│   ├── assert.ts           # Assertion utilities
│   ├── file.ts             # File operations
│   ├── grid.ts             # Grid/2D array utilities
│   ├── logger.ts           # Logging utilities
│   ├── math.ts             # Math utilities
│   ├── memoize.ts          # Memoization helpers
│   ├── movement.ts         # Grid movement utilities
│   ├── parser.ts           # Parsing utilities
│   └── range.ts            # Range utilities
├── main.ts                 # Main runner script
├── get-subject.ts          # Script to fetch problem descriptions
└── package.json
```

## ✍️ Creating a New Solution

### 1. Run the Main Script

Simply run the main script for the day you want to solve:

```bash
npm start 1 2025
```

This will automatically:

- Create the folder structure (`2025/01/`)
- Copy a template from `template/index.ts`
- Fetch example and input data from Advent of Code

### 2. Solution File Structure

Your `index.ts` file must export the following:

```typescript
import /* utilities */ '../../utils';

// Data loading function
const loadData = (input: string) => {
  // Parse and transform input
  return data;
};

// Part 1 solution
export const solve1 = (input: string) => {
  const data = loadData(input);
  // Your solution logic
  return result;
};

// Part 2 solution
export const solve2 = (input: string) => {
  const data = loadData(input);
  // Your solution logic
  return result;
};

// Expected answers for example input
export const exampleAnswer1 = 0; // Replace with actual answer
export const exampleAnswer2 = 0; // Replace with actual answer

// Progress tracking
export const firstPartCompleted = false; // Set to true when Part 1 is done
```

### 3. Progress Tracking

- Set `firstPartCompleted = false` when working on Part 1
- Set `firstPartCompleted = true` when Part 1 is complete and working on Part 2
- The runner uses this flag to determine which part to execute

## 🛠️ Available Utilities

Import utilities from `../../utils`:

```typescript
import {
  parseLines, // Split input into lines
  parseBlocks, // Split input into blocks (double newline)
  TGrid // Type for 2D grids
  // ... and more
} from '../../utils';
```

### Common Utilities

- **Parsing**: `parseLines()`, `parseBlocks()`
- **Grids**: `TGrid<T>`, grid manipulation functions
- **Arrays**: Array manipulation utilities
- **Math**: Mathematical operations
- **Movement**: Grid navigation (up, down, left, right, diagonals)
- **Memoization**: `memoize()` for caching function results
- **Ranges**: Range utilities

See individual files in `utils/` for detailed documentation.

## 📝 Example Solution

See `2023/01/index.ts` or `2025/01/index.ts` for complete examples following the project patterns.

## 🔧 Scripts

- `npm start [day] [year]` - Run a solution
- `npm run get-subject [day] [year]` - Fetch problem description

## 📚 Additional Resources

- [Advent of Code](https://adventofcode.com/) - The official website
- [RULES.md](./RULES.md) - Detailed rules and best practices for solutions

## 📄 License

See [LICENSE](./LICENSE) file for details.

## 🤖 Claude Code

- `CLAUDE.md`: project context loaded by Claude Code (commands, layout, rules).
- `.claude/settings.json`: shared permissions, plus a hook that runs Prettier on files Claude edits.
- `.claude/skills/`: `/new-day [day] [year]`, `/hint <day> <year> [part] [nudge|approach|algorithm]`
  (theory hints, never the answer), `/verify`, `/add-visualization <day> <year>`.
- GitHub workflows:
  - `ci.yml`: typecheck, lint, example tests and web build on every PR.
  - `claude-code-review.yml`: automatic Claude review of each PR.
  - `claude.yml`: mention `@claude` in an issue or PR (repo owner only).

  The last two need the [Claude GitHub App](https://github.com/apps/claude) and a
  `CLAUDE_CODE_OAUTH_TOKEN` repository secret (`claude setup-token`). Without the secret, the
  review job is skipped.
