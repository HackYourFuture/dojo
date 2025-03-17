FROM minio/minio:latest

ARG MINIO_ROOT_USER
ARG MINIO_ROOT_PASSWORD
ENV MINIO_VOLUMES='/data'
ENV MINIO_OPTS='--console-address :9001'

ADD entrypoint.sh initialize.sh /

EXPOSE 9000 9001
ENTRYPOINT ["sh", "/entrypoint.sh"]
