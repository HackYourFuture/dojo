from typing import Any

from dojo_setup.generators.randomness import YEAR, chance, date_after, date_before, fake

ASSIGNMENT_TYPES = [
    "assignment-review",
    "tech-interview",
    "teaching",
    "project-mentor",
    "tech-mentorship",
    "english-mentorship",
    "hr-mentorship",
    "content-creation",
    "workshop-host",
]
# Notes are picked independently of the type, so each fits any type
NOTES = [
    "Trainees gave very positive feedback.",
    "Would like to take on more of this.",
    "Only available in the evenings.",
    "Paused for a few weeks during the holidays.",
    "Worked together with another volunteer.",
    "Took longer than planned, but went well.",
]


def generate_volunteer_assignment(role_preferences: list[str]) -> dict[str, Any]:
    start_date = date_before(3 * YEAR)
    return {
        # Mostly what the volunteer prefers to do
        "type": fake.random_element(role_preferences or ASSIGNMENT_TYPES),
        "estimatedHours": fake.random_int(2, 80) if chance(0.7) else None,
        "startDate": start_date,
        "endDate": None if chance(0.3) else date_after(YEAR // 2, start_date),
        "notes": fake.random_element(NOTES) if chance(0.6) else None,
    }
