from typing import Any

from dojo_setup.data import INTERACTIONS
from dojo_setup.generators.randomness import YEAR, datetime_after, fake


def generate_interaction(trainee: dict[str, Any]) -> dict[str, Any]:
    interaction = fake.random_element(INTERACTIONS)
    return {
        "date": datetime_after(YEAR, trainee["startDate"]),
        "type": interaction["type"],
        "title": interaction["title"],
        "details": interaction["details"],
    }
