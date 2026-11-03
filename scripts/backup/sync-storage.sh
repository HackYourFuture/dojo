#!/usr/bin/env bash
# Mirrors the Dojo file storage bucket (the profile pictures) into the Google Drive.
#
# rclone sync only transfers files that are new or changed and removes files that were deleted, so
# every run after the first one is small. Files a run would overwrite or delete are moved to a
# folder named after the day instead of being lost, which also makes a mistaken sync recoverable.
#
# Usage: scripts/backup/sync-storage.sh <bucket>
#
# Needs rclone with a remote called "s3" for the bucket and one called "gdrive" for the Drive.
# The job configures them through the RCLONE_CONFIG_* environment variables, see README.md;
# locally you can create them with `rclone config`.
set -euo pipefail

bucket="${1:?usage: sync-storage.sh <bucket>}"
remote="gdrive:"

# Step 1: mirror the bucket. Replaced and deleted files go to storage-history/<date>. --fast-list
# lists both sides in big pages instead of one request per folder, which matters on the Drive.
rclone sync --verbose --fast-list --backup-dir "${remote}storage-history/$(date -u +%Y-%m-%d)" "s3:$bucket" "${remote}storage"

# Step 2: delete the day folders of the history that are older than a year. The folders are
# compared by name, since the files inside keep the modification time they had in the bucket.
cutoff="$(( $(date -u +%Y) - 1 ))$(date -u +-%m-%d)"
rclone mkdir "${remote}storage-history"
for day in $(rclone lsf --dirs-only "${remote}storage-history"); do
  day="${day%/}"
  if [[ "$day" < "$cutoff" ]]; then
    echo "Deleting history of $day"
    rclone purge --drive-use-trash=false "${remote}storage-history/$day"
  fi
done

# Step 3: show the size of the mirror.
rclone size "${remote}storage"
