#!/usr/bin/env bash
# Dumps the Dojo database into <directory>/dojo-<date>.sql.gz.
#
# pg_dump takes the host, port, user, password and database from the PG* environment variables.
# The job sets them to the database's private network address, so the database stays unreachable
# from the internet. Locally point them at the local database, see README.md.
#
# Usage: scripts/backup/db-dump.sh <directory>
set -euo pipefail

directory="${1:?usage: db-dump.sh <directory>}"
file="$directory/dojo-$(date -u +%Y-%m-%d).sql"

# Step 1: dump as plain SQL, readable as text and restored by running it with psql. The dump
# drops the existing tables first, so a restore ends up with exactly the data of the dump.
mkdir -p "$directory"
echo "Dumping ${PGDATABASE:?} on ${PGHOST:?} into $file"
pg_dump --format=plain --clean --if-exists --no-owner --file "$file"

# Step 2: make sure the dump is complete; pg_dump writes this line near the very end.
tail -n 10 "$file" | grep -q 'PostgreSQL database dump complete'

# Step 3: compress it. gzip replaces the file with $file.gz.
gzip "$file"
echo "Done, $(du -h "$file.gz" | cut -f1)"
