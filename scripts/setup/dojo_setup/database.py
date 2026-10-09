"""Direct database access, used to create the test user and its API token and to load the countries and cities."""

import hashlib
import secrets
import string
from collections.abc import Iterator
from contextlib import contextmanager
from datetime import datetime
from typing import Any

import psycopg

from dojo_setup.config import TEST_USER_API_TOKEN, TEST_USER_EMAIL, TEST_USER_NAME, Config
from dojo_setup.errors import SetupError
from dojo_setup.generators.transliteration import to_slug

TOKEN_EXPIRY = datetime(3000, 1, 1)


@contextmanager
def connect(config: Config) -> Iterator[psycopg.Connection]:
    """Opens a connection that commits when the block succeeds and rolls back when it fails."""
    try:
        connection = psycopg.connect(
            host=config.db_host,
            port=config.db_port,
            user=config.db_user,
            password=config.db_password,
            dbname=config.db_name,
            connect_timeout=5,
        )
    except psycopg.OperationalError as error:
        reason = str(error).splitlines()[0]
        raise SetupError(
            f"Could not connect to PostgreSQL at {config.db_host}:{config.db_port}/{config.db_name}",
            hint=f"Make sure the database is running and the credentials in .env are correct.\n  {reason}",
        ) from error

    with connection:
        yield connection


def ensure_test_user(connection: psycopg.Connection) -> tuple[str, bool]:
    """Returns the id of the test user and whether it had to be created."""
    row = connection.execute("SELECT id FROM users WHERE upper(email) = upper(%s)", (TEST_USER_EMAIL,)).fetchone()
    if row:
        return row[0], False

    user_id = _random_id()
    connection.execute(
        """
        INSERT INTO users (id, email, name, is_active, created_at, updated_at)
        VALUES (%s, %s, %s, TRUE, NOW(), NOW())
        """,
        (user_id, TEST_USER_EMAIL, TEST_USER_NAME),
    )
    return user_id, True


def ensure_api_token(connection: psycopg.Connection, user_id: str) -> bool:
    """Makes sure the test API token exists. Returns whether it had to be created."""
    token_hash = hashlib.sha256(TEST_USER_API_TOKEN.encode()).hexdigest()
    exists = connection.execute("SELECT 1 FROM tokens WHERE token_hash = %s", (token_hash,)).fetchone()
    if exists:
        return False

    connection.execute(
        """
        INSERT INTO tokens (id, type, token_hash, user_id, expires_at, created_at, updated_at)
        VALUES (%s, 'API_TOKEN', %s, %s, %s, NOW(), NOW())
        """,
        (_random_id(), token_hash, user_id, TOKEN_EXPIRY),
    )
    return True


def replace_countries(connection: psycopg.Connection, countries: list[dict[str, Any]]) -> None:
    connection.execute("DELETE FROM countries")
    connection.cursor().executemany(
        """
        INSERT INTO countries (id, name, alternative_names, population, flag, code)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        [
            (
                country["id"],
                country["name"],
                country["alternativeNames"],
                country["population"],
                country["flag"],
                country["code"],
            )
            for country in countries
        ],
    )


def replace_cities(connection: psycopg.Connection, cities: list[dict[str, Any]]) -> None:
    """The JSON has no ids, so a city's id is its unique name as a slug, e.g. hengelo-gelderland."""
    connection.execute("DELETE FROM cities")
    connection.cursor().executemany(
        """
        INSERT INTO cities (id, name, alternative_names, population, province, region, latitude, longitude,
                            distance_amsterdam)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        [
            (
                to_slug(city["name"]),
                city["name"],
                city["alternativeNames"],
                city["population"],
                city["province"],
                city["region"],
                city["coordinates"]["lat"],
                city["coordinates"]["lon"],
                city["distanceAmsterdam"],
            )
            for city in cities
        ],
    )


def count_trainees(connection: psycopg.Connection) -> int:
    return connection.execute("SELECT count(*) FROM trainees").fetchone()[0]


def count_volunteers(connection: psycopg.Connection) -> int:
    return connection.execute("SELECT count(*) FROM volunteers").fetchone()[0]


def count_organisations(connection: psycopg.Connection) -> int:
    return connection.execute("SELECT count(*) FROM organisations").fetchone()[0]


def _random_id() -> str:
    # Not using the seeded faker, so the database step never changes the generated data
    alphabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(10))
