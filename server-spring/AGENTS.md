# Dojo Server — Spring Boot

Internal backend for Dojo, HackYourFuture's tool for tracking trainee progress. Replaces the
Node/Express + MongoDB server in `../server`. Used by a small number of trusted HYF staff.

Java 25 · Spring Boot 4.1.1 · PostgreSQL · Flyway · Hibernate/JPA · Lombok · springdoc + Scalar

## Working style

- **Keep it simple.** This is an internal tool for a handful of users, not a system that has to
  scale. Prefer the simplest thing that works over the defensive or general version.
- **Comments are one line** where possible. No multi-paragraph javadoc.
- **Answer questions directly** — a few sentences. Skip background and option surveys unless asked.
- **Never raise untracked or unstaged git files** as an issue.
- **Verify Spring / Hibernate / Tomcat behaviour** against the actual code or the jars in `~/.m2`
  rather than from memory, and prefer running the app over reasoning about it.

## Layout

Package by feature. Each feature owns its entity, controller, service, repository and DTOs.

```
nl.hackyourfuture.dojoserver
  admin/user/            User, UserController, UserService, UserRepository, dto/
  config/                GlobalExceptionHandler, SecurityConfig, OpenApiConfig,
                         ServerConfig, ServerEnvironment
  shared/                DojoError, RandomUtils
  shared/exception/      DojoException + Dojo{NotFound,Conflict,BadRequest,Forbidden}Exception
```

## Entities

```java
@NoArgsConstructor @AllArgsConstructor @Getter @Builder
@Entity @Table(name = "users")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@EntityListeners(AuditingEntityListener.class)
public class User {
    @Id @EqualsAndHashCode.Include
    private String id;

    @Setter
    private String email;

    @CreatedDate       private Instant createdAt;
    @LastModifiedDate  private Instant updatedAt;
}
```

- Ids are 10-character alphanumeric strings from `RandomUtils.generateRandomId()`, assigned in the
  service before save. Not UUIDs.
- `@Getter` on the class, `@Setter` only on mutable fields — never on the id.
- Equality is id-only, via `onlyExplicitlyIncluded`.
- `@Entity` plus `@Table(name = ...)`. Not `@Entity(name = ...)`, which names the JPQL entity.
- Audit fields are written by `AuditingEntityListener`, enabled by `@EnableJpaAuditing` on
  `DojoServerApplication`. Never assign them yourself.

## Services

`@Transactional` on writes, `@Transactional(readOnly = true)` on reads.

```java
@Transactional
public UserResponse updateUser(String id, UserRequest request) {
    User user = userRepository.findById(id)
            .orElseThrow(() -> new DojoNotFoundException("User", id));
    user.setEmail(request.email().toLowerCase());
    return UserResponse.from(user);
}
```

- **Update loads and mutates.** No `save()` — the entity is managed inside the transaction and
  dirty checking flushes at commit. Building a detached entity and calling `save()` would merge,
  which inserts a row when the id does not exist.
- **Create** builds a new entity and calls `repository.save(...)`.
- **Delete** does the same `findById(...).orElseThrow(...)`, then `repository.delete(entity)`.
- Request records normalise in their compact constructor — trimmed strings, lowercased emails —
  so the record runs before bean validation and the service stores what it is given. Java has no
  `?.`, so guard each field: `email == null ? null : email.strip()`.

## Errors

One response shape, everywhere:

```java
public record DojoError(String error) {}
```

Throw a `DojoException` subclass for anything deliberate. Each carries its own status:

| Exception | Status | For |
|---|---|---|
| `DojoNotFoundException` | 404 | record does not exist, or the caller may not know it does |
| `DojoConflictException` | 409 | duplicate value, or a state that forbids the change |
| `DojoBadRequestException` | 400 | a business rule bean validation cannot express |
| `DojoForbiddenException` | 403 | caller may see the record but not do this to it |

- **Add subclasses of `DojoException`, not handlers.** One handler in `GlobalExceptionHandler`
  translates the whole family using `ex.getStatus()`.
- `GlobalExceptionHandler` is a single `@RestControllerAdvice`, grouped by status code, with one
  handler per framework/servlet/persistence exception and a catch-all `Exception` handler that
  returns 500 and logs the stack trace. Method order does not matter — Spring picks the most
  specific match within one advice class.
- `buildDojoError` appends `ex.getMessage()` **only on the dev profile**, because framework and SQL
  text carries constraint names, statements and personal data.
- Domain exception messages pass through in every environment — they are written for the caller.
  Key them on opaque ids, never on an email address or a name.
- The 406 handler returns no body on purpose: any body would be in the format the caller refused.

## Code style

Spotless owns layout, using the Eclipse JDT formatter configured by `eclipse-formatter.xml`:
4-space indent, 120 columns, and `join_wrapped_lines=false` — it fixes indentation and spacing but
keeps the line breaks the author chose. That is why a hand-wrapped builder chain such as the one in
`SecurityConfig` survives formatting instead of being flattened.

Checkstyle (`checkstyle.xml`) owns the rest, and is deliberately small — imports, likely bugs,
braces, naming. No rule in it touches whitespace or line length, because the formatter already
decided those and cannot break a long string literal.

```bash
./mvnw spotless:apply                     # reformat
./mvnw spotless:check checkstyle:check    # what CI runs
```

- Both are bound to the `verify` phase, not `validate`, so `spring-boot:run` and `./mvnw test`
  stay fast.
- `eclipse-formatter.xml` is an Eclipse XML profile, the one format IntelliJ imports natively
  (Settings > Editor > Code Style > Import Scheme). One file configures both the CLI and the IDE,
  so format-on-save needs no third-party plugin.
- `join_wrapped_lines` does not cover parentheses. A `)` on its own line survives only because of
  the four `parentheses_positions_in_*` keys set to `preserve_positions`.
- `alignment_for_annotations_on_parameter=48` plus `insert_new_line_after_annotation_on_parameter`
  gives every annotated record component one annotation per line and its name below them. The same
  rules apply to method parameters, which is why the controller wraps its parameter list.
- **Star imports are IntelliJ's, not the profile's.** An Eclipse profile carries no import
  settings, so IntelliJ collapsed six Lombok imports into `lombok.*` and Checkstyle's
  `AvoidStarImport` failed CI. `CLASS_COUNT_TO_USE_IMPORT_ON_DEMAND` and
  `NAMES_COUNT_TO_USE_IMPORT_ON_DEMAND` are set to 999 in the IDE's own `Dojo` scheme
  (`~/Library/Application Support/JetBrains/<IDE>/codestyles/Dojo.xml`). Re-importing
  `eclipse-formatter.xml` replaces that scheme and drops both — set them again.
- `.githooks/pre-commit` reformats staged Java files on commit and reports Checkstyle findings
  without blocking — enabled with `git config core.hooksPath .githooks` from the repository root.
- The formatter version is pinned by `spotless-maven-plugin`, which resolves the JDT for it. Do not
  add a `<version>` inside `<eclipse>` — that field takes an Eclipse release like `4.36`, not the
  Spotless artifact version.
- Spotless's `ModuleHelper` touches `sun.misc.Unsafe` on every run, so JDK 24+ prints a
  deprecation warning. It is harmless and Spotless's to fix; the pre-commit hook drops it with
  `2>/dev/null` (Maven's own errors go to stdout under `-q`, so they still show). Do not add
  `--sun-misc-unsafe-memory-access=allow` to `.mvn/jvm.config` — that hides the warning everywhere.
- `// spotless:off` … `// spotless:on` is available but currently unused — the formatter respects
  manual wrapping, so it is rarely needed.
- `eclipse-formatter.xml` sets 32 of the 416 keys the JDT formatter accepts; the rest come from
  Spotless's baseline. Keep entries that merely restate a baseline value — that baseline matches
  none of the JDT's three published default maps exactly, so it is not something to rely on across
  a Spotless or JDT upgrade.
- **After editing `eclipse-formatter.xml`, delete `target/spotless-index`.** It is an up-to-date
  cache keyed on source files, so a config-only change leaves `spotless:check` reporting clean on
  stale results. CI is unaffected — it always starts from a fresh checkout.

## Migrations

Flyway, in `src/main/resources/db/migration/`. `ddl-auto: validate` — the app refuses to start when
the entity mapping and the schema disagree.

There is no deployed environment yet, so schema changes are folded into `V1__init_schema.sql`
instead of new versioned files. After editing V1, recreate the local database:

```bash
docker exec hyf-dojo psql -U admin -d postgres -c "DROP DATABASE dojo WITH (FORCE);" -c "CREATE DATABASE dojo;"
```

## API

- Controllers live under `/api/...`.
- Request and response DTOs are records in a `dto` subpackage. Responses get a static
  `from(entity)` factory. Validation annotations go on the request record.
- Statuses: 200 read, 201 create, 204 delete, 404 unknown id, 409 conflict.
- Every endpoint carries `@Operation` and `@ApiResponse`. The spec is served at
  `/api/docs/openapi`, the Scalar UI at `/api/docs`.

## Configuration

`application.yaml` is the base; `-dev`, `-test` and `-prod` overlay it.

| | |
|---|---|
| base | `localhost:5432/dojo`, `admin`/`password`, port 7777, `ddl-auto: validate` |
| dev | Scalar on, full health details, `DEBUG INFO` appended to error messages |
| prod | docs off, health details only when authorized, `sslmode=require`, every DB setting from an env var with no default |

`ServerConfig.isDevelopment()` is the gate for anything dev-only. It resolves to `PRODUCTION` when
no profile matches.

Run locally:

```bash
SPRING_PROFILES_ACTIVE=dev ./mvnw spring-boot:run
```

## Security — current state

`SecurityConfig` has one filter chain: stateless sessions, request cache disabled, CSRF, httpBasic
and formLogin all disabled.

There is no authentication yet, so the chain ends in `anyRequest().permitAll()`. That is also what
makes unmapped paths answer 404 instead of 403 — `authenticated()` would reject them in the filter
chain before the dispatcher runs.

CORS is not configured, and is not needed: the React client proxies `/api` to this server.

## Build and CI

```bash
./mvnw test           # needs a Postgres on localhost:5432
./mvnw package        # jar in target/
./mvnw verify         # package plus Spotless and Checkstyle
```

The Dockerfile is a two-stage build that runs as uid 1000 on port 7777 with
`SPRING_PROFILES_ACTIVE=prod`. It runs `mvn package`, so the image build does not lint.

`.github/workflows/build-server-spring.yml` holds both backend jobs: `lint` runs Checkstyle and
`spotless:check` on a JDK with no database, and `build` builds the image and pushes it to GHCR.
They run in parallel and share the workflow's path filters and concurrency group, which is why the
lint job lives here rather than in `quality-checks.yml` — that one is the client's and has no path
filter, so it would fire on client-only PRs.
