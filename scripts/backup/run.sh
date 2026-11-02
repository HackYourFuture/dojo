#!/usr/bin/env bash
# Entry point of the backup service on Railway: dumps the database, uploads the dump to the Google
# Drive and mirrors the storage bucket. A failing step stops the run with a non-zero exit, which
# Railway shows as a failed deployment.
set -euo pipefail
cd "$(dirname "$0")"

./db-dump.sh backups
./db-upload.sh backups
./sync-storage.sh "${STORAGE_BUCKET:?}"
echo "Backup finished"
