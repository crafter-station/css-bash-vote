#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"

export DATABASE_URL="postgresql://neondb_owner:npg_ygTsDo6WX2cf@ep-shy-bread-ak1we59z.c-3.us-west-2.aws.neon.tech/neondb?sslmode=require"
export OPENAI_API_KEY="$(grep OPENAI_API_KEY ~/.config/last30days/.env | cut -d= -f2-)"

CHALLENGES=(
  "02-01-scroll-progress-bar"
  "02-03-interpolate-size-accordion"
  "02-04-starting-style-enter"
  "02-07-transition-behavior-discrete"
  "02-09-scroll-snap-carousel"
  "03-01-field-sizing-textarea"
  "03-02-user-valid-feedback"
  "03-04-accent-color-theme"
  "03-06-color-scheme-form-controls"
  "03-07-file-selector-button"
  "03-08-focus-visible-ring"
  "03-09-exclusive-accordion-details"
  "04-01-light-dark-card"
  "04-03-relative-color-syntax"
  "04-05-oklch-gradient"
  "04-06-color-scheme-system"
  "04-07-accent-color-uniform"
  "04-08-currentcolor-inheritance"
  "04-09-forced-colors-mode"
  "05-01-text-wrap-balance"
  "05-02-text-wrap-pretty"
  "05-05-first-line-styled"
  "05-07-highlight-pseudo"
  "05-08-line-clamp"
  "05-09-font-variant-numeric"
  "06-05-fit-content-sizing"
  "06-06-layer-cascade"
  "06-08-prefers-reduced-motion"
  "06-09-aspect-ratio-responsive"
)

TOTAL=${#CHALLENGES[@]}
DONE=0
ERRORS=()

for id in "${CHALLENGES[@]}"; do
  echo ""
  echo "[$((DONE+1))/$TOTAL] Running $id..."
  if bun "$REPO_DIR/scripts/re-run-challenge.ts" "$id"; then
    DONE=$((DONE+1))
    echo "  ✓ $id complete"
  else
    ERRORS+=("$id")
    echo "  ✗ $id FAILED"
  fi
done

echo ""
echo "=== Summary ==="
echo "Done: $DONE / $TOTAL"
if [ ${#ERRORS[@]} -gt 0 ]; then
  echo "Errors: ${ERRORS[*]}"
else
  echo "No errors."
fi
