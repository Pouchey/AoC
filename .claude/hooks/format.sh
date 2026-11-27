#!/usr/bin/env bash
# PostToolUse hook: format the file Claude just edited with Prettier.
# Never blocks: formatting problems are left to `npm run lint`.
file=$(node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{process.stdout.write(JSON.parse(s).tool_input?.file_path??"")}catch{}})')

case "$file" in
  *.ts | *.tsx | *.js | *.mjs | *.json | *.md | *.css | *.yml | *.yaml) ;;
  *) exit 0 ;;
esac
case "$file" in
  */node_modules/* | */dist/* | */data/*) exit 0 ;;
esac
[ -f "$file" ] || exit 0

cd "${CLAUDE_PROJECT_DIR:-.}" && npx --no-install prettier --write --log-level warn "$file" >/dev/null 2>&1
exit 0
