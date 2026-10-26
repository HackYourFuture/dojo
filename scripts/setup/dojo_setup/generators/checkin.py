"""Generates the check-ins of a mentorship."""

from datetime import date, timedelta
from typing import Any

from dojo_setup.generators.randomness import chance, fake

CHECKIN_INTERVAL = timedelta(weeks=4)
NOTES = [
    "Regular check-in. The trainee is making steady progress and has no blockers.",
    "Reviewed the latest assignment together and discussed what to improve.",
    "The trainee was busy with other commitments this month. Agreed on a lighter schedule for now.",
    "Talked about job applications and practised answering interview questions.",
    "Short catch-up over Slack. Everything is on track.",
    "Followed up on last month's action points. Most of them are done.",
    "The trainee asked for help with their final project plan. Set up an extra session next week.",
]


def generate_checkins(start_date: date, until: date) -> list[dict[str, Any]]:
    """One check-in about every four weeks from the start until the given date, oldest first. Some are skipped."""
    checkins = []
    checkin_date = start_date + CHECKIN_INTERVAL
    while checkin_date <= until:
        if chance(0.85):
            checkins.append({"date": checkin_date, "notes": fake.random_element(NOTES)})
        checkin_date += CHECKIN_INTERVAL + timedelta(days=fake.random_int(-5, 5))
    return checkins
