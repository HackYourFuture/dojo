#!/usr/bin/env bash
# Entry point of the backup service on Railway: dumps the database, uploads the dump to the Shared
# Drive and mirrors the storage bucket. A failing step stops the run with a non-zero exit, so the
# healthcheck ping at the end is skipped and the healthcheck alerts.
set -euo pipefail
cd "$(dirname "$0")"

./dump.sh backups
./upload.sh backups
./sync-storage.sh "${STORAGE_BUCKET:?}"

# Step 4: report the successful run to the healthcheck, which emails when a day's ping is missing.
if [ -n "${HEALTHCHECK_URL:-}" ]; then
  curl -fsS --retry 3 --max-time 10 "$HEALTHCHECK_URL" > /dev/null
fi
echo "Backup finished"
