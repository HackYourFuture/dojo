"""Seeded generators for dummy Dojo data. They only create data and never talk to the API."""

from dojo_setup.generators.organisation import GeneratedOrganisation, generate_organisation
from dojo_setup.generators.trainee import GeneratedTrainee, generate_trainee
from dojo_setup.generators.volunteer import GeneratedVolunteer, generate_volunteer

__all__ = [
    "GeneratedOrganisation",
    "GeneratedTrainee",
    "GeneratedVolunteer",
    "generate_organisation",
    "generate_trainee",
    "generate_volunteer",
]
