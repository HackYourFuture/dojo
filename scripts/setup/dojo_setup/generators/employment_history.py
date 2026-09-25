from typing import Any

from dojo_setup.generators.randomness import YEAR, chance, date_after, fake, weighted

# Only graduates on these job paths get an employment history
EMPLOYED_JOB_PATHS = ["internship", "tech-job", "non-tech-job"]
TECH_ROLES = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Cloud Engineer",
    "DevOps Engineer",
    "Data Analyst",
    "Data Engineer",
    "QA Engineer",
    "Test Automation Engineer",
    "IT Support Specialist",
]
NON_TECH_ROLES = [
    "Customer Service Representative",
    "Sales Associate",
    "Warehouse Worker",
    "Delivery Driver",
    "Administrative Assistant",
    "Project Coordinator",
]


def generate_employment(trainee: dict[str, Any]) -> dict[str, Any]:
    employment_type = _employment_type(trainee["jobPath"])
    is_non_tech_job = trainee["jobPath"] == "non-tech-job" and employment_type == "job"
    role = fake.random_element(NON_TECH_ROLES if is_non_tech_job else TECH_ROLES)
    start_date = date_after(YEAR, trainee["graduationDate"])
    fee_collected = chance(0.3)

    return {
        "type": employment_type,
        "companyName": fake.company(),
        "role": f"{role} Intern" if employment_type == "internship" else role,
        "startDate": start_date,
        "endDate": None if chance(0.5) else date_after(2 * YEAR, start_date),
        "feeCollected": fee_collected,
        "feeAmount": fake.random_int(5, 30) * 100 if fee_collected else None,
        "comments": "",
    }


def _employment_type(job_path: str) -> str:
    if job_path == "internship":
        return "internship"
    return weighted({"job": 80, "internship": 20})
