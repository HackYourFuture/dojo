"""Generates a complete trainee: the profile plus everything attached to it.

All data is generated up front, before anything is sent to the API, so the random sequence never
depends on server responses. A failed request can't change the data of the trainees after it.
"""

from dataclasses import dataclass
from typing import Any

from dojo_setup.generators.assessment import generate_assessment
from dojo_setup.generators.employment_history import EMPLOYED_JOB_PATHS, generate_employment
from dojo_setup.generators.interaction import generate_interaction
from dojo_setup.generators.portrait import generate_portrait_url
from dojo_setup.generators.profile import generate_profile
from dojo_setup.generators.randomness import fake


@dataclass(frozen=True)
class GeneratedTrainee:
    profile: dict[str, Any]
    portrait_url: str
    assessments: list[dict[str, Any]]
    interactions: list[dict[str, Any]]
    employment_history: list[dict[str, Any]]

    @property
    def name(self) -> str:
        return f"{self.profile['firstName']} {self.profile['lastName']}"


def generate_trainee() -> GeneratedTrainee:
    profile = generate_profile()
    return GeneratedTrainee(
        profile=profile,
        portrait_url=generate_portrait_url(profile["gender"]),
        assessments=[generate_assessment(profile) for _ in range(fake.random_int(0, 7))],
        interactions=[generate_interaction(profile) for _ in range(fake.random_int(0, 20))],
        employment_history=_employment_history(profile),
    )


def _employment_history(profile: dict[str, Any]) -> list[dict[str, Any]]:
    if profile["jobPath"] not in EMPLOYED_JOB_PATHS:
        return []
    return [generate_employment(profile) for _ in range(fake.random_int(0, 3))]
