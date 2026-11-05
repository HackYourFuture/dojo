"""Gives every trainee and volunteer without a profile picture the one from their Slack profile."""

import os
import sys
from collections import Counter

import requests

DOJO_URL = (os.environ.get("DOJO_URL") or "http://localhost:7777").rstrip("/")
DOJO_TOKEN = os.environ.get("DOJO_TOKEN") or "DOJOTEST"
SLACK_TOKEN = os.environ.get("SLACK_TOKEN") or sys.exit("SLACK_TOKEN is not set")

dojo = requests.Session()
dojo.headers["Authorization"] = f"Bearer {DOJO_TOKEN}"
dojo.headers["User-Agent"] = "dojo-slack-pictures"


def check(response: requests.Response) -> requests.Response:
    if not response.ok:
        raise Exception(f"HTTP {response.status_code}: {response.text[:200]}")
    return response


# The person's own picture URL, or None for Slack's generated default and for unknown ids
def slack_picture_url(slack_id: str) -> str | None:
    # Form data instead of a query string keeps the Slack id out of error messages
    response = requests.post(
        "https://slack.com/api/users.info",
        data={"user": slack_id},
        headers={"Authorization": f"Bearer {SLACK_TOKEN}"},
        timeout=30,
    )
    body = check(response).json()
    if not body["ok"]:
        if body["error"] in ("user_not_found", "user_not_visible"):
            return None
        raise Exception("Slack: " + body["error"])
    profile = body["user"]["profile"]
    if not profile.get("is_custom_image"):
        return None
    # Dojo stores 700x700, so anything larger than 1024 is wasted
    return profile.get("image_1024") or profile["image_512"]


def copy_picture(kind: str, person_id: str, url: str) -> None:
    image = check(requests.get(url, timeout=30))
    content_type = image.headers["Content-Type"].split(";")[0]
    picture = {"picture": ("picture", image.content, content_type)}
    check(dojo.put(f"{DOJO_URL}/api/{kind}/{person_id}/picture", files=picture, timeout=30))


# Returns the number of people whose picture could not be copied
def sync(kind: str) -> int:
    body = check(dojo.get(f"{DOJO_URL}/api/{kind}", params={"size": 5000}, timeout=30)).json()
    people = [person for person in body["content"] if person["thumbnailUrl"] is None]
    counts = Counter()
    for person in people:
        if not person["slackId"]:
            counts["without Slack id"] += 1
            continue
        try:
            url = slack_picture_url(person["slackId"])
            if url is None:
                counts["without Slack picture"] += 1
                continue
            copy_picture(kind, person["id"], url)
            print(f"{kind} {person['id']}: uploaded")
            counts["uploaded"] += 1
        except Exception as error:
            # The log is public and a network error's message holds the URL, so print only its type
            reason = type(error).__name__ if isinstance(error, requests.RequestException) else error
            print(f"{kind} {person['id']}: failed: {reason}")
            counts["failed"] += 1
    print(
        f"{kind}: {len(people)} without picture, {counts['uploaded']} uploaded, "
        f"{counts['failed']} failed, {counts['without Slack id']} without Slack id, "
        f"{counts['without Slack picture']} without Slack picture"
    )
    return counts["failed"]


def main() -> None:
    if sync("trainees") + sync("volunteers"):
        sys.exit(1)


if __name__ == "__main__":
    try:
        main()
    except requests.RequestException as error:
        # The log is public and a network error's message holds the URL, so print only its type
        sys.exit(type(error).__name__)
