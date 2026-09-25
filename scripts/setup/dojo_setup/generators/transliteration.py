"""Writes Russian and Ukrainian names in Latin letters, the way they usually appear in passports."""

_RUSSIAN = {
    "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "yo", "ж": "zh", "з": "z", "и": "i",
    "й": "y", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t",
    "у": "u", "ф": "f", "х": "kh", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "shch", "ъ": "", "ы": "y", "ь": "",
    "э": "e", "ю": "yu", "я": "ya",
}  # fmt: skip

_UKRAINIAN = {
    "а": "a", "б": "b", "в": "v", "г": "h", "ґ": "g", "д": "d", "е": "e", "є": "ye", "ж": "zh", "з": "z",
    "и": "y", "і": "i", "ї": "yi", "й": "y", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p",
    "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f", "х": "kh", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "shch",
    "ь": "", "ю": "yu", "я": "ya", "'": "", "’": "", "ʼ": "",
}  # fmt: skip

_TABLES = {"russian": _RUSSIAN, "ukrainian": _UKRAINIAN}


def to_latin(text: str, language: str) -> str:
    """E.g. 'Олександр Шевченко' -> 'Oleksandr Shevchenko'. Characters without a mapping are kept as they are."""
    table = _TABLES[language]
    latin = ""
    for char in text:
        replacement = table.get(char.lower(), char)
        latin += replacement.capitalize() if char.isupper() else replacement
    return latin
