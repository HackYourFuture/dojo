#!/bin/sh
set -e

# Initialize with a new bucket and secret key once
if [ ! -f /initialized ]; then
  sh -c 'sleep 5 && sh /initialize.sh && touch /initialized' &
fi

minio server --console-address ":9001"

