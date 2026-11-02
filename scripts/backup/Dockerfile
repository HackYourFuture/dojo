# Image of the backup cron service on Railway: pg_dump 18, rclone and the scripts.
FROM postgres:18-alpine
RUN apk add --no-cache rclone
# rclone is configured through RCLONE_CONFIG_* variables; the empty config file keeps it quiet and
# gives it somewhere to save the Google token it refreshes on every run.
RUN mkdir -p /root/.config/rclone && touch /root/.config/rclone/rclone.conf
WORKDIR /backup
COPY run.sh db-dump.sh db-upload.sh sync-storage.sh ./
ENTRYPOINT ["/backup/run.sh"]
