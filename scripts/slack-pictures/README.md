# Slack pictures

Once a day, [sync.py](sync.py) gives every trainee and volunteer without a profile picture the
picture from their Slack profile. It lists both through the Dojo API, keeps the people with a Slack
id, asks Slack for their profile and uploads the picture to Dojo. People whose Slack profile still
has the generated default avatar are skipped, so Dojo keeps showing that they have no picture until
they upload one. Nothing is remembered between runs: whoever is still without a picture tomorrow is
tried again.

A failed run exits non-zero; the logs of the job show what went wrong. The script prints Dojo ids
and counts only, never names.

## Variables

| Variable      | Value                                                               |
|---------------|---------------------------------------------------------------------|
| `DOJO_URL`    | the Dojo server, default `http://localhost:7777`                    |
| `DOJO_TOKEN`  | a Dojo API token, default `DOJOTEST`, the local token of `../setup` |
| `SLACK_TOKEN` | a Slack bot token with the `users:read` scope                       |

## Running locally

Needs Python 3.12 or newer.

```bash
pip install -r scripts/slack-pictures/requirements.txt
SLACK_TOKEN=xoxb-... python scripts/slack-pictures/sync.py
```

Or build and run the image, which reaches the server on the host through Docker Desktop:

```bash
docker build -t dojo-slack-pictures scripts/slack-pictures
docker run --rm -e DOJO_URL=http://host.docker.internal:7777 -e SLACK_TOKEN=xoxb-... \
  dojo-slack-pictures
```

## The job

A Docker image built from this folder, run every night as a scheduled job next to the server,
without a retry on failure, with the three variables; `DOJO_URL` is the server's private address,
so the request never leaves the project. Start a run by hand and check its logs.
