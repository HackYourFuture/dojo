from dojo_setup.generators.randomness import fake

# The same portrait collection faker.js uses: 100 photos per sex
PORTRAIT_URL = "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/{sex}/512/{number}.jpg"
PORTRAIT_SEXES = {"man": "male", "woman": "female"}


def generate_portrait_url(gender: str) -> str:
    sex = PORTRAIT_SEXES.get(gender) or fake.random_element(["male", "female"])
    return PORTRAIT_URL.format(sex=sex, number=fake.random_int(0, 99))
