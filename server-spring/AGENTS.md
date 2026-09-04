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
- Emails are lowercased before persisting.

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
```

The Dockerfile is a two-stage build that runs as uid 1000 on port 7777 with
`SPRING_PROFILES_ACTIVE=prod`. `.github/workflows/build-server-spring.yml` builds the image and
pushes it to GHCR.
