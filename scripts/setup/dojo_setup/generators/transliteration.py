"""Rewrites names in other alphabets: Cyrillic in Latin letters, and Latin names in plain ASCII."""

import unicodedata

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


def to_ascii(text: str) -> str:
    """Keeps only lowercase ASCII letters and digits, e.g. 'El Amrani' -> 'elamrani' and 'Şama' -> 'sama'."""
    # The Turkish dotless ı has no decomposed form, so it's replaced by hand
    decomposed = unicodedata.normalize("NFKD", text.lower().replace("ı", "i"))
    return "".join(char for char in decomposed if char.isascii() and char.isalnum())


def to_slug(text: str) -> str:
    """For URLs, e.g. 'Gray, Clark and Freeman' -> 'gray-clark-and-freeman' and 'Bates-Pittman' -> 'bates-pittman'."""
    words = [to_ascii(word) for word in text.replace("-", " ").split()]
    return "-".join(word for word in words if word)
