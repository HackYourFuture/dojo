"""Generates a mentor pairing between a volunteer and a trainee."""

from datetime import timedelta
from typing import Any

from dojo_setup.config import REFERENCE_DATE
from dojo_setup.generators.randomness import YEAR, chance, date_after, date_before, fake

PAIRING_TYPES = ["TECH_MENTORSHIP", "ENGLISH_MENTORSHIP", "HR_MENTORSHIP"]
CHECKIN_INTERVAL = timedelta(weeks=4)


def generate_mentor_pairing(volunteer: dict[str, Any], trainee_id: str) -> dict[str, Any]:
    start_date = date_before(2 * YEAR)
    # Only an active volunteer can still be mentoring
    is_ongoing = volunteer["status"] == "ACTIVE" and chance(0.5)
    if is_ongoing:
        end_date = None
        # Most checked in within the last four weeks. The rest fell behind, so their next check-in is overdue.
        last_checkin_date = max(date_before(28 if chance(0.8) else YEAR), start_date)
    else:
        end_date = min(date_after(YEAR // 2, start_date), REFERENCE_DATE)
        last_checkin_date = fake.date_between_dates(start_date, end_date)
    if chance(0.1):
        # No check-in yet
        last_checkin_date = None
    # An ongoing pairing plans the next check-in four weeks after the last one, or after the start
    next_checkin_date = (last_checkin_date or start_date) + CHECKIN_INTERVAL if is_ongoing else None
    # One of the volunteer's mentorship preferences, or any type when they have none
    preferred_types = [role for role in volunteer["rolePreferences"] if role in PAIRING_TYPES]
    return {
        "traineeId": trainee_id,
        "type": fake.random_element(preferred_types or PAIRING_TYPES),
        "startDate": start_date,
        "lastCheckinDate": last_checkin_date,
        "endDate": end_date,
        "nextCheckinDate": next_checkin_date,
    }
