"""Generates a mentorship between a volunteer and a trainee."""

from datetime import timedelta
from typing import Any

from dojo_setup.config import REFERENCE_DATE
from dojo_setup.generators.randomness import YEAR, chance, date_after, date_before, fake

MENTORSHIP_TYPES = ["TECH_MENTORSHIP", "ENGLISH_MENTORSHIP", "HR_MENTORSHIP"]
CHECKIN_INTERVAL = timedelta(weeks=4)


def generate_mentorship(volunteer: dict[str, Any], trainee_id: str) -> dict[str, Any]:
    """The volunteer's id is only known once it is created, so the uploader adds it to the payload."""
    start_date = date_before(2 * YEAR)
    # Only an active volunteer can still be mentoring
    is_ongoing = volunteer["status"] == "ACTIVE" and chance(0.5)
    end_date = None if is_ongoing else min(date_after(YEAR // 2, start_date), REFERENCE_DATE)
    # An ongoing mentorship plans its next check-in four weeks after the last one. Most checked in within the
    # last four weeks; the rest fell behind, so their next check-in is overdue. Check-ins themselves are not
    # recorded yet, so the last one is only used here.
    next_checkin_date = None
    if is_ongoing:
        last_checkin_date = max(date_before(28 if chance(0.8) else YEAR), start_date)
        next_checkin_date = last_checkin_date + CHECKIN_INTERVAL
    # One of the volunteer's mentorship preferences, or any type when they have none
    preferred_types = [role for role in volunteer["rolePreferences"] if role in MENTORSHIP_TYPES]
    return {
        "traineeId": trainee_id,
        "type": fake.random_element(preferred_types or MENTORSHIP_TYPES),
        "startDate": start_date,
        "endDate": end_date,
        "nextCheckinDate": next_checkin_date,
    }
