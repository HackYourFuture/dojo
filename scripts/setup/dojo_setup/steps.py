"""The setup steps, in the order main.py runs them. Each step prints its own progress."""

from itertools import count

from rich.panel import Panel
from rich.progress import BarColumn, MofNCompleteColumn, Progress, SpinnerColumn, TextColumn, TimeRemainingColumn
from rich.prompt import Confirm, IntPrompt
from rich.table import Table

from dojo_setup import database, output
from dojo_setup.api import DojoApi
from dojo_setup.config import (
    DEFAULT_TRAINEE_COUNT,
    ENV_FILE,
    SEED,
    TEST_USER_API_TOKEN,
    TEST_USER_EMAIL,
    Config,
    load_config,
)
from dojo_setup.errors import SetupCancelled
from dojo_setup.generators import generate_trainee
from dojo_setup.uploader import UploadReport, upload_trainee

TOTAL_STEPS = 6
_step_numbers = count(1)


def _start_step(title: str) -> None:
    output.step(next(_step_numbers), TOTAL_STEPS, title)


def welcome() -> None:
    output.console.print(
        Panel.fit(
            "Fills your local Dojo database with dummy data for development and testing.\n"
            "Before you start, make sure PostgreSQL and the Dojo API server are running.",
            title="[bold]🛠️  Dojo Database Setup",
            border_style="cyan",
            padding=(1, 2),
        )
    )


def load_configuration() -> Config:
    _start_step("Configuration")
    config = load_config()
    output.success(f"Loaded settings from {ENV_FILE}")

    table = Table(show_header=False, box=None, padding=(0, 2))
    table.add_row("Database", f"postgresql://{config.db_host}:{config.db_port}/{config.db_name}")
    table.add_row("Database user", config.db_user)
    table.add_row("Dojo API", config.api_base_url)
    output.console.print(table)

    if not Confirm.ask("Are these settings correct?", default=True, console=output.console):
        raise SetupCancelled()
    return config


def prepare_database(config: Config) -> None:
    _start_step("Database")
    with database.connect(config) as connection:
        output.success(f"Connected to PostgreSQL as {config.db_user}")

        user_id, user_created = database.ensure_test_user(connection)
        if user_created:
            output.success(f"Created the test user {TEST_USER_EMAIL}")
        else:
            output.skipped(f"Test user {TEST_USER_EMAIL} already exists")

        token_created = database.ensure_api_token(connection, user_id)
        if token_created:
            output.success("Created the test user's API token")
        else:
            output.skipped("Test user's API token already exists")

        existing_trainees = database.count_trainees(connection)

    if existing_trainees:
        output.warning(
            f"The database already contains {existing_trainees} trainees. Every run generates the same "
            "trainees, so any left over from an earlier run will be rejected as duplicates."
        )
        if not Confirm.ask("Continue anyway?", default=False, console=output.console):
            raise SetupCancelled()


def connect_to_api(config: Config) -> DojoApi:
    _start_step("Dojo API")
    api = DojoApi(config.api_base_url, TEST_USER_API_TOKEN)
    api.check_connection()
    output.success(f"Connected to {config.api_base_url} as the test user")
    return api


def choose_trainee_count() -> int:
    _start_step("Options")
    output.info(f"Trainees are generated from seed {SEED}, so every run produces the same data.")
    while True:
        trainee_count = IntPrompt.ask(
            "How many trainees should be generated?", default=DEFAULT_TRAINEE_COUNT, console=output.console
        )
        if trainee_count > 0:
            break
        output.warning("Please enter a number greater than 0.")

    if not Confirm.ask(f"Generate {trainee_count} trainees now?", default=True, console=output.console):
        raise SetupCancelled()
    return trainee_count


def generate_trainees(api: DojoApi, trainee_count: int) -> UploadReport:
    _start_step("Trainees")
    report = UploadReport()
    progress = Progress(
        SpinnerColumn(),
        TextColumn("Generating trainees"),
        BarColumn(),
        MofNCompleteColumn(),
        TextColumn("·"),
        TimeRemainingColumn(),
        console=output.console,
    )
    with progress:
        for _ in progress.track(range(trainee_count)):
            errors_before = len(report.errors)
            upload_trainee(api, generate_trainee(), report)
            for error in report.errors[errors_before:]:
                output.warning(error)

    output.success(f"Created {report.trainees} of {trainee_count} trainees")
    return report


def show_summary(report: UploadReport) -> None:
    _start_step("Summary")
    table = Table(show_header=False, box=None, padding=(0, 2))
    table.add_row("Trainees", str(report.trainees))
    table.add_row("Profile pictures", str(report.pictures))
    table.add_row("Assessments", str(report.assessments))
    table.add_row("Interactions", str(report.interactions))
    table.add_row("Employment records", str(report.employment_history))
    output.console.print(table)

    if report.errors:
        output.warning(f"{len(report.errors)} requests were rejected, see the warnings above.")
    output.success(
        f"[bold]Done. You are ready to go![/] Use the API token [bold]{TEST_USER_API_TOKEN}[/] to call the API."
    )
