from typing import Any

from dojo_setup.generators.names import generate_name
from dojo_setup.generators.randomness import chance, fake, weighted
from dojo_setup.generators.transliteration import to_ascii, to_slug

# Mostly Dutch, since most partners are Dutch companies
NAME_ORIGINS = {"dutch": 60, "english": 15, "turkish": 10, "arabic": 10, "spanish": 5}
JOB_TITLES = [
    "Talent Acquisition Lead",
    "Recruiter",
    "Technical Recruiter",
    "HR Manager",
    "HR Business Partner",
    "Head of People",
    "Engineering Manager",
    "Tech Lead",
    "Head of Engineering",
    "CTO",
    "Founder",
    "Operations Manager",
    "Diversity & Inclusion Lead",
    "Learning & Development Specialist",
    "Office Manager",
]


def generate_contact_person(email_domain: str) -> dict[str, Any]:
    first_name, last_name = generate_name(weighted(NAME_ORIGINS), weighted({"man": 1, "woman": 1}))
    full_name = f"{first_name} {last_name}"
    return {
        "name": full_name,
        "email": f"{to_ascii(first_name)}.{to_ascii(last_name)}@{email_domain}" if chance(0.8) else None,
        "phone": fake.numerify("+316########") if chance(0.6) else None,
        "linkedinUrl": f"https://www.linkedin.com/in/{to_slug(full_name)}" if chance(0.5) else None,
        "jobTitle": fake.random_element(JOB_TITLES),
        "notes": None,
    }
