# Backups

A Docker image built from this folder, run every night as a scheduled job next to the database.
[run.sh](run.sh) runs three steps:

- [db-dump.sh](db-dump.sh) dumps the database as gzipped plain SQL.
- [db-upload.sh](db-upload.sh) uploads the dump to the Google Drive folder and deletes old ones.
- [sync-storage.sh](sync-storage.sh) mirrors the storage bucket into the Google Drive folder.

The Drive folder ends up like this:

| Folder                   | Contents                                                  |
|--------------------------|-----------------------------------------------------------|
| `database/daily`         | the dump of every night, kept 14 days                     |
| `database/weekly`        | the dump of every Monday, kept 13 weeks                   |
| `database/monthly`       | the dump of every 1st of the month, kept 1 year           |
| `storage`                | the mirror of the bucket                                  |
| `storage-history/<date>` | files replaced or deleted in the mirror that day, kept 1 year |

A failed run exits non-zero; the logs of the job show what went wrong.

## Setup

### Google Drive

1. In the Drive of the organisation's dedicated Google account, create a folder for the backups
   and share it only with the people who may restore.
2. In the organisation's Google Cloud project, enable the Google Drive API and create an OAuth
   client of type Desktop app.
3. On your machine run `rclone config`: create a remote named `gdrive` of type `drive`, enter the
   client ID and secret, keep the other defaults and log in as that account in the browser.
4. From `~/.config/rclone/rclone.conf` take the `client_id`, `client_secret` and `token` lines of
   the remote, and from the folder's URL its ID. The token stays valid until the account's
   password changes; then repeat step 3.

### Database role

With psql connected to the production database:

```sql
CREATE ROLE backup LOGIN PASSWORD '<a long random password>';
GRANT pg_read_all_data TO backup;
```

### The job

Schedule the image to run every night, without a retry on failure, with these variables. The
bucket values are the server's `STORAGE_*` values.

| Variable                              | Value                                   |
|---------------------------------------|-----------------------------------------|
| `PGHOST`                              | the database host                       |
| `PGPORT`                              | the database port                       |
| `PGUSER`                              | `backup`                                |
| `PGPASSWORD`                          | the role's password                     |
| `PGDATABASE`                          | the database name                       |
| `STORAGE_BUCKET`                      | the bucket name                         |
| `RCLONE_CONFIG_S3_TYPE`               | `s3`                                    |
| `RCLONE_CONFIG_S3_PROVIDER`           | `Other`                                 |
| `RCLONE_CONFIG_S3_ENDPOINT`           | the bucket endpoint URL                 |
| `RCLONE_CONFIG_S3_REGION`             | the bucket region                       |
| `RCLONE_CONFIG_S3_FORCE_PATH_STYLE`   | `false`                                 |
| `RCLONE_CONFIG_S3_ACCESS_KEY_ID`      | the bucket's access key ID              |
| `RCLONE_CONFIG_S3_SECRET_ACCESS_KEY`  | the bucket's secret key                 |
| `RCLONE_CONFIG_GDRIVE_TYPE`           | `drive`                                 |
| `RCLONE_CONFIG_GDRIVE_SCOPE`          | `drive`                                 |
| `RCLONE_CONFIG_GDRIVE_ROOT_FOLDER_ID` | the folder ID                           |
| `RCLONE_CONFIG_GDRIVE_CLIENT_ID`      | the `client_id` from rclone.conf        |
| `RCLONE_CONFIG_GDRIVE_CLIENT_SECRET`  | the `client_secret` from rclone.conf    |
| `RCLONE_CONFIG_GDRIVE_TOKEN`          | the whole `token` JSON from rclone.conf |

Start a run by hand and check its logs and the Drive folder.

## Running locally

Needs bash, `pg_dump` 18 (`brew install libpq`) and rclone with remotes `s3` and `gdrive` as in
the table (`rclone config`):

```bash
PGHOST=localhost PGUSER=admin PGPASSWORD=password PGDATABASE=dojo scripts/backup/db-dump.sh backups
scripts/backup/db-upload.sh backups
scripts/backup/sync-storage.sh <bucket>
```

Or build and run the image with the variables of the table in an env file:

```bash
docker build -t dojo-backup scripts/backup
docker run --rm --env-file backup.env dojo-backup
```

## Restoring

Needs `psql` (`brew install libpq`) and rclone with a `gdrive` remote signed in to a Google
account that has access to the backup folder, with `root_folder_id` set to the folder ID. Single
files can also be downloaded from the Drive in the browser.

Database, into the local one; for production point `psql` at the production database instead:

```bash
rclone copy gdrive:database/daily/dojo-2026-10-28.sql.gz backups
gunzip -c backups/dojo-2026-10-28.sql.gz | psql -v ON_ERROR_STOP=1 -h localhost -U admin -d dojo
```

The dump drops the existing tables first, so the database ends up exactly as it was in the dump.

Storage, the whole mirror back into a bucket, with an `s3` remote configured as in the table:

```bash
rclone copy gdrive:storage s3:<bucket>
```
