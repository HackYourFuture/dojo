"""Static lists the generators pick values from, and the countries and cities the database step loads."""

import json
from pathlib import Path
from typing import Any

_DATA_DIR = Path(__file__).resolve().parent
_GEO_DATA_DIR = _DATA_DIR.parent / "geo-data"


def _load(file_name: str, directory: Path = _DATA_DIR) -> Any:
    with open(directory / file_name, encoding="utf-8") as file:
        return json.load(file)


ARABIC_NAMES: dict[str, list[str]] = _load("arabic_names.json")
CITIES: list[dict[str, Any]] = _load("nl-cities.json", _GEO_DATA_DIR)
COUNTRIES: list[dict[str, str]] = _load("countries.json", _GEO_DATA_DIR)
EDUCATION_BACKGROUNDS: list[str] = _load("education_backgrounds.json")
NICKNAMES: list[str] = _load("nicknames.json")
ORGANISATION_INTERACTIONS: list[dict[str, str]] = _load("organisation_interactions.json")
TRAINEE_INTERACTIONS: list[dict[str, str]] = _load("trainee_interactions.json")
VOLUNTEER_INTERACTIONS: list[dict[str, str]] = _load("volunteer_interactions.json")
