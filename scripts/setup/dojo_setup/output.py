"""Terminal output shared by all steps."""

from rich.console import Console

console = Console()


def step(number: int, total: int, title: str) -> None:
    console.print()
    console.rule(f"[bold]Step {number}/{total} · {title}", align="left", style="cyan")


def success(message: str) -> None:
    console.print(f"[green]✔[/] {message}")


def skipped(message: str) -> None:
    """Something that didn't need to be done, e.g. because it already exists."""
    console.print(f"[blue]○[/] {message}")


def info(message: str) -> None:
    console.print(f"[cyan]•[/] {message}")


def warning(message: str) -> None:
    console.print(f"[yellow]⚠[/] {message}")


def error(message: str, hint: str | None = None) -> None:
    console.print(f"\n[bold red]✘ {message}[/]")
    if hint:
        console.print(f"  [dim]{hint}[/]")
