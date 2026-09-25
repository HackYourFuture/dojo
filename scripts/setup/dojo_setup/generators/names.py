"""Names from backgrounds common among HackYourFuture trainees, all in Latin letters.

They include characters like ç, ş, ğ, ı, é, ñ and ï, as well as hyphens, apostrophes and spaces,
to test how the app handles them.
"""

from faker import Faker

from dojo_setup.data import ARABIC_NAMES
from dojo_setup.generators.randomness import fake, weighted
from dojo_setup.generators.transliteration import to_latin

# How often each background occurs among the generated trainees
NAME_ORIGINS = {"arabic": 30, "turkish": 20, "ukrainian": 15, "spanish": 15, "russian": 10, "english": 10}
_LOCALES = {"turkish": "tr_TR", "ukrainian": "uk_UA", "spanish": "es_ES", "russian": "ru_RU", "english": "en_US"}
_CYRILLIC_ORIGINS = {"russian", "ukrainian"}
# Characters besides letters that belong in names, e.g. 'Al-Sa'di' or 'El Amrani'
_NAME_PUNCTUATION = " -'"


def _localized_faker(locale: str) -> Faker:
    localized = Faker(locale)
    # Share the seeded random generator, so names are as reproducible as everything else
    localized.random = fake.random
    return localized


_FAKERS = {origin: _localized_faker(locale) for origin, locale in _LOCALES.items()}


def random_name_origin() -> str:
    return weighted(NAME_ORIGINS)


def generate_name(origin: str, gender: str) -> tuple[str, str]:
    """Returns a first and last name that fit the background and gender."""
    # Faker's Turkish data has a few broken entries like 'Emine.' and 'N˜zamett˜n', those are skipped
    while True:
        first_name, last_name = _any_name(origin, gender)
        if _is_clean(first_name) and _is_clean(last_name):
            return first_name, last_name


def _any_name(origin: str, gender: str) -> tuple[str, str]:
    if origin == "arabic":
        return _arabic_name(gender)

    localized = _FAKERS[origin]
    first_name, last_name = _first_name(localized, gender), _last_name(localized, gender)
    if origin in _CYRILLIC_ORIGINS:
        return to_latin(first_name, origin), to_latin(last_name, origin)
    return first_name, last_name


def _is_clean(name: str) -> bool:
    return all(char.isalpha() or char in _NAME_PUNCTUATION for char in name)


def _first_name(localized: Faker, gender: str) -> str:
    if gender == "man":
        return localized.first_name_male()
    if gender == "woman":
        return localized.first_name_female()
    return localized.first_name_nonbinary()


def _last_name(localized: Faker, gender: str) -> str:
    # Russian and some Ukrainian last names change with gender, e.g. Ivanov and Ivanova
    if gender == "man":
        return localized.last_name_male()
    if gender == "woman":
        return localized.last_name_female()
    return localized.last_name()


def _arabic_name(gender: str) -> tuple[str, str]:
    if gender == "man":
        first_names = ARABIC_NAMES["male"]
    elif gender == "woman":
        first_names = ARABIC_NAMES["female"]
    else:
        first_names = ARABIC_NAMES["male"] + ARABIC_NAMES["female"]
    return fake.random_element(first_names), fake.random_element(ARABIC_NAMES["last"])
