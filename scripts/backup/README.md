# Backups

The backup runs as a cron service in the Railway project, every night, from the Docker image built
from this folder. It runs inside the project, so it reaches the database over the private network
through the same reference variables the server uses, and no Railway credentials have to exist
anywhere else. [run.sh](run.sh) runs three steps and pings a healthcheck when all of them
succeeded:

- **Database.** [dump.sh](dump.sh) runs `pg_dump` against the Postgres service. [upload.sh](upload.sh)
  uploads the dump with rclone to `dojo/daily` in the Shared Drive, on Mondays also to
  `dojo/weekly` and on the 1st of the month to `dojo/monthly`, and deletes backups older than
  14 days, 13 weeks and 1 year respectively.
- **File storage.** [sync-storage.sh](sync-storage.sh) mirrors the storage bucket into
  `dojo/storage` with `rclone sync`, which only transfers new and changed files. Files a run
  replaces or deletes are moved to `dojo/storage-history/<date>` and kept for a year.

A failed run exits non-zero and skips the ping, so the healthcheck emails about it. The logs of a
run are in the service's deployments in Railway; `railway cron list --service backup` shows the
recent runs and `railway cron run --service backup` starts one by hand.

## One-time setup

### Google Drive

1. Create a Shared Drive for the backups and restrict its members to the people who may restore,
   the backups contain trainee data. A folder in someone's My Drive does not work: service
   accounts have no storage quota of their own and cannot own files there.
2. In the Google Cloud project that holds the Dojo sign-in client, enable the Google Drive API and
   create a service account with a JSON key.
3. Add the service account's email address to the Shared Drive as Content manager.
4. Note the Shared Drive ID, the last part of its URL.

### Healthcheck

Create a check on [healthchecks.io](https://healthchecks.io) with a period of 1 day and a grace
time of a few hours, add the email addresses that should get the alerts, and note its ping URL.

### Railway

1. In the Dojo project, add a service from this GitHub repository and call it `backup`. In its
   settings set the root directory to `scripts/backup` (Railway then builds the Dockerfile there),
   the watch paths to `scripts/backup/**` and the cron schedule to `17 2 * * *` (02:17 UTC, nightly).
2. Add its variables. `Postgres` and `dojo-server` are the names of the database and server
   services; the references pull the values from them, so nothing is copied by hand.

   | Variable                                          | Value                                      |
   |---------------------------------------------------|--------------------------------------------|
   | `PGHOST`                                          | `${{Postgres.PGHOST}}`                     |
   | `PGPORT`                                          | `${{Postgres.PGPORT}}`                     |
   | `PGUSER`                                          | `${{Postgres.PGUSER}}`                     |
   | `PGPASSWORD`                                      | `${{Postgres.PGPASSWORD}}`                 |
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
   | `RCLONE_CONFIG_GDRIVE_TEAM_DRIVE`                 | the Shared Drive ID                        |
   | `RCLONE_CONFIG_GDRIVE_SERVICE_ACCOUNT_CREDENTIALS` | the contents of the service account JSON  |
   | `HEALTHCHECK_URL`                                 | the ping URL of the check                  |

   Railway buckets only accept the virtual-hosted URL style, hence the path style being off.
3. Deploy, then start a run by hand with `railway cron run --service backup` and check its logs and
   the Shared Drive.

## Running locally

The scripts need bash, `pg_dump` and `pg_restore` 18 (`brew install libpq`) and rclone with
remotes called `gdrive` and `s3` (`rclone config`). The dump takes the database from the `PG*`
variables:

```bash
PGHOST=localhost PGUSER=admin PGPASSWORD=password PGDATABASE=dojo scripts/backup/dump.sh backups
scripts/backup/upload.sh backups
scripts/backup/sync-storage.sh <bucket>
```

To run the whole thing the way Railway does, build the image and run it with the variables from
the table in an env file:

```bash
docker build -t dojo-backup scripts/backup
docker run --rm --env-file backup.env dojo-backup
```

## Restoring

The dumps are in pg_dump's custom format. Into the local database:

```bash
pg_restore --clean --if-exists --no-owner -h localhost -U admin -d dojo backups/dojo-2026-10-28.dump
```

Into Railway, open a tunnel with `railway connect Postgres --tunnel-only` and point `pg_restore`
at the connection URL it prints.

Single files from the storage mirror can be downloaded from the Drive. To put the whole mirror
back into a bucket:

```bash
rclone copy gdrive:dojo/storage s3:<bucket>
```
