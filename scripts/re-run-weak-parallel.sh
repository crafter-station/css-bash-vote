#!/usr/bin/env bash
# Parallel runner for the weak-challenge re-run, with concurrency 4.
# Skips challenges already updated in the last 60 minutes.

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"

export DATABASE_URL="postgresql://neondb_owner:npg_ygTsDo6WX2cf@ep-shy-bread-ak1we59z.c-3.us-west-2.aws.neon.tech/neondb?sslmode=require"
export OPENAI_API_KEY="$(grep OPENAI_API_KEY ~/.config/last30days/.env | cut -d= -f2-)"

ALL=(
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

# Identify already-done by checking the runs table for recent updates
DONE_LIST=$(psql "$DATABASE_URL" -t -A -c "SELECT challenge_id FROM runs WHERE created_at > NOW() - INTERVAL '90 minutes' GROUP BY challenge_id;")

PENDING=()
for cid in "${ALL[@]}"; do
  if ! echo "$DONE_LIST" | grep -qx "$cid"; then
    PENDING+=("$cid")
  fi
done

TOTAL=${#PENDING[@]}
echo "Total weak challenges: ${#ALL[@]}"
echo "Already done: $((${#ALL[@]} - TOTAL))"
echo "Pending: $TOTAL"
echo

if [ $TOTAL -eq 0 ]; then
  echo "Nothing to do."
  exit 0
fi

CONCURRENCY=4
START_TS=$(date +%s)
LOG_DIR="$REPO_DIR/.logs/re-run-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$LOG_DIR"
echo "Logs at $LOG_DIR"
echo

run_one() {
  local cid=$1
  local idx=$2
  local total=$3
  local log="$LOG_DIR/$cid.log"
  local start=$(date +%s)
  echo "[$idx/$total] START  $cid"
  if cd "$REPO_DIR" && bun scripts/re-run-challenge.ts "$cid" > "$log" 2>&1; then
    local elapsed=$(( $(date +%s) - start ))
    echo "[$idx/$total] OK     $cid  (${elapsed}s)"
  else
    local elapsed=$(( $(date +%s) - start ))
    echo "[$idx/$total] FAIL   $cid  (${elapsed}s) — see $log"
  fi
}

export -f run_one
export REPO_DIR LOG_DIR

idx=0
for cid in "${PENDING[@]}"; do
  idx=$((idx + 1))
  run_one "$cid" "$idx" "$TOTAL" &

  # Throttle: wait when we hit concurrency cap
  if [ $((idx % CONCURRENCY)) -eq 0 ]; then
    wait
  fi
done

wait

elapsed=$(( $(date +%s) - START_TS ))
echo
echo "=== Done in ${elapsed}s ==="
