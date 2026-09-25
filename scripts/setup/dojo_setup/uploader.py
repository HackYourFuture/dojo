"""Sends generated trainees to the Dojo API and keeps count of what was created."""

from collections.abc import Callable
from dataclasses import dataclass, field
from functools import cache
from typing import Any

from dojo_setup.api import ApiError, DojoApi, download_image
from dojo_setup.generators import GeneratedTrainee


@dataclass
class UploadReport:
    trainees: int = 0
    pictures: int = 0
    assessments: int = 0
    interactions: int = 0
    employment_history: int = 0
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
        api.set_picture(trainee_id, _download_portrait(trainee.portrait_url))
        report.pictures += 1
    except ApiError as error:
        report.errors.append(f"Picture of {trainee.name} was not set. {error}")

    report.assessments += _add_all(api.add_assessment, trainee_id, trainee.assessments, report)
    report.interactions += _add_all(api.add_interaction, trainee_id, trainee.interactions, report)
    report.employment_history += _add_all(api.add_employment_history, trainee_id, trainee.employment_history, report)


def _add_all(
    add: Callable[[str, dict[str, Any]], None],
    trainee_id: str,
    records: list[dict[str, Any]],
    report: UploadReport,
) -> int:
    """Adds each record to the trainee and returns how many were accepted."""
    added = 0
    for record in records:
        try:
            add(trainee_id, record)
            added += 1
        except ApiError as error:
            report.errors.append(f"Record of trainee {trainee_id} was not added. {error}")
    return added


@cache
def _download_portrait(url: str) -> bytes:
    # There are only 200 portraits, so each one is downloaded once
    return download_image(url)
