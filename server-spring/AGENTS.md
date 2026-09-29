# Dojo Server — Spring Boot

Back-end for Dojo: Java 25 · Spring Boot 4.1 · PostgreSQL · Flyway · Hibernate/JPA · Lombok ·
springdoc + Scalar. Repository-wide rules are in `../AGENTS.md`.

**These versions are newer than most training data.** Boot 4 moved packages (`AutoConfigureMockMvc`
is in `org.springframework.boot.webmvc.test.autoconfigure`), Jackson 3 is `tools.jackson.*` while its
annotations stay in `com.fasterxml.jackson.annotation`, and Spring Data JPA 4 rejects
`Specification.where(null)`. Check Spring, Hibernate, Jackson and Tomcat behaviour against the code
or the jars in `~/.m2`, not memory, and prefer running the app over reasoning about it.

## Commands

```bash
SPRING_PROFILES_ACTIVE=dev ./mvnw spring-boot:run   # port 7777, docs at /api/docs
./mvnw test                                         # needs the local Postgres from the README
./mvnw spotless:apply                               # format
./mvnw spotless:check checkstyle:check              # lint, as CI runs it
```

## Layout

Package by feature under `nl.hackyourfuture.dojoserver`: a feature owns its entity, controller,
service, repository and `dto/`. `config/` holds error handling, OpenAPI and security; `shared/` holds
helpers and the `DojoException` family. Copy the closest reference instead of inventing a shape:

| Package            | Reference for                                   |
|--------------------|-------------------------------------------------|
| `admin/user/`      | a plain CRUD endpoint                           |
| `trainee/profile/` | PATCH, and a list that filters, sorts and pages |
| `interaction/`     | one record type shared by several profile types |
| `picture/`         | files that belong to a record                   |
| `search/`          | ranking in Java                                 |

## Entities

- Ids are 10-character random strings from `RandomUtils.generateRandomId()`, set by the service
  before `save()`. Not UUIDs.
- Copy `User`'s Lombok setup: `@Setter` on the class and `@Setter(AccessLevel.NONE)` on the id and
  both audit fields, a `PROTECTED` no-args constructor for Hibernate and a `PRIVATE` all-args one for
  `@Builder`, equality on the id only. `AuditingEntityListener` writes `createdAt` and `updatedAt`;
  never set them.
- `@Table(name = ...)`, not `@Entity(name = ...)`.
- `@DynamicUpdate` on an entity written by a PATCH or by more than one endpoint, so an `UPDATE`
  touches only the columns that changed.
- Enums are `@Enumerated(EnumType.STRING)` in the entity and `@JsonValue` on the wire: `NON_BINARY`
  in the column, `non-binary` in JSON.

## Services

- `@Transactional` on writes, `@Transactional(readOnly = true)` on reads.
- Anything that takes an id, update and delete included, starts with
  `findById(id).orElseThrow(() -> new DojoNotFoundException("Entity", id))`.
- Update mutates the loaded entity and lets dirty checking write it. No `save()`: on a detached
  entity it merges, which inserts when the id is unknown.
- Check uniqueness before the write and throw `DojoConflictException`; skip the check when the value
  is unchanged. The unique index stays the guarantee.
- Request records normalise their input (strip, lowercase emails) in the compact constructor.
- Case-insensitive lookups use `...IgnoreCase` queries, which Spring Data turns into `upper(...)`.
  That is why the unique indexes are on `upper(email)`: do not switch them to `lower`. Plain
  `findByEmail` is exact-match.

## API

- One `@RestController` per feature under `/api/...`; admin features under `/api/admin/...`.
- DTOs are records in `dto/`; responses have a static `from(entity)`. A list returns a summary
  record and the item endpoint the full one (`TraineeSummaryResponse` vs `TraineeResponse`).
- Statuses: 200 read, 201 create, 204 delete, 400 invalid body, 404 unknown id, 409 conflict.
- Every endpoint has `@Operation` and one `@ApiResponse` per status it can actually return. Error
  responses use `@Schema(implementation = DojoError.class)`.
- Response components are `requiredMode = REQUIRED`, plus `nullable = true` where null is possible.
  Request records use `Boolean` and `Integer`, never primitives.
- Embed a user as `ReporterResponse`, never `UserResponse`, which carries the staff email.
- Keep a controller consistent with itself: descriptions, validation messages, wrapping. The next
  feature copies whatever it finds.

## Errors

- Every error body is `DojoError(String error)`.
- Throw a `DojoException` subclass: `DojoBadRequestException` 400, `DojoUnauthorizedException` 401,
  `DojoForbiddenException` 403, `DojoNotFoundException` 404, `DojoConflictException` 409. For a new
  case add a subclass, not a handler.
- Domain messages reach the caller in every environment, so identify records by id, never by email
  or name. Framework and SQL messages are appended only on the dev profile.

## Security

- Every path needs a signed-in user (`anyRequest().authenticated()` in `SecurityConfig`). Add a
  `permitAll()` only on purpose, with a comment. Unmapped paths answer 401, not 404.
- The caller is `@AuthenticationPrincipal AuthenticatedUser`.
- Filters are built in `SecurityConfig`, never as a `@Component`: Boot would also register them as
  servlet filters. Their 401s and 403s get the `DojoError` shape from `SecurityErrorHandler`, not
  `GlobalExceptionHandler`.
- CSRF protection is `CsrfOriginFilter`, an `Origin` check, not Spring's tokens.
  `consumes = APPLICATION_JSON_VALUE` on login blocks login CSRF; keep it.
- No CORS config, and none needed: the client proxies `/api`.
- Accepted risk: the cookies have no `__Host-` prefix, which would clash with dev's non-secure
  cookies and the refresh cookie's `/api/auth` path.
- `auth.md` covers the sign-in flow, the three token types and the cookies.

## Database

- Flyway migrations in `src/main/resources/db/migration/`. With `ddl-auto: validate` the app refuses
  to start when the entities and the schema disagree.
- **Dojo is deployed, so every schema change is a new `V{n}__description.sql`.** Never edit a
  migration that has shipped: Flyway's checksum check stops the deployed app from starting.

## Tests

- `./mvnw test` runs against the local `dojo` database you develop in. Integration tests are
  `@SpringBootTest`, `@AutoConfigureMockMvc` and `@Transactional` with `MockMvcTester`; the rollback
  is what keeps your data. Copy `TraineeListTest`.
- Seed values that cannot collide with local data: `TraineeListTest` uses cohorts 9001 and 9002 and
  asserts only inside that range.
- `@WithMockUser` is enough unless the endpoint reads `AuthenticatedUser`; then sign in with a real
  token, like `AuthenticationFlowTest`.
- Mock `FileStorageService` with `@MockitoBean`: CI has Postgres but no S3.

## Feature notes

- **PATCH** (`trainee/profile/`): a key you send is a key you meant. Omitted keeps the value, `null`
  clears it. The controller takes `@RequestBody ObjectNode`, and `JsonMergePatch.apply` overlays it
  on `TraineeRequest.from(trainee)` and validates the merged record, so one request record serves
  POST and PATCH. `Optional<T>` and `JsonNullable<T>` were tried and rejected.
- **Paged lists** (`trainee/profile/`): explicit `page`, `size` and `direction` parameters, not
  `Pageable`. The sort must end in a unique column (`id`), or rows repeat across pages. Data from
  another feature costs one query for the ids on the page, never one per row.
- **JPQL `@Query` returning a record** selects in the record's component order; aliases are ignored.
- **Interactions** (`interaction/`): one table, service and repository for every profile type, and
  one controller per type that hardcodes its `ProfileType`. Never take it from the path or body.
  Items are found by id and profile, like `findByIdAndTraineeId`, never `findById`. The reporter is
  the caller, and only they may edit or delete. Each profile type has its own nullable FK column,
  and a `num_nonnulls(...) = 1` check keeps exactly one set. A new type adds its column to that
  check, never a shared `profile_id`, which could have no foreign key.
- **Pictures** (`picture/`): owners implement `PictureOwner` and store only `pictureId`. Storage keys
  come from the stored id, never from a path variable. Every upload gets a new id, so a picture URL
  never changes content. Pictures are cropped to fill the square; a logo overrides `isPictureCropped()`
  so it fits inside whole. To delete an owner, delete and `flush()` it before
  `PictureService.deleteAll`. Locally, storage is the MinIO in `../server/dev-services`
  (`docker compose up storage`).
- **Search** (`search/`): ranking runs in Java over every trainee, organisation and contact person,
  because names match by close spelling. Each type ranks on its own, then a stable sort by score merges them, so equal
  scores list trainees first. `SearchRankingTest` pins the order.

## Configuration

- `application.yaml` holds the local defaults, mostly as `${ENV_VAR:default}`; `-dev` and `-prod`
  overlay it. `-test` is the deployed test environment, not the test suite.
- `application-prod.yaml` drops the defaults production must set, so a misconfigured deploy fails at
  startup. Add new env vars to the README table.
- `ServerConfig.isDevelopment()` gates anything dev-only.

## Code style

- Spotless (Eclipse formatter, `eclipse-formatter.xml`) fixes indentation and spacing but keeps your
  line breaks, so wrap long chains by hand. It puts each annotation on a parameter or record
  component on its own line; don't fight it.
- Checkstyle (`checkstyle.xml`) covers imports (no star imports), braces, naming and likely bugs.
- After editing `eclipse-formatter.xml`, delete `target/spotless-index`, or `spotless:check` reports
  stale results.
