#!/usr/bin/env bash
# Uploads the dump files in <directory> to the Google Shared Drive and deletes old backups.
#
# Every run goes to the daily folder. On Mondays the dump is also copied to the weekly folder,
# on the 1st of the month to the monthly folder. Each folder keeps its backups for its own
# retention period.
#
# Usage: scripts/backup/upload.sh <directory>
#
# Needs rclone with a remote called "gdrive". On Railway it is configured through the
# RCLONE_CONFIG_GDRIVE_* variables of the backup service, see README.md; locally you can create
# it with `rclone config`.
set -euo pipefail

directory="${1:?usage: upload.sh <directory>}"
remote="gdrive:dojo"

keep_daily=14d
keep_weekly=13w
keep_monthly=1y

# Step 1: make sure the folders exist, so the cleanup below never fails on a missing folder.
rclone mkdir "$remote/daily"
rclone mkdir "$remote/weekly"
rclone mkdir "$remote/monthly"

# Step 2: upload today's dump.
rclone copy --verbose "$directory" "$remote/daily"
if [ "$(date -u +%u)" = 1 ]; then
  rclone copy --verbose "$directory" "$remote/weekly"
fi
if [ "$(date -u +%d)" = 01 ]; then
  rclone copy --verbose "$directory" "$remote/monthly"
fi

# Step 3: delete backups older than the retention of their folder, for real instead of moving
# them to the Drive trash.
rclone delete --verbose --drive-use-trash=false --min-age "$keep_daily" "$remote/daily"
rclone delete --verbose --drive-use-trash=false --min-age "$keep_weekly" "$remote/weekly"
rclone delete --verbose --drive-use-trash=false --min-age "$keep_monthly" "$remote/monthly"

# Step 4: show what is in the Drive now.
echo "Backups in the Drive:"
rclone lsl "$remote"
