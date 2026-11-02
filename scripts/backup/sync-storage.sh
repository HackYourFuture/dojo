#!/usr/bin/env bash
# Mirrors the Dojo file storage bucket (the profile pictures) into the Google Shared Drive.
#
# rclone sync only transfers files that are new or changed and removes files that were deleted, so
# every run after the first one is small. Files a run would overwrite or delete are moved to a
# folder named after the day instead of being lost, which also makes a mistaken sync recoverable.
#
# Usage: scripts/backup/sync-storage.sh <bucket>
#
# Needs rclone with a remote called "s3" for the bucket and one called "gdrive" for the Shared
# Drive. On Railway they are configured through the RCLONE_CONFIG_* variables of the backup
# service, see README.md; locally you can create them with `rclone config`.
set -euo pipefail

bucket="${1:?usage: sync-storage.sh <bucket>}"
remote="gdrive:dojo"
keep_history=1y

# Step 1: mirror the bucket. Replaced and deleted files go to storage-history/<date>. --fast-list
# lists both sides in big pages instead of one request per folder, which matters on the Drive.
rclone sync --verbose --fast-list --backup-dir "$remote/storage-history/$(date -u +%Y-%m-%d)" "s3:$bucket" "$remote/storage"

# Step 2: delete history older than the retention, and the day folders that became empty.
rclone mkdir "$remote/storage-history"
rclone delete --verbose --drive-use-trash=false --min-age "$keep_history" "$remote/storage-history"
rclone rmdirs --leave-root --drive-use-trash=false "$remote/storage-history"

# Step 3: show the size of the mirror.
rclone size "$remote/storage"
