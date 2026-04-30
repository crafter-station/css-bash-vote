#!/bin/bash
set -e
cd "$(dirname "$0")/.."

# Load OPENAI key
if [ -f "$HOME/.config/last30days/.env" ]; then
  export $(grep -v '^#' "$HOME/.config/last30days/.env" | xargs)
fi

ROUNDS=(
  "03-forms-inputs"
  "04-color-theming"
  "05-typography-text"
  "06-responsive-container"
)

for slug in "${ROUNDS[@]}"; do
  echo ""
  echo "============================================"
  echo "Starting round: $slug"
  echo "============================================"
  bun scripts/run-round.ts "$slug"
  echo "Done: $slug"
done

echo ""
echo "All rounds complete."
