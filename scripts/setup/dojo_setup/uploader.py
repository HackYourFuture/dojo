"""Sends generated trainees, volunteers and organisations to the Dojo API and keeps count of what was created."""

from collections.abc import Callable
from dataclasses import dataclass, field
from functools import cache
from typing import Any

from dojo_setup.api import ApiError, DojoApi, download_image
from dojo_setup.generators import GeneratedOrganisation, GeneratedTrainee, GeneratedVolunteer


@dataclass
class UploadReport:
    trainees: int = 0
    trainee_pictures: int = 0
    assessments: int = 0
    trainee_interactions: int = 0
    employment_history: int = 0
    volunteers: int = 0
    volunteer_pictures: int = 0
    volunteer_interactions: int = 0
    organisations: int = 0
    logos: int = 0
    contact_persons: int = 0
    organisation_interactions: int = 0
    errors: list[str] = field(default_factory=list)


def upload_trainee(api: DojoApi, trainee: GeneratedTrainee, report: UploadReport) -> None:
    """Creates the trainee with its picture and records. Rejected requests are added to the report."""
    try:
        trainee_id = api.create_trainee(trainee.profile)
    except ApiError as error:
        report.errors.append(f"Trainee {trainee.name} was not created. {error}")
        return
    report.trainees += 1

    try:
        api.set_trainee_picture(trainee_id, _download_portrait(trainee.portrait_url))
        report.trainee_pictures += 1
    except ApiError as error:
        report.errors.append(f"Picture of {trainee.name} was not set. {error}")

    report.assessments += _add_all(api.add_assessment, trainee_id, trainee.name, trainee.assessments, report)
    report.trainee_interactions += _add_all(
        api.add_trainee_interaction, trainee_id, trainee.name, trainee.interactions, report
    )
    report.employment_history += _add_all(
        api.add_employment_history, trainee_id, trainee.name, trainee.employment_history, report
    )


def upload_volunteer(api: DojoApi, volunteer: GeneratedVolunteer, report: UploadReport) -> None:
    """Creates the volunteer with its picture and interactions. Rejected requests are added to the report."""
    try:
        volunteer_id = api.create_volunteer(volunteer.profile)
    except ApiError as error:
        report.errors.append(f"Volunteer {volunteer.name} was not created. {error}")
        return
    report.volunteers += 1

    try:
        api.set_volunteer_picture(volunteer_id, _download_portrait(volunteer.portrait_url))
        report.volunteer_pictures += 1
    except ApiError as error:
        report.errors.append(f"Picture of {volunteer.name} was not set. {error}")

    report.volunteer_interactions += _add_all(
        api.add_volunteer_interaction, volunteer_id, volunteer.name, volunteer.interactions, report
    )


def upload_organisation(api: DojoApi, organisation: GeneratedOrganisation, report: UploadReport) -> None:
    """Creates the organisation with its logo and records. Rejected requests are added to the report."""
    try:
        organisation_id = api.create_organisation(organisation.details)
    except ApiError as error:
        report.errors.append(f"Organisation {organisation.name} was not created. {error}")
        return
    report.organisations += 1

    try:
        api.set_organisation_logo(organisation_id, organisation.logo)
        report.logos += 1
    except ApiError as error:
        report.errors.append(f"Logo of {organisation.name} was not set. {error}")

    report.contact_persons += _add_all(
        api.add_contact_person, organisation_id, organisation.name, organisation.contact_persons, report
    )
    report.organisation_interactions += _add_all(
        api.add_organisation_interaction, organisation_id, organisation.name, organisation.interactions, report
    )


def _add_all(
    add: Callable[[str, dict[str, Any]], None],
    owner_id: str,
    owner_name: str,
    records: list[dict[str, Any]],
    report: UploadReport,
) -> int:
    """Adds each record to its trainee, volunteer or organisation and returns how many were accepted."""
    added = 0
    for record in records:
        try:
            add(owner_id, record)
            added += 1
        except ApiError as error:
            report.errors.append(f"Record of {owner_name} was not added. {error}")
    return added


@cache
def _download_portrait(url: str) -> bytes:
    # There are only 200 portraits, so each one is downloaded once
    return download_image(url)
