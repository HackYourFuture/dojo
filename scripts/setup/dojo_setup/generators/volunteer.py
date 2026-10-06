"""Generates a complete volunteer: the profile, portrait and interactions."""

from dataclasses import dataclass
from typing import Any

from dojo_setup.generators.interaction import generate_volunteer_interaction
from dojo_setup.generators.names import generate_name
from dojo_setup.generators.portrait import generate_portrait_url
from dojo_setup.generators.profile import GENDERS, PRONOUNS, example_email
from dojo_setup.generators.randomness import chance, fake, weighted

# Mostly Dutch, with international colleagues and graduates who came back to mentor
NAME_ORIGINS = {"dutch": 45, "english": 15, "arabic": 10, "turkish": 10, "spanish": 10, "ukrainian": 5, "russian": 5}
STATUSES = {"active": 50, "paused": 5, "stopped": 45}
JOB_ROLES = [
    "Software Engineer",
    "Senior Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Mobile Developer",
    "Cloud Engineer",
    "DevOps Engineer",
    "Site Reliability Engineer",
    "Data Engineer",
    "Data Scientist",
    "Data Analyst",
    "QA Engineer",
    "Test Automation Engineer",
    "Security Engineer",
    "Software Architect",
    "Tech Lead",
    "Engineering Manager",
    "CTO",
    "Product Manager",
    "UX Designer",
    "Scrum Master",
    "Recruiter",
    "HR Business Partner",
    "Career Coach",
    "English Teacher",
]


@dataclass(frozen=True)
class GeneratedVolunteer:
    profile: dict[str, Any]
    portrait_url: str
    interactions: list[dict[str, Any]]

    @property
    def name(self) -> str:
        return f"{self.profile['firstName']} {self.profile['lastName']}"


def generate_volunteer() -> GeneratedVolunteer:
    gender = weighted(GENDERS)
    first_name, last_name = generate_name(weighted(NAME_ORIGINS), gender)
    return GeneratedVolunteer(
        profile={
            "firstName": first_name,
            "lastName": last_name,
            "gender": gender,
            "pronouns": PRONOUNS[gender],
            "companyName": fake.company() if chance(0.8) else None,
            "jobRole": fake.random_element(JOB_ROLES) if chance(0.9) else None,
            "email": example_email(first_name, last_name),
            "phone": fake.numerify("+316########") if chance(0.7) else None,
            # The same placeholders as the trainees have, so the links never lead to a real person
            "githubHandle": "HackYourFuture" if chance(0.5) else None,
            "slackId": "USLACKBOT" if chance(0.8) else None,
            "linkedinUrl": "https://www.linkedin.com/school/hackyourfuture/" if chance(0.7) else None,
            "status": weighted(STATUSES),
            "notes": "🤖 Auto generated dummy data for testing",
        },
        portrait_url=generate_portrait_url(gender),
        interactions=[generate_volunteer_interaction() for _ in range(fake.random_int(0, 10))],
    )
