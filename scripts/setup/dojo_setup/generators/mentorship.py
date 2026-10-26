"""Generates a mentorship between a volunteer and a trainee, with its check-ins."""

from dataclasses import dataclass
from typing import Any

from dojo_setup.config import REFERENCE_DATE
from dojo_setup.generators.checkin import CHECKIN_INTERVAL, generate_checkins
from dojo_setup.generators.randomness import YEAR, chance, date_after, date_before, fake

MENTORSHIP_TYPES = ["TECH_MENTORSHIP", "ENGLISH_MENTORSHIP", "HR_MENTORSHIP"]


@dataclass(frozen=True)
class GeneratedMentorship:
    details: dict[str, Any]
    checkins: list[dict[str, Any]]


def generate_mentorship(volunteer: dict[str, Any], trainee_id: str) -> GeneratedMentorship:
    """The volunteer's id is only known once it is created, so the uploader adds it to the payload."""
    start_date = date_before(2 * YEAR)
    # Only an active volunteer can still be mentoring
    is_ongoing = volunteer["status"] == "ACTIVE" and chance(0.5)
    end_date = None if is_ongoing else min(date_after(YEAR // 2, start_date), REFERENCE_DATE)
    # Most ongoing mentorships keep checking in. The rest fell behind, so their next check-in is overdue.
    checked_in_until = end_date or (REFERENCE_DATE if chance(0.8) else date_before(YEAR))
    checkins = generate_checkins(start_date, checked_in_until)
    # An ongoing mentorship plans the next check-in four weeks after the last one, or after the start
    next_checkin_date = None
    if is_ongoing:
        last_checkin_date = checkins[-1]["date"] if checkins else start_date
        next_checkin_date = last_checkin_date + CHECKIN_INTERVAL
    # One of the volunteer's mentorship preferences, or any type when they have none
    preferred_types = [role for role in volunteer["rolePreferences"] if role in MENTORSHIP_TYPES]
    details = {
        "traineeId": trainee_id,
        "type": fake.random_element(preferred_types or MENTORSHIP_TYPES),
        "startDate": start_date,
        "endDate": end_date,
        "nextCheckinDate": next_checkin_date,
    }
    return GeneratedMentorship(details=details, checkins=checkins)
