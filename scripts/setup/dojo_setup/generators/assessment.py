from typing import Any

from dojo_setup.generators.randomness import YEAR, chance, date_after, fake, weighted

ASSESSMENT_TYPES = [
    "final-project-interview",
    "core-mid-term-interview",
    "core-end-interview",
    "frontend-mid-term-interview",
    "backend-mid-term-interview",
    "cloud-mid-term-interview",
    "data-mid-term-interview",
    "tester-mid-term-interview",
]
# Upper bound of the score range (e.g. 8 means 7.0-8.0) and its weight. None means no score was given.
SCORE_WEIGHTS = {None: 10, 1: 1, 2: 2, 3: 2, 4: 5, 5: 10, 6: 15, 7: 20, 8: 30, 9: 20, 10: 10}


def generate_assessment(trainee: dict[str, Any]) -> dict[str, Any]:
    score = _score()
    return {
        "date": date_after(YEAR, trainee["startDate"]),
        "type": fake.random_element(ASSESSMENT_TYPES),
        "result": _result(score),
        "score": score,
        "comments": "",
    }


def _score() -> float | None:
    upper_bound = weighted(SCORE_WEIGHTS)
    if upper_bound is None:
        return None
    return round(fake.random.uniform(upper_bound - 1, upper_bound), 1)


def _result(score: float | None) -> str:
    if chance(0.01):
        return "disqualified"
    if score is None:
        return fake.random_element(["failed", "passed-with-warning", "passed"])
    if score < 6:
        return "failed"
    if score < 7:
        return "passed-with-warning"
    return "passed"
