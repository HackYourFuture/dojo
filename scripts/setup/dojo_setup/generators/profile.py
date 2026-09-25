"""Generates the trainee profile: the payload that creates a trainee."""

import re
import unicodedata
from datetime import date, timedelta
from typing import Any

from dojo_setup.config import REFERENCE_DATE
from dojo_setup.data import CITIES, COUNTRIES, EDUCATION_BACKGROUNDS, NICKNAMES
from dojo_setup.generators.names import generate_name, random_name_origin
from dojo_setup.generators.randomness import YEAR, chance, date_after, date_before, fake, weighted

GENDERS = {"man": 50, "woman": 50, "non-binary": 1}
PRONOUNS = {"man": "He/him", "woman": "She/her", "non-binary": "They/them"}
LEARNING_STATUSES = {"studying": 30, "graduated": 60, "on-hold": 1, "quit": 10}
ENGLISH_LEVELS = ["good", "needs-work"]
BACKGROUNDS = ["refugee", "family-reunification", "partner-of-skilled-migrant", "vulnerable-group", "eu-citizen"]
FINANCIAL_SUPPORT = ["side-job", "uitkering", "family", "savings", "none"]
EDUCATION_LEVELS = ["none", "high-school", "diploma", "bachelors-degree", "masters-degree", "phd"]
DIETARY_PREFERENCES = ["Vegetarian", "Vegan", "Halal", "No dairy"]
HEALTH_CONDITIONS = ["None", "Allergies", "Chronic illness", "Disability"]
EMERGENCY_CONTACT_RELATIONSHIPS = ["Parent", "Sibling", "Spouse", "Friend", "Other"]
TRACKS = ["frontend", "backend", "cloud", "tester", "data", "core-program"]
QUIT_REASONS = ["technical", "social-skills", "personal", "withdrawn", "municipality-or-monetary", "left-nl", "other"]
JOB_PATHS = ["searching", "internship", "tech-job", "non-tech-job", "other-studies", "support-ended"]
# Reserved for documentation, so the generated addresses never belong to anyone
EMAIL_DOMAINS = ["example.com", "example.net", "example.org"]


def generate_profile() -> dict[str, Any]:
    gender = weighted(GENDERS)
    name_origin = random_name_origin()
    first_name, last_name = generate_name(name_origin, gender)
    return {
        **_personal_info(gender, first_name, last_name),
        **_contact_info(first_name, last_name, name_origin),
        **_program_info(),
    }


def _personal_info(gender: str, first_name: str, last_name: str) -> dict[str, Any]:
    first_permit_issue_date = date_before(10 * YEAR)
    return {
        "firstName": first_name,
        "lastName": last_name,
        "preferredName": fake.random_element(NICKNAMES) if chance(0.05) else None,
        "gender": gender,
        "pronouns": PRONOUNS[gender],
        "dateOfBirth": _date_of_birth(min_age=18, max_age=60),
        "location": fake.random_element(CITIES),
        "englishLevel": fake.random_element(ENGLISH_LEVELS),
        "professionalDutch": chance(0.05),
        "countryOfOrigin": fake.random_element(COUNTRIES),
        "background": fake.random_element(BACKGROUNDS),
        "firstPermitIssueDate": first_permit_issue_date,
        "nlArrivalDate": date_before(2 * YEAR, first_permit_issue_date),
        "financialSupport": fake.random_element(FINANCIAL_SUPPORT),
        "educationLevel": fake.random_element(EDUCATION_LEVELS),
        "educationBackground": fake.random_element(EDUCATION_BACKGROUNDS),
        "weeklyWorkHours": fake.random_int(0, 24),
        "dietaryPreference": fake.random_element(DIETARY_PREFERENCES) if chance(0.1) else None,
        "healthCondition": fake.random_element(HEALTH_CONDITIONS) if chance(0.005) else None,
        "comments": "🤖 Auto generated dummy data for testing",
        "esfId": fake.numerify("ESF-########"),
    }


def _contact_info(first_name: str, last_name: str, name_origin: str) -> dict[str, Any]:
    # A relative or friend, with a name from the same background as the trainee
    emergency_contact_name = " ".join(generate_name(name_origin, weighted({"man": 1, "woman": 1})))
    return {
        "email": _example_email(first_name, last_name),
        "slackId": "USLACKBOT",
        "phone": _phone_number(),
        "githubHandle": "HackYourFuture",
        "linkedinUrl": "https://www.linkedin.com/school/hackyourfuture/",
        "emergencyContactName": emergency_contact_name,
        "emergencyContactRelationship": fake.random_element(EMERGENCY_CONTACT_RELATIONSHIPS),
        "emergencyContactPhone": _phone_number(),
    }


def _program_info() -> dict[str, Any]:
    current_cohort = fake.random_int(0, 60)
    start_cohort = max(0, current_cohort - fake.random_int(1, 3)) if chance(0.02) else current_cohort
    if chance(0.003):
        current_cohort = None

    start_date = date_before(10 * YEAR)
    learning_status = weighted(LEARNING_STATUSES)
    has_quit = learning_status == "quit"
    has_graduated = learning_status == "graduated"
    graduation_date = date_after(YEAR, start_date) if has_graduated else None

    return {
        "startCohort": start_cohort,
        "currentCohort": current_cohort,
        "startDate": start_date,
        "learningStatus": learning_status,
        "track": fake.random_element(TRACKS),
        "quitReason": fake.random_element(QUIT_REASONS) if has_quit else None,
        # The API rejects quit dates in the future
        "quitDate": min(date_after(120, start_date), REFERENCE_DATE) if has_quit else None,
        "graduationDate": graduation_date,
        "jobPath": fake.random_element(JOB_PATHS) if has_graduated else "not-graduated",
        "jobSupportEndDate": date_after(YEAR, graduation_date) if has_graduated else None,
        "hasCar": chance(0.01),
    }


def _date_of_birth(min_age: int, max_age: int) -> date:
    youngest = REFERENCE_DATE - timedelta(days=min_age * YEAR)
    return date_before((max_age - min_age) * YEAR, youngest)


def _example_email(first_name: str, last_name: str) -> str:
    user = ".".join(part for part in (_to_ascii(first_name), _to_ascii(last_name)) if part)
    return f"{user}{fake.random_int(1, 99)}@{fake.random_element(EMAIL_DOMAINS)}"


def _to_ascii(text: str) -> str:
    """Keeps only plain letters and digits, without accents, e.g. 'El Amrani' -> 'elamrani' and 'Şama' -> 'sama'."""
    # The Turkish dotless ı has no decomposed form, so it's replaced by hand
    decomposed = unicodedata.normalize("NFKD", text.lower().replace("ı", "i"))
    return re.sub(r"[^a-z0-9]", "", decomposed)


def _phone_number() -> str:
    return fake.numerify("+316########")
