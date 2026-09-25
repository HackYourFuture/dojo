"""Static lists the generators pick values from."""

import json
from pathlib import Path
from typing import Any

_DATA_DIR = Path(__file__).resolve().parent


def _load(file_name: str) -> Any:
    with open(_DATA_DIR / file_name, encoding="utf-8") as file:
        return json.load(file)


ARABIC_NAMES: dict[str, list[str]] = _load("arabic_names.json")
CITIES: list[str] = _load("cities.json")
COUNTRIES: list[str] = _load("countries.json")
EDUCATION_BACKGROUNDS: list[str] = _load("education_backgrounds.json")
INTERACTIONS: list[dict[str, str]] = _load("interactions.json")
NICKNAMES: list[str] = _load("nicknames.json")
