"""Dojo database setup.

Fills a local Dojo environment with reproducible dummy data: a test user with an API token, and
trainees with profile pictures, assessments, interactions and employment history.

Usage: python main.py
"""

import sys

from dojo_setup import output, steps
from dojo_setup.errors import SetupCancelled, SetupError


def main() -> None:
    steps.welcome()
    config = steps.load_configuration()
    steps.prepare_database(config)
    api = steps.connect_to_api(config)
    trainee_count = steps.choose_trainee_count()
    report = steps.generate_trainees(api, trainee_count)
    steps.show_summary(report)


if __name__ == "__main__":
    try:
        main()
    except SetupError as error:
        output.error(error.message, error.hint)
        sys.exit(1)
    except SetupCancelled:
        output.info("Cancelled. No trainees were generated.")
    except KeyboardInterrupt:
        output.error("Setup interrupted.")
        sys.exit(130)
