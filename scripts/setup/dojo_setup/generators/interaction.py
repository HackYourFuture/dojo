from typing import Any

from dojo_setup.data import ORGANISATION_INTERACTIONS, TRAINEE_INTERACTIONS, VOLUNTEER_INTERACTIONS
from dojo_setup.generators.randomness import YEAR, datetime_after, datetime_before, fake


def generate_trainee_interaction(trainee: dict[str, Any]) -> dict[str, Any]:
    interaction = fake.random_element(TRAINEE_INTERACTIONS)
    return {
        "date": datetime_after(YEAR, trainee["startDate"]),
        "type": interaction["type"],
        "title": interaction["title"],
        "details": interaction["details"],
    }


def generate_volunteer_interaction() -> dict[str, Any]:
    interaction = fake.random_element(VOLUNTEER_INTERACTIONS)
    return {
        "date": datetime_before(3 * YEAR),
        "type": interaction["type"],
        "title": interaction["title"],
        "details": interaction["details"],
    }


def generate_organisation_interaction() -> dict[str, Any]:
    interaction = fake.random_element(ORGANISATION_INTERACTIONS)
    return {
        "date": datetime_before(3 * YEAR),
        "type": interaction["type"],
        "title": interaction["title"],
        "details": interaction["details"],
    }
