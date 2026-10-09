"""Dojo database setup.

Fills a local Dojo environment with reproducible dummy data: a test user with an API token,
trainees with profile pictures, assessments, interactions and employment history, volunteers with
profile pictures and interactions, and partner organisations with logos, contact persons and
interactions. It also loads the countries and Dutch cities from dojo_setup/geo-data.

Usage: python main.py
"""

import sys

from dojo_setup import output, steps
from dojo_setup.errors import SetupCancelled, SetupError
from dojo_setup.uploader import UploadReport


def main() -> None:
    steps.welcome()
    config = steps.load_configuration()
    steps.prepare_database(config)
    api = steps.connect_to_api(config)
    trainee_count, volunteer_count, organisation_count = steps.choose_amounts()
    report = UploadReport()
    steps.generate_trainees(api, trainee_count, report)
    steps.generate_volunteers(api, volunteer_count, report)
    steps.generate_organisations(api, organisation_count, report)
    steps.show_summary(report)


if __name__ == "__main__":
    try:
        main()
    except SetupError as error:
        output.error(error.message, error.hint)
        sys.exit(1)
    except SetupCancelled:
        output.info("Cancelled. No data was generated.")
    except KeyboardInterrupt:
        output.error("Setup interrupted.")
        sys.exit(130)
