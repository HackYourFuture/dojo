class SetupError(Exception):
    """A failure that stops the setup, with a message and an optional hint for the user."""

    def __init__(self, message: str, hint: str | None = None):
        super().__init__(message)
        self.message = message
        self.hint = hint


class SetupCancelled(Exception):
    """The user chose not to continue."""
