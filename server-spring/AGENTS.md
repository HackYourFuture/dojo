# Dojo Server — Spring Boot

Internal backend for Dojo, HackYourFuture's tool for tracking trainee progress. Replaces the
Node/Express + MongoDB server in `../server`. Used by a small number of trusted HYF staff.

Java 25 · Spring Boot 4.1.1 · PostgreSQL · Flyway · Hibernate/JPA · Lombok · springdoc + Scalar

## Working style

- **Keep it simple.** This is an internal tool for a handful of users, not a system that has to
  scale. Prefer the simplest thing that works over the defensive or general version.
- **Comments are one line** where possible. No multi-paragraph javadoc.
- **Never raise untracked or unstaged git files** as an issue.
- **Verify Spring / Hibernate / Tomcat behaviour** against the actual code or the jars in `~/.m2`
  rather than from memory, and prefer running the app over reasoning about it.

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

## Layout

Package by feature. Each feature owns its entity, controller, service, repository and DTOs.

```
nl.hackyourfuture.dojoserver
  admin/user/            User, UserController, UserService, UserRepository, dto/
  trainee/profile/       Trainee, Gender, TraineeController, TraineeService,
                         TraineeRepository, dto/
  interaction/           Interaction, InteractionType, InteractionService,
                         InteractionRepository, TraineeInteractionController, dto/
  config/                GlobalExceptionHandler, SecurityConfig, OpenApiConfig,
                         ServerConfig, ServerEnvironment
  shared/                DojoError, JsonMergePatch, ProfileType, RandomUtils
  shared/exception/      DojoException + Dojo{NotFound,Conflict,BadRequest,Forbidden}Exception
```

## Entities

```java

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@Builder
@Setter
@Entity
@Table(name = "users")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@EntityListeners(AuditingEntityListener.class)
public class User {
    @Id
    @EqualsAndHashCode.Include
    @Setter(AccessLevel.NONE)
    private String id;

    private String email;

    // Managed by Spring Data JPA's AuditingEntityListener. Do not set these manually.
    @CreatedDate
    @Setter(AccessLevel.NONE)
    private Instant createdAt;
    @LastModifiedDate
    @Setter(AccessLevel.NONE)
    private Instant updatedAt;
}
```

- Ids are 10-character alphanumeric strings from `RandomUtils.generateRandomId()`, assigned in the
  service before save. Not UUIDs.
- `@Setter` goes **on the class**, with `@Setter(AccessLevel.NONE)` on the id and the two audit
  fields. Not one `@Setter` per mutable field: a wide entity like `Trainee` would carry an
  annotation on every line. Accepted cost — a field added later is mutable unless you lock it, so
  remember the three exceptions on every new entity. (If that repetition grows, move the audit
  fields to a `@MappedSuperclass` and the exceptions disappear.)
- Constructors are closed: `@NoArgsConstructor(access = PROTECTED)` is the one Hibernate needs,
  `@AllArgsConstructor(access = PRIVATE)` is the one `@Builder` needs. Public versions would let
  callers set the audit fields that `@Setter(AccessLevel.NONE)` exists to protect.
- Equality is id-only, via `onlyExplicitlyIncluded`.
- `@Entity` plus `@Table(name = ...)`. Not `@Entity(name = ...)`, which names the JPQL entity.
- Audit fields are written by `AuditingEntityListener`, enabled by `@EnableJpaAuditing` on
  `DojoServerApplication`. Never assign them yourself.
- `@DynamicUpdate` (Hibernate's, not JPA's) on any entity that a PATCH writes. The merge assigns
  every field, dirty checking flags only the ones that changed, and `@DynamicUpdate` makes the SQL
  `UPDATE` list only those columns — so two people editing different fields of the same trainee
  no longer overwrite each other's columns with the values they loaded. `User` does not carry it:
  four columns, and no PATCH.

## Services

`@Transactional` on writes, `@Transactional(readOnly = true)` on reads.

```java

@Transactional
public UserResponse updateUser(String id, UserRequest request) {
    User user = userRepository.findById(id)
            .orElseThrow(() -> new DojoNotFoundException("User", id));

    // Changed email - check for duplicates.
    if (!user.getEmail().equalsIgnoreCase(request.email())
            && userRepository.existsByEmailIgnoreCase(request.email())) {
        throw new DojoConflictException("Email is already in use by another user.");
    }

    user.setEmail(request.email());
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
- **Check uniqueness in the service, before the write**, and throw `DojoConflictException` so the
  caller gets a written-for-humans message. The unique index is still the guarantee — a race
  reaches it and `handleDataConflict` turns it into a 409 too, just a blunter one. On update, skip
  the check when the value has not changed, or a plain rename 409s against itself.
- Derived query names carry SQL semantics: `existsByEmailIgnoreCase` generates
  `upper(email) = upper(?)`, which is why the index is on `upper(email)`. Plain `findByEmail` is
  exact-match, so any caller must normalise first.

## Errors

One response shape, everywhere:

```java
public record DojoError(String error) {
}
```

Throw a `DojoException` subclass for anything deliberate. Each carries its own status:

| Exception                 | Status | For                                                       |
|---------------------------|--------|-----------------------------------------------------------|
| `DojoNotFoundException`   | 404    | record does not exist, or the caller may not know it does |
| `DojoConflictException`   | 409    | duplicate value, or a state that forbids the change       |
| `DojoBadRequestException` | 400    | a business rule bean validation cannot express            |
| `DojoForbiddenException`  | 403    | caller may see the record but not do this to it           |

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
  (Settings > Editor > Code Style > Import Scheme), so format-on-save needs no third-party plugin.
  **But the import is a lossy translation, not the JDT formatter running in the IDE** — IntelliJ
  has no equivalent of `preserve_positions`, and Eclipse profiles carry no import settings at all.
  Expect the two to disagree on wrapping and imports. Spotless is the source of truth: when they
  differ, `./mvnw spotless:apply` wins, and the pre-commit hook applies it regardless. Exact
  parity would mean running Spotless from the IDE (the "Spotless Applier" plugin) or switching to
  a single-engine formatter like google-java-format, which would flatten the manual wrapping.
- `join_wrapped_lines` does not cover parentheses. A `)` on its own line survives only because of
  the four `parentheses_positions_in_*` keys set to `preserve_positions`.
- `alignment_for_annotations_on_parameter=48` plus `insert_new_line_after_annotation_on_parameter`
  gives every annotated record component one annotation per line and its name below them. The same
  rules apply to method parameters, which is why the controller wraps its parameter list.
- **Inline annotations on parameters (`@PathVariable String id`) are not available.** The JDT has
  no `_on_record_component` key, so record components are formatted by the same `_on_parameter`
  keys, and `insert_new_line_after_annotation_on_parameter` is prescriptive in both directions —
  setting it to `do not insert` puts the type after the last annotation in every request record
  too, which reads badly wherever a `@Schema` wraps. Tried and reverted; the records win. A
  controller that really wants it would need `// spotless:off` around its parameter list.
- **Star imports are IntelliJ's, not the profile's.** An Eclipse profile carries no import
  settings, so IntelliJ collapsed six Lombok imports into `lombok.*` and Checkstyle's
  `AvoidStarImport` failed CI. `CLASS_COUNT_TO_USE_IMPORT_ON_DEMAND` and
  `NAMES_COUNT_TO_USE_IMPORT_ON_DEMAND` are set to 999 in the IDE's own `Dojo` scheme
  (`~/Library/Application Support/JetBrains/<IDE>/codestyles/Dojo.xml`). Re-importing
  `eclipse-formatter.xml` replaces that scheme and drops both — set them again.
- `.githooks/pre-commit` runs `spotless:apply` and then `git add -u` over `server-spring/*.java`,
  staging **every** Java file Spotless changed — not just the ones already staged. Spotless
  formats the whole module, so a collateral fix would otherwise stay unstaged and CI would fail on
  a file you never touched. The trade-off is that it also stages Java changes you deliberately
  left out. Checkstyle findings are reported, never fatal. Enable with
  `git config core.hooksPath .githooks` from the repository root.
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

Editing V1 changes its Flyway checksum, so the app will refuse to start against an old database.

- Case-insensitive uniqueness is **one functional index**:
  `create unique index users_email_upper_unique on users (upper(email))`. There is deliberately no
  second exact-match constraint on the column — a unique `upper(email)` already rejects exact
  duplicates, so the extra constraint would be an index maintained on every write for no added
  guarantee.
- `upper` rather than `lower` because Spring Data's `IgnoreCase` generates `upper(...)`. Matching
  them lets the predicate use the index instead of a sequential scan. Do not "tidy" this to
  `lower`.

## API

- Controllers live under `/api/...`, one `@RestController` per feature with the path on
  `@RequestMapping`. Admin-facing features sit under `/api/admin/...`.
- Request and response DTOs are records in a `dto` subpackage. Responses get a static
  `from(entity)` factory. Validation annotations go on the request record.
- A collection returns a **summary** record, the item URL returns the full one:
  `GET /api/trainees` is a list of `TraineeSummaryResponse` (id, names, picture URLs), and
  `GET /api/trainees/{id}` is the `TraineeResponse`. A 50-field profile times every trainee is not
  a list. `users` returns the full record from both because it has four fields.
- Statuses: 200 read, 201 create, 204 delete, 400 invalid body, 404 unknown id, 409 conflict.
- Every endpoint carries `@Operation` and `@ApiResponse`. The spec is served at
  `/api/docs/openapi`, the Scalar UI at `/api/docs`.

### Adding an endpoint

`admin/user/` is the reference implementation — copy its shape. Work outwards from the DTOs.

1. **Request record.** One `@Schema` per component with a `description` and `example`, plus the
   validation annotations. Normalise in the compact constructor so the service can trust its
   input. Boxed `Boolean`/`Integer`, never primitives. Keep `@Size` minimums honest — a display
   name can legitimately be two characters.
2. **Response record.** `requiredMode = REQUIRED` on every component, plus `nullable = true` where
   the value can be null. A nullable field is still required: the key is always present in the
   JSON, and a generated client that types it `field?: string` will be wrong.
3. **Service method.** `@Transactional(readOnly = true)` for reads, `@Transactional` for writes.
   `findById(...).orElseThrow(() -> new DojoNotFoundException("Entity", id))` for anything taking
   an id — including update and delete, so an unknown id is a 404 and not a silent no-op.
4. **Controller method.** `@Operation(summary, description)`, then one `@ApiResponse` per status
   **the method can actually return** — if the service throws it, document it. Error responses
   carry `content = @Content(schema = @Schema(implementation = DojoError.class))`.
5. **`SecurityConfig`.** Add the path to `authorizeHttpRequests`. There is no auth yet so this is
   `permitAll()`; every path added now is one to revisit when auth lands.
6. **Migration.** Fold the schema into `V1__init_schema.sql`, then recreate the local database.
7. `./mvnw spotless:apply`, then `./mvnw spotless:check checkstyle:check`.

### PATCH instead of PUT

`trainee/profile/` is the reference for a partial update, which is what a resource with a lot of
fields wants — a `PUT` would force the client to send every field back on every keystroke-sized
change. The rule is that **a key you send is a key you meant**: leave a field out and it keeps its
current value, put it in the body and it is validated and stored, `null` included. A body with no
fields at all is a 400.

The implementation is a JSON Merge Patch (RFC 7386) applied with Jackson's own
`readerForUpdating`, in `shared/JsonMergePatch`. There is **one request record** for both
`POST` and `PATCH`: the service loads the entity, expresses it as `TraineeRequest.from(trainee)`,
lets `JsonMergePatch.apply` overlay the body and validate the merged record, then copies every
field back onto the entity. Validating the *result* rather than the *request* is what makes one set
of constraints serve both verbs — `{"firstName": null}` fails `@NotBlank` because the merged
trainee has no first name, while `{"pronouns": null}` passes and clears the column.

- The controller takes `@RequestBody ObjectNode`, because the merge needs to know which keys were
  present and a bound record cannot tell. `ObjectNode` rather than `JsonNode` so that an array or
  scalar body fails at the message converter as a 400 instead of as a `ClassCastException`. A
  method-level swagger `@RequestBody(content = @Content(schema = @Schema(implementation =
  TraineeRequest.class)))` keeps the fields in the docs.
- The docs list the `@NotBlank` fields as required on the PATCH body too. They are required on the
  *merged result*, not the request; the body description says so, and that is where it stays until
  there is a generated client that cares.
- Jackson errors from the merge — a wrong type, an unknown enum value — are thrown inside the
  service, so they surface unwrapped rather than inside `HttpMessageNotReadableException`.
  `handleMismatchedInput` turns them into the same 400 the converter path produces; without it they
  would fall through to the 500 catch-all. It is deliberately `MismatchedInputException` and not its
  parent `DatabindException`: the parent also covers `InvalidDefinitionException` (a broken mapping)
  and `ValueInstantiationException` (our own constructor threw), which are bugs and must stay 500s.
- An unknown enum value gets a message that names the value, the field and the allowed values —
  `'aaaa' is not a valid value for 'gender'. Allowed values: man, woman, non-binary, other.` The
  allowed values are the wire values, read back through the `ObjectMapper` so `@JsonValue` is
  honoured; the handler falls back to the constant name if an enum ever refuses to serialise as a
  string, so the handler itself can never fail.
- Validation of the merged record throws `ConstraintViolationException`, which the existing
  handler already maps to a 400.
- `readerForUpdating` works on records in Jackson 3 (it rebuilds through the canonical constructor,
  so the compact-constructor normalisation runs on the merged values). It is not RFC 7386-compliant
  for nested objects and arrays; the request records here are flat, so that does not bite.
- Unknown keys are ignored, as everywhere else in the API.
- The alternatives were measured and rejected. `Optional<T>`: Jackson 3 resolves an omitted key and
  an explicit null both to `Optional.empty()`. A `Patchable<T>` / `JsonNullable<T>` wrapper per
  field works (openapitools' `jackson-databind-nullable` 0.2.11 supports Jackson 3 and
  auto-registers), but it means two request records with duplicated constraints, a value extractor
  that must be registered through `META-INF/services`, and `@Schema(implementation = ...,
  requiredMode = NOT_REQUIRED)` on every wrapped field because neither springdoc nor swagger-core
  knows the wrapper.
- Enums are `@Enumerated(EnumType.STRING)` in the entity and `@JsonValue` on the wire, so the
  column holds `NON_BINARY` while the API speaks `non-binary` — the value the React client already
  sends.

Consistency within a controller matters more than any individual choice — descriptions either all
end with a period or none do, `@Parameter` blocks wrap the same way, validation messages are
either all custom or all defaults. The formatter preserves whatever you write, so it will not
correct you, and the next feature copies whatever it finds here.

Two known gaps, deliberate for now: `GET /` is an unpaginated `findAll()`, which is right for a
handful of staff and wrong the moment this pattern is copied to trainees or submissions; and
`getAllUsers` has no filtering or sorting.

### One record type, many owners

`interaction/` is the reference for a record that hangs off more than one kind of profile. Staff
record interactions with trainees today and with mentors and partners later, so there is **one
`interactions` table, one service, one repository and one DTO pair**, with **one controller per
profile type** — `TraineeInteractionController` today, `MentorInteractionController` later, both in
`interaction/`. The controllers live with the service they share, not under the URL they are
mounted on; the feature still owns all five artefacts.

- The subject link is an **exclusive arc**: one nullable FK column per profile type, with
  `check (num_nonnulls(trainee_id, mentor_id) = 1)` once there is more than one. A single
  `profile_id` column would be polymorphic and can carry **no foreign key at all**, giving up the
  `on delete cascade` every other child table has. Today the arc has one arm, so the column is just
  `trainee_id text not null` — identical to `assessments`.
- Public service methods take `(ProfileType profile, String profileId, …)`. `ProfileType` lives in
  `shared/` so the next shared record type reuses it, and carries a `label` used in 404 messages —
  without it a shared service reports "Trainee not found" on a mentor URL.
- Dispatch is confined to three private helpers, each an exhaustive `switch` over `ProfileType`, so
  adding a constant fails compilation at every site that needs updating. **Never** take the profile
  type from a path variable or the body: that collapses the guard into a caller-controlled string
  and makes per-profile authorization impossible when auth lands.
- Item lookup goes through `findByIdAndTraineeId`, never `findById`, so one profile cannot reach
  another's records. The arc is the second guard — `mentor_id` is null on every trainee row, so
  even a wrong query returns nothing instead of someone else's data.
- The reporter is a `@ManyToOne(fetch = LAZY)` to `User` — the codebase's first JPA relation —
  join-fetched by `@EntityGraph(attributePaths = "reporter")` on both read queries, so a list is a
  single `left join` rather than a second round trip. LAZY is safe because the entity is mapped to
  a DTO inside the `@Transactional` service method, well before `open-in-view: false` closes the
  session; what LAZY buys is that the write paths do not drag a `User` along. Leave the
  `@EntityGraph` on: without it the relation is fetched per row. `ReporterResponse` lives in
  `admin/user/dto/` because it is a projection of `User`; `UserResponse` itself would leak a staff
  email onto every trainee profile.
- `interactions.reporter_id` is **nullable until authentication lands**, because nothing can fill
  it yet — `reporter` is null in every response until then. Its FK is `on delete restrict`: an
  interaction is an audit record, and `restrict` is the only rule that still works once the column
  becomes `not null`. Deleting a user who has reported one is therefore a blunt 409 from
  `handleDataConflict`; give it a written-for-humans pre-check in `UserService` when auth lands.
- `Interaction.date` is an `Instant`/`timestamptz`, unlike `Assessment.date`, which is a
  `LocalDate`. That is deliberate: an interaction happens at a moment, an assessment on a day. The
  cost is that a body sending a bare `2024-01-01` is a 400 rather than being coerced to midnight.
- `PUT` never touches `reporterId`, so editing an interaction cannot reassign its author. The
  legacy Node server defaulted the reporter to whoever was editing, which silently rewrote
  authorship on every edit.

## Configuration

`application.yaml` is the base; `-dev`, `-test` and `-prod` overlay it.

|      |                                                                                                                    |
|------|--------------------------------------------------------------------------------------------------------------------|
| base | `localhost:5432/dojo`, `admin`/`password`, port 7777, `ddl-auto: validate`                                         |
| dev  | Scalar on, full health details, `DEBUG INFO` appended to error messages                                            |
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
`SPRING_PROFILES_ACTIVE=prod`. It runs `mvn package -DskipTests`, so the image build neither lints
nor tests.

**Nothing in CI runs tests** — the workflow has no test step and the image build skips them. There
are no feature tests yet. The integration shape that works, when they arrive: `@SpringBootTest`
plus `@AutoConfigureMockMvc` (Boot 4 moved this to
`org.springframework.boot.webmvc.test.autoconfigure`), `@Transactional` on the class, and
assertions through `MockMvcTester`. `@Transactional` is not optional — `./mvnw test` runs against
the same local `dojo` database you develop in, and rollback is what keeps it from being wiped.

`.github/workflows/server-ci-cd.yml` ("Backend CI/CD") holds both backend jobs: `lint` runs
Checkstyle and `spotless:check` on a JDK with no database, and `build` builds the image and pushes
it to `ghcr.io/<owner>/server-spring`.
They run in parallel and share the workflow's path filters and concurrency group, which is why the
lint job lives here rather than in `quality-checks.yml` — that one is the client's and has no path
filter, so it would fire on client-only PRs.
