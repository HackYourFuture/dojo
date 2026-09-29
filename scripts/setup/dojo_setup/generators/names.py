"""Names from backgrounds common among HackYourFuture trainees and partners, all in Latin letters.

They include characters like ç, ş, ğ, ı, é, ñ and ï, as well as hyphens, apostrophes and spaces,
to test how the app handles them.
"""

from faker import Faker

from dojo_setup.data import ARABIC_NAMES
from dojo_setup.generators.randomness import fake, localized
from dojo_setup.generators.transliteration import to_latin

_LOCALES = {
    "turkish": "tr_TR",
    "ukrainian": "uk_UA",
    "spanish": "es_ES",
    "russian": "ru_RU",
    "english": "en_US",
    "dutch": "nl_NL",
}
_CYRILLIC_ORIGINS = {"russian", "ukrainian"}
# Characters besides letters that belong in names, e.g. 'Al-Sa'di' or 'El Amrani'
_NAME_PUNCTUATION = " -'"


_FAKERS = {origin: localized(locale) for origin, locale in _LOCALES.items()}


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

    locale_fake = _FAKERS[origin]
    first_name, last_name = _first_name(locale_fake, gender), _last_name(locale_fake, gender)
    if origin in _CYRILLIC_ORIGINS:
        return to_latin(first_name, origin), to_latin(last_name, origin)
    return first_name, last_name


def _is_clean(name: str) -> bool:
    return all(char.isalpha() or char in _NAME_PUNCTUATION for char in name)


def _first_name(locale_fake: Faker, gender: str) -> str:
    if gender == "man":
        return locale_fake.first_name_male()
    if gender == "woman":
        return locale_fake.first_name_female()
    return locale_fake.first_name_nonbinary()


def _last_name(locale_fake: Faker, gender: str) -> str:
    # Russian and some Ukrainian last names change with gender, e.g. Ivanov and Ivanova
    if gender == "man":
        return locale_fake.last_name_male()
    if gender == "woman":
        return locale_fake.last_name_female()
    return locale_fake.last_name()


def _arabic_name(gender: str) -> tuple[str, str]:
    if gender == "man":
        first_names = ARABIC_NAMES["male"]
    elif gender == "woman":
        first_names = ARABIC_NAMES["female"]
    else:
        first_names = ARABIC_NAMES["male"] + ARABIC_NAMES["female"]
    return fake.random_element(first_names), fake.random_element(ARABIC_NAMES["last"])
