"""The single seeded Faker instance behind all generated data, plus a few helpers on top of it.

To keep runs reproducible, every random value must come from `fake`, and dates must be derived
from REFERENCE_DATE or from other generated dates, never from today.
"""

from collections import OrderedDict
from datetime import UTC, date, datetime, time, timedelta

from faker import Faker

from dojo_setup.config import REFERENCE_DATE, SEED

YEAR = 365

fake = Faker("en_US")
fake.seed_instance(SEED)


def chance(probability: float) -> bool:
    """True with the given probability, e.g. 0.05 for 5%."""
    return fake.random.random() < probability


def weighted[T](options: dict[T, int]) -> T:
    """Picks one of the keys, with the values as relative weights."""
    return fake.random_element(OrderedDict(options))


def date_before(days: int, ref: date = REFERENCE_DATE) -> date:
    """A random date within the given number of days before `ref`."""
    return fake.date_between_dates(ref - timedelta(days=days), ref)


def date_after(days: int, ref: date = REFERENCE_DATE) -> date:
    """A random date within the given number of days after `ref`."""
    return fake.date_between_dates(ref, ref + timedelta(days=days))


def datetime_after(days: int, ref: date) -> datetime:
    """A random UTC moment within the given number of days after `ref`."""
    start = datetime.combine(ref, time(), UTC)
    return fake.date_time_between_dates(start, start + timedelta(days=days), UTC)
