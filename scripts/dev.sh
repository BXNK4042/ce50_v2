#!/usr/bin/env bash

set -euo pipefail

ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
SESSION=ce50

if tmux has-session -t "$SESSION" 2>/dev/null; then
  exec tmux attach-session -t "$SESSION"
fi

tmux new-session -d -s "$SESSION" -n dev -c "$ROOT/backend" \
  "exec '$ROOT/.venv/bin/python' -m uvicorn main:app --reload --port 8000"
tmux split-window -h -t "$SESSION:dev" -c "$ROOT/frontend" "npm run dev"
tmux select-pane -t "$SESSION:dev" -L
tmux new-window -t "$SESSION" -n terminal -c "$ROOT" 'zeditor . & exec "${SHELL:-/bin/bash}"'
tmux new-window -t "$SESSION" -n opencode -c "$ROOT" "opencode --yolo"

exec tmux attach-session -t "$SESSION"
