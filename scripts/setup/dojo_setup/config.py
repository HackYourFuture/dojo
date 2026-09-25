import os
from dataclasses import dataclass
from datetime import date
from pathlib import Path

from dotenv import load_dotenv

from dojo_setup.errors import SetupError

ENV_FILE = Path(__file__).resolve().parent.parent / ".env"

# Generated data
SEED = 422841832
# Acts as "today" for all generated dates, so every run produces the same data. Must not be in the future.
REFERENCE_DATE = date(2026, 9, 1)
DEFAULT_TRAINEE_COUNT = 500

# The user the script authenticates as. Created in the database if missing.
TEST_USER_NAME = "Dojo Test"
TEST_USER_EMAIL = "dojo.hyf.test@gmail.com"
TEST_USER_API_TOKEN = "DOJOTEST"


@dataclass(frozen=True)
class Config:
    db_host: str
    db_port: int
    db_user: str
    db_password: str
    db_name: str
    api_base_url: str


def load_config() -> Config:
    """Reads the settings from the .env file. Variables already set in the environment take precedence."""
    if not ENV_FILE.exists():
        raise SetupError(
            f".env file not found at {ENV_FILE}",
            hint="Copy .env.example to .env and adjust the values to your environment.",
        )
    load_dotenv(ENV_FILE)

    required = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME", "API_BASE_URL"]
    missing = [name for name in required if not os.environ.get(name)]
    if missing:
        raise SetupError(
            f"Missing settings in .env: {', '.join(missing)}",
            hint="Use .env.example as a reference.",
        )

    if not os.environ["DB_PORT"].isdigit():
        raise SetupError(f"DB_PORT must be a number, got '{os.environ['DB_PORT']}'")

    return Config(
        db_host=os.environ["DB_HOST"],
        db_port=int(os.environ["DB_PORT"]),
        db_user=os.environ["DB_USER"],
        db_password=os.environ["DB_PASSWORD"],
        db_name=os.environ["DB_NAME"],
        api_base_url=os.environ["API_BASE_URL"].rstrip("/"),
    )
