"""A small client for the Dojo REST API."""

import json
from datetime import UTC, date, datetime
from typing import Any

import requests

from dojo_setup.errors import SetupError

Payload = dict[str, Any]


class ApiError(Exception):
    """A request that the Dojo API rejected."""


class DojoApi:
    def __init__(self, base_url: str, token: str):
        self.base_url = base_url
        self._session = requests.Session()
        self._session.headers["Authorization"] = f"Bearer {token}"

    def check_connection(self) -> None:
        """Fails with a SetupError if the token is not accepted."""
        response = self._request("GET", "/auth/session")
        if not response.ok:
            raise SetupError(
                f"The Dojo API did not accept the test user token (HTTP {response.status_code})",
                hint="Check that the server uses the same database as this script.",
            )

    def create_trainee(self, trainee: Payload) -> str:
        """Creates the trainee and returns its id."""
        return self._post("/trainees", trainee)["id"]

    def set_picture(self, trainee_id: str, image: bytes) -> None:
        files = {"picture": ("portrait.jpg", image, "image/jpeg")}
        _raise_for_status(self._request("PUT", f"/trainees/{trainee_id}/picture", files=files))

    def add_assessment(self, trainee_id: str, assessment: Payload) -> None:
        self._post(f"/trainees/{trainee_id}/assessments", assessment)

    def add_interaction(self, trainee_id: str, interaction: Payload) -> None:
        self._post(f"/trainees/{trainee_id}/interactions", interaction)

    def add_employment_history(self, trainee_id: str, employment: Payload) -> None:
        self._post(f"/trainees/{trainee_id}/employment-history", employment)

    def _post(self, path: str, payload: Payload) -> Payload:
        response = self._request(
            "POST",
            path,
            data=json.dumps(payload, default=_to_json),
            headers={"Content-Type": "application/json"},
        )
        _raise_for_status(response)
        return response.json()

    def _request(self, method: str, path: str, **kwargs: Any) -> requests.Response:
        try:
            return self._session.request(method, f"{self.base_url}{path}", timeout=30, **kwargs)
        except requests.ConnectionError as error:
            raise SetupError(
                f"Could not connect to the Dojo API at {self.base_url}",
                hint="Make sure the Dojo server is running and API_BASE_URL in .env is correct.",
            ) from error


def download_image(url: str) -> bytes:
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
    except requests.RequestException as error:
        raise ApiError(f"Could not download {url}: {error}") from error
    return response.content


def _raise_for_status(response: requests.Response) -> None:
    if response.ok:
        return
    try:
        message = response.json()["error"]
    except (ValueError, KeyError):
        message = response.text or response.reason
    # Servers in development mode append a long stack trace we don't need here
    message = message.split(" 🐞 DEBUG INFO")[0]
    raise ApiError(f"HTTP {response.status_code}: {message}")


def _to_json(value: Any) -> str:
    # Instants are sent in UTC with a Z suffix, local dates as yyyy-MM-dd
    if isinstance(value, datetime):
        return value.astimezone(UTC).isoformat().replace("+00:00", "Z")
    if isinstance(value, date):
        return value.isoformat()
    raise TypeError(f"Cannot serialize {type(value).__name__} to JSON")
