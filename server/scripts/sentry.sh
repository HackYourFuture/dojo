if [ -z "$SENTRY_AUTH_TOKEN" ]; then
  echo "➡️ SENTRY_AUTH_TOKEN is not set. Skipping Sentry sourcemaps upload."
else
  sentry-cli sourcemaps inject --org hackyourfuture-nl --project dojo-backend ./dist && sentry-cli sourcemaps upload --org hackyourfuture-nl --project dojo-backend ./dist
fi