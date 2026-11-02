# Backups

The backup runs as a cron service in the Railway project, every night, from the Docker image built
from this folder. It runs inside the project, so it reaches the database over the private network
through the same reference variables the server uses, and no Railway credentials have to exist
anywhere else. [run.sh](run.sh) runs three steps:

- **Database.** [db-dump.sh](db-dump.sh) runs `pg_dump` against the Postgres service.
  [db-upload.sh](db-upload.sh) uploads the dump with rclone to `dojo/daily` in the Drive folder,
  on Mondays also to `dojo/weekly` and on the 1st of the month to `dojo/monthly`, and deletes
  backups older than 14 days, 13 weeks and 1 year respectively.
- **File storage.** [sync-storage.sh](sync-storage.sh) mirrors the storage bucket into
  `dojo/storage` with `rclone sync`, which only transfers new and changed files. Files a run
  replaces or deletes are moved to `dojo/storage-history/<date>` and kept for a year.

A failed run exits non-zero and shows as a failed deployment in Railway. The logs of a run are in
the service's deployments; `railway cron list --service backup` shows the recent runs and
`railway cron run --service backup` starts one by hand.

## One-time setup

### Google Drive

The backup signs in to Google as the Google account, so the files belong to the
organisation and not to a person.

1. In that account's Drive, create a folder for the backups and share it only with the people who
   may restore, the backups contain trainee data. The scripts put everything in a `dojo` folder
   inside it.
2. Sign rclone in as that account once, on your machine: run `rclone config`, create a remote
   named `gdrive` of type `drive`, keep the defaults and log in as the Google account in
   the browser it opens.
3. Note the folder ID, the last part of the folder's URL, and the `token` line of the remote in
   `~/.config/rclone/rclone.conf`. The token stays valid until the account's password changes or
   the app is revoked; then repeat this step.

### Railway

1. In the Dojo project, add a service from this GitHub repository and call it `backup`. In its
   settings set the root directory to `scripts/backup` (Railway then builds the Dockerfile there),
   the watch paths to `scripts/backup/**`, the cron schedule to `17 2 * * *` (02:17 UTC, nightly)
   and the restart policy to Never, so a failed run is not retried.
2. Create a read-only database role for the backup, so the service cannot change data even if it
   is compromised. `railway connect Postgres` opens psql on the database:

   ```sql
   CREATE ROLE backup LOGIN PASSWORD '<a long random password>';
   GRANT pg_read_all_data TO backup;
   ```

3. Add its variables. `Postgres` and `dojo-server` are the names of the database and server
   services; the references pull the values from them, so only the role's password is copied by
   hand.

   | Variable                                          | Value                                      |
   |---------------------------------------------------|--------------------------------------------|
   | `PGHOST`                                          | `${{Postgres.PGHOST}}`                     |
   | `PGPORT`                                          | `${{Postgres.PGPORT}}`                     |
   | `PGUSER`                                          | `backup`                                   |
   | `PGPASSWORD`                                      | the role's password                        |
   | `PGDATABASE`                                      | `${{Postgres.PGDATABASE}}`                 |
   | `STORAGE_BUCKET`                                  | `${{dojo-server.STORAGE_BUCKET}}`          |
   | `RCLONE_CONFIG_S3_TYPE`                           | `s3`                                       |
   | `RCLONE_CONFIG_S3_PROVIDER`                       | `Other`                                    |
   | `RCLONE_CONFIG_S3_ENDPOINT`                       | `${{dojo-server.STORAGE_ENDPOINT}}`        |
   | `RCLONE_CONFIG_S3_REGION`                         | `${{dojo-server.STORAGE_REGION}}`          |
   | `RCLONE_CONFIG_S3_FORCE_PATH_STYLE`               | `false`                                    |
   | `RCLONE_CONFIG_S3_ACCESS_KEY_ID`                  | `${{dojo-server.STORAGE_ACCESS_KEY_ID}}`   |
   | `RCLONE_CONFIG_S3_SECRET_ACCESS_KEY`              | `${{dojo-server.STORAGE_ACCESS_KEY_SECRET}}` |
   | `RCLONE_CONFIG_GDRIVE_TYPE`                       | `drive`                                    |
   | `RCLONE_CONFIG_GDRIVE_SCOPE`                      | `drive`                                    |
   | `RCLONE_CONFIG_GDRIVE_ROOT_FOLDER_ID`             | the folder ID                              |
   | `RCLONE_CONFIG_GDRIVE_TOKEN`                      | the `token` JSON from rclone.conf          |

   Railway buckets only accept the virtual-hosted URL style, hence the path style being off.
4. Deploy, then start a run by hand with `railway cron run --service backup` and check its logs and
   the Drive folder.

## Running locally

The scripts need bash, `pg_dump` and `pg_restore` 18 (`brew install libpq`) and rclone with
remotes called `s3` and `gdrive` as in the table (`rclone config`). The dump takes the
database from the `PG*` variables:

```bash
PGHOST=localhost PGUSER=admin PGPASSWORD=password PGDATABASE=dojo scripts/backup/db-dump.sh backups
scripts/backup/db-upload.sh backups
scripts/backup/sync-storage.sh <bucket>
```

To run the whole thing the way Railway does, build the image and run it with the variables from
the table in an env file:

```bash
docker build -t dojo-backup scripts/backup
docker run --rm --env-file backup.env dojo-backup
```

## Restoring

You need `pg_restore` 18 (`brew install libpq`) and, for anything beyond a single file, rclone
(`brew install rclone`) signed in to a Google account that has access to the backup folder: run
`rclone config`, create a remote named `gdrive` of type `drive`, keep the defaults and log in in
the browser it opens. Set `root_folder_id` to the folder ID when asked for advanced config, or
put the folder's name in front of `dojo` in the paths below.

### 1. Get the dump

`rclone lsl gdrive:dojo/daily` lists the daily dumps; `weekly` and `monthly` hold the older
ones. Download one, or just take it from the Drive in the browser:

```bash
rclone copy gdrive:dojo/daily/dojo-2026-10-28.dump backups
```

### 2. Restore the database

The dump is in pg_dump's custom format. `--clean` drops the existing tables first, so the
database ends up exactly as it was in the dump. Into the local database:

```bash
pg_restore --clean --if-exists --no-owner -h localhost -U admin -d dojo backups/dojo-2026-10-28.dump
```

Into production, at a quiet moment: open a tunnel with `railway connect Postgres --tunnel-only`
and run the same command with `-d '<the connection URL it prints>'` instead of the host, user
and database.

### 3. Restore files from the storage

`dojo/storage` is the mirror of the bucket, `dojo/storage-history/<date>` holds the files that
were replaced or deleted on that day. Single files can be taken from the Drive directly. To put
the whole mirror back into a bucket, add an `s3` remote with the bucket's credentials from the
table and run:

```bash
rclone copy gdrive:dojo/storage s3:<bucket>
```
