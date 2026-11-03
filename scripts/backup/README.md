# Backups

The backup is a Docker image built from this folder, run once a night as a scheduled job next to
the database, so it reaches the database over the private network and nothing has to be opened
to the internet. [run.sh](run.sh) runs three steps:

- **Database.** [db-dump.sh](db-dump.sh) runs `pg_dump` against the database and writes a gzipped
  plain SQL file. [db-upload.sh](db-upload.sh) uploads it with rclone to `database/daily` in the
  Drive folder, on Mondays also to `database/weekly` and on the 1st of the month to
  `database/monthly`, and deletes backups older than 14 days, 13 weeks and 1 year respectively.
- **File storage.** [sync-storage.sh](sync-storage.sh) mirrors the storage bucket into `storage`
  with `rclone sync`, which only transfers new and changed files. Files a run replaces or deletes
  are moved to `storage-history/<date>` and kept for a year.

A failed run exits non-zero, and the logs of the job show what went wrong.

## One-time setup

### Google Drive

The backup signs in to Google as a dedicated account of the organisation, so the files belong to
the organisation and not to a person.

1. In that account's Drive, create a folder for the backups and share it only with the people who
   may restore, the backups contain trainee data.
2. In the Google Cloud project of the organisation, enable the Google Drive API and create an
   OAuth client of type Desktop app for rclone. Without one rclone uses its own shared client,
   which is rate limited across all its users.
3. Sign rclone in as that account once, on your machine: run `rclone config`, create a remote
   named `gdrive` of type `drive`, enter the client ID and secret, keep the other defaults and log
   in as the account in the browser it opens.
4. Note the folder ID, the last part of the folder's URL, and the `client_id`, `client_secret` and
   `token` lines of the remote in `~/.config/rclone/rclone.conf`. The token only works with the
   client that issued it, and stays valid until the account's password changes or the app is
   revoked; then repeat step 3.

### Database role

Create a read-only role for the backup, so the job cannot change data even if it is compromised.
With psql connected to the production database:

```sql
CREATE ROLE backup LOGIN PASSWORD '<a long random password>';
GRANT pg_read_all_data TO backup;
```

### The job

Build the Docker image from this folder and schedule it to run every night, without a retry when
it fails. It takes everything it needs from environment variables; the bucket values are the
same ones the server has as `STORAGE_*`.

| Variable                             | Value                                           |
|--------------------------------------|-------------------------------------------------|
| `PGHOST`                             | the database host on the private network        |
| `PGPORT`                             | the database port                               |
| `PGUSER`                             | `backup`                                        |
| `PGPASSWORD`                         | the role's password                             |
| `PGDATABASE`                         | the database name                               |
| `STORAGE_BUCKET`                     | the bucket name                                 |
| `RCLONE_CONFIG_S3_TYPE`              | `s3`                                            |
| `RCLONE_CONFIG_S3_PROVIDER`          | `Other`                                         |
| `RCLONE_CONFIG_S3_ENDPOINT`          | the bucket endpoint URL                         |
| `RCLONE_CONFIG_S3_REGION`            | the bucket region                               |
| `RCLONE_CONFIG_S3_FORCE_PATH_STYLE`  | `false`, the bucket uses virtual-hosted URLs    |
| `RCLONE_CONFIG_S3_ACCESS_KEY_ID`     | the bucket's access key ID                      |
| `RCLONE_CONFIG_S3_SECRET_ACCESS_KEY` | the bucket's secret key                         |
| `RCLONE_CONFIG_GDRIVE_TYPE`          | `drive`                                         |
| `RCLONE_CONFIG_GDRIVE_SCOPE`         | `drive`                                         |
| `RCLONE_CONFIG_GDRIVE_ROOT_FOLDER_ID` | the folder ID                                  |
| `RCLONE_CONFIG_GDRIVE_CLIENT_ID`     | the `client_id` from rclone.conf                |
| `RCLONE_CONFIG_GDRIVE_CLIENT_SECRET` | the `client_secret` from rclone.conf            |
| `RCLONE_CONFIG_GDRIVE_TOKEN`         | the whole `token` JSON from rclone.conf         |

Then start a run by hand and check its logs and the Drive folder.

## Running locally

The scripts need bash, `pg_dump` 18 (`brew install libpq`) and rclone with remotes called `s3`
and `gdrive` as in the table (`rclone config`). The dump takes the database from the `PG*`
variables:

```bash
PGHOST=localhost PGUSER=admin PGPASSWORD=password PGDATABASE=dojo scripts/backup/db-dump.sh backups
scripts/backup/db-upload.sh backups
scripts/backup/sync-storage.sh <bucket>
```

To run the whole thing the way the job does, build the image and run it with the variables from
the table in an env file:

```bash
docker build -t dojo-backup scripts/backup
docker run --rm --env-file backup.env dojo-backup
```

## Restoring

You need `psql` (`brew install libpq`) and, for anything beyond a single file, rclone
(`brew install rclone`) signed in to a Google account that has access to the backup folder: run
`rclone config`, create a remote named `gdrive` of type `drive`, keep the defaults and log in in
the browser it opens. Set `root_folder_id` to the folder ID when asked for advanced config, or
put the folder's name in front of the paths below.

### 1. Get the dump

`rclone lsl gdrive:database/daily` lists the daily dumps; `weekly` and `monthly` next to it
hold the older ones. Download one, or just take it from the Drive in the browser:

```bash
rclone copy gdrive:database/daily/dojo-2026-10-28.sql.gz backups
```

### 2. Restore the database

The dump is gzipped plain SQL, so unpacked it can be read as text, and restoring it means running
it. It drops the existing tables first, so the database ends up exactly as it was in the dump.
Into the local database:

```bash
gunzip -c backups/dojo-2026-10-28.sql.gz | psql -h localhost -U admin -d dojo
```

Into production, at a quiet moment: run the same pipe with `psql` pointed at the production
database the way you normally connect to it.

### 3. Restore files from the storage

`storage` is the mirror of the bucket, `storage-history/<date>` holds the files that were
replaced or deleted on that day. Single files can be taken from the Drive directly. To put the
whole mirror back into a bucket, add an `s3` remote with the bucket's credentials from the table
and run:

```bash
rclone copy gdrive:storage s3:<bucket>
```
