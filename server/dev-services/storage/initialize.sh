#!/bin/sh
set -e

# Required env vars:

# MINIO_ROOT_USER=dojo
# MINIO_ROOT_PASSWORD=dojodojo
# ACCESS_KEY=dojo_key
# SECRET_KEY=dojo_secret
# BUCKET_NAME=dojo-dev

API_URL=http://localhost:9000

echo "Initializing local server env with ${MINIO_ROOT_USER}"

# Server login
mc alias set minio ${API_URL} ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD}

# Create new access key
mc admin accesskey create minio --access-key ${ACCESS_KEY} --secret-key ${SECRET_KEY}

# Client login
mc alias set minio ${API_URL} ${ACCESS_KEY} ${SECRET_KEY}

# Create a new bucket
mc mb minio/${BUCKET_NAME}

# Set it to public
mc anonymous set public minio/${BUCKET_NAME}

