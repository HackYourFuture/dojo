# Dojo

HackYourFuture's internal tool for tracking trainees: profiles, cohorts, assessments, interactions
and search. A small number of trusted HYF staff use it.

## Stack

| Folder           | What                                                                                     |
|------------------|------------------------------------------------------------------------------------------|
| `client/`        | Front-end. React 19, TypeScript, Vite 7, MUI 7, TanStack Query 5, React Router 6, Axios  |
| `server-spring/` | Back-end. Java 25, Spring Boot 4.1, PostgreSQL 18, Flyway, Hibernate/JPA, Lombok         |
| `server/`        | Legacy Node/Express + MongoDB back-end, replaced by `server-spring/`. Kept for reference |
| `scripts/setup/` | Python script that fills a local environment with dummy trainees through the API         |

Sign-in is Google OAuth, pictures are stored in S3-compatible storage.

## Where to find what

- **Client:** `client/src/features/<feature>/`, usually with `api/` (Axios calls, API types,
  mappers), `data/` (TanStack Query keys, queries, mutations) and `components/`. Routes are in
  `client/src/routes/routes.tsx`. Conventions: `CLIENT_STRUCTURE.md`.
- **Back-end:** `server-spring/src/main/java/nl/hackyourfuture/dojoserver/<feature>/`. Conventions:
  `server-spring/AGENTS.md`. Sign-in, tokens and cookies: `server-spring/auth.md`.
- **Database schema:** Flyway migrations in `server-spring/src/main/resources/db/migration/`.
- **API:** everything is under `/api`. Docs at <http://localhost:7777/api/docs> while the back-end
  runs.
- **CI/CD:** `.github/workflows/`. `frontend-ci-cd.yml` and `server-ci-cd.yml` lint, test and build
  the Docker images, and push them to GHCR from `main`. `pr-security-review.lock.yml` is generated
  from `pr-security-review.md` by `gh aw compile`; never edit it by hand.

## Running locally

- Back-end on port 7777: `server-spring/README.md`.
- Front-end on port 8888: `npm run dev` in `client/`. Vite proxies `/api` to
  `VITE_BACKEND_PROXY_TARGET` from `client/.env`, and nginx does the same in production
  (`client/nginx.conf`), so there is no CORS.

## Checks

- Client: `npm run lint` in `client/` (tsc and ESLint), and Prettier on the files you touched
  (`npx prettier --write <files>`, config in `.prettierrc`). There are no client tests.
- Back-end: `./mvnw spotless:apply`, then `./mvnw verify` in `server-spring/`. That runs the tests
  against the local Postgres, Spotless and Checkstyle.

## Working style

- **Keep it simple.** This is an internal tool for a handful of users, not a system that has to
  scale. Prefer the simplest thing that works over the defensive or general version.
- **Comments are one line** where possible. No multi-paragraph javadoc.
- **Prefer plain string operations to regex.** `indexOf`, `startsWith`, `replace` or a short loop
  usually read better. Use a regex where it is the clearest tool for the job, not by habit.
- **Never raise untracked or unstaged git files** as an issue.
- **Never commit or push code** Without explicit permission.
- **Always verify** that your changes work locally before committing or pushing.

## Communication

Short and direct. The user asks for more when they want it.

- **Lead with the answer**, in a sentence or two. No preamble, no recap of what you just did.
- **No option surveys, trade-off lists, or "two approaches" framing.** Pick one, say why in a
  clause, move on. Present a choice only when it is genuinely the user's to make and the answer
  changes what gets built.
- **State findings, don't argue them.** One line each. Add evidence only where the claim is
  surprising or the user is likely to disagree.
- **Skip the closing summary.** No "what changed" wrap-up, no restating the task, no next-steps
  list unless asked.
- Headings, tables and bullet lists are for documents. A question gets prose.
- Report verification as a fact — "tests pass, lint clean" — not as a section.
- Do not raise the same point twice. If the user declined it, it is decided.
