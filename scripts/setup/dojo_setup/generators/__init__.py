"""Seeded generators for dummy Dojo data. They only create data and never talk to the API."""

from dojo_setup.generators.organisation import GeneratedOrganisation, generate_organisation
from dojo_setup.generators.trainee import GeneratedTrainee, generate_trainee

__all__ = ["GeneratedOrganisation", "GeneratedTrainee", "generate_organisation", "generate_trainee"]
