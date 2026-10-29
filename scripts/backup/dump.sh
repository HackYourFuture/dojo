#!/usr/bin/env bash
# Dumps the Dojo database into <directory>/dojo-<date>.dump.
#
# pg_dump takes the host, port, user, password and database from the PG* environment variables.
# On Railway they reference the Postgres service, so the dump goes over the private network and
# the database stays unreachable from the internet. Locally point them at the local database, see
# README.md.
#
# Usage: scripts/backup/dump.sh <directory>
set -euo pipefail

directory="${1:?usage: dump.sh <directory>}"
file="$directory/dojo-$(date -u +%Y-%m-%d).dump"

# Step 1: dump in pg_dump's custom format, which pg_restore can restore selectively.
mkdir -p "$directory"
echo "Dumping ${PGDATABASE:?} on ${PGHOST:?} into $file"
pg_dump --format=custom --no-owner --file "$file"

# Step 2: make sure the file is a dump that pg_restore can read.
pg_restore --list "$file" > /dev/null
echo "Done, $(du -h "$file" | cut -f1)"
