"""Generates a complete partner organisation: its details, logo, contact persons and interactions."""

from dataclasses import dataclass
from typing import Any

from dojo_setup.data import CITIES
from dojo_setup.generators.contact_person import generate_contact_person
from dojo_setup.generators.interaction import generate_organisation_interaction
from dojo_setup.generators.randomness import chance, fake, localized, weighted
from dojo_setup.generators.transliteration import to_slug

STATUSES = {"active": 50, "inactive": 20, "never-engaged": 30}
PARTNERSHIP_TYPES = ["volunteer", "funding", "employment", "events"]
# Faker's Dutch company() also picks from a list of real companies, so only its made-up formats are used
DUTCH_COMPANY_FORMATS = [
    "{{last_name}} {{company_suffix}}",
    "{{last_name}} & {{last_name}}",
    "{{company_prefix}} {{last_name}}",
]

_dutch = localized("nl_NL")


@dataclass(frozen=True)
class GeneratedOrganisation:
    details: dict[str, Any]
    logo: bytes
    contact_persons: list[dict[str, Any]]
    interactions: list[dict[str, Any]]

    @property
    def name(self) -> str:
        return self.details["name"]


def generate_organisation(staff_ids: list[str]) -> GeneratedOrganisation:
    """An organisation with up to two of the given users as its responsibles, the primary first."""
    name = _company_name()
    slug = to_slug(name)
    # Subdomains of example.com, so the links never lead to a real company
    domain = f"{slug}.example.com"
    return GeneratedOrganisation(
        details={
            "name": name,
            "websiteUrl": f"https://{domain}" if chance(0.9) else None,
            "linkedinUrl": f"https://www.linkedin.com/company/{slug}" if chance(0.7) else None,
            "location": fake.random_element(CITIES),
            "status": weighted(STATUSES),
            "partnershipTypes": fake.random_sample(PARTNERSHIP_TYPES, length=fake.random_int(0, 3)),
            "responsibleIds": fake.random_sample(staff_ids, length=fake.random_int(0, min(2, len(staff_ids)))),
            "notes": "🤖 Auto generated dummy data for testing",
        },
        # Faker draws a random polygon on a coloured background, which makes a decent abstract logo
        logo=fake.image(size=(256, 256), image_format="png"),
        contact_persons=[generate_contact_person(domain) for _ in range(fake.random_int(0, 3))],
        interactions=[generate_organisation_interaction() for _ in range(fake.random_int(0, 5))],
    )


def _company_name() -> str:
    if chance(0.5):
        return _dutch.parse(fake.random_element(DUTCH_COMPANY_FORMATS))
    return fake.company()
