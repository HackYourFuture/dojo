# Image of the backup cron service on Railway: pg_dump 18, rclone, curl and the scripts.
FROM postgres:18-alpine
RUN apk add --no-cache rclone curl
# rclone is configured purely through RCLONE_CONFIG_* variables; an empty config file keeps it quiet.
ENV RCLONE_CONFIG=/dev/null
WORKDIR /backup
COPY run.sh dump.sh upload.sh sync-storage.sh ./
ENTRYPOINT ["/backup/run.sh"]
