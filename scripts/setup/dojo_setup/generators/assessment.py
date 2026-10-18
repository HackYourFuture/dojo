from typing import Any

from dojo_setup.generators.randomness import YEAR, chance, date_after, fake, weighted

ASSESSMENT_TYPES = [
    "FINAL_PROJECT_INTERVIEW",
    "CORE_MID_TERM_INTERVIEW",
    "CORE_END_INTERVIEW",
    "FRONTEND_MID_TERM_INTERVIEW",
    "BACKEND_MID_TERM_INTERVIEW",
    "CLOUD_MID_TERM_INTERVIEW",
    "DATA_MID_TERM_INTERVIEW",
    "TESTER_MID_TERM_INTERVIEW",
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
        return "DISQUALIFIED"
    if score is None:
        return fake.random_element(["FAILED", "PASSED_WITH_WARNING", "PASSED"])
    if score < 6:
        return "FAILED"
    if score < 7:
        return "PASSED_WITH_WARNING"
    return "PASSED"
