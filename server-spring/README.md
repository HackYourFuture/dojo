# Dojo server (Spring Boot)

Dojo backend rewritten in Java with Spring Boot. The API root path is `/api`.

## Service dependencies

* PostgreSQL database

## Prerequisites

1. Java 25 or later
2. [Docker](https://www.docker.com/get-started/) — for the local database

Maven is not needed; use the bundled `./mvnw` wrapper.

## 🛠️ First time setup for local development

1. Open a terminal in the `server-spring` directory.
2. Start a local PostgreSQL:

   ```bash
   docker run -d --name hyf-dojo -p 5432:5432 \
     -e POSTGRES_DB=dojo -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=password \
     postgres:18.4-alpine
   ```

3. Run the server:

   ```bash
   SPRING_PROFILES_ACTIVE=dev ./mvnw spring-boot:run
   ```

   Flyway creates the schema on first start. No other setup needed.

4. Check it works: <http://localhost:7777/api/docs>

The default settings already point at the database above, so no `.env` file is required for local
development.

## ▶️ Running

```bash
SPRING_PROFILES_ACTIVE=dev ./mvnw spring-boot:run   # development
./mvnw test                                         # tests (needs the database running)
./mvnw package                                      # build a jar into target/
java -jar target/dojo-server-1.0.0.jar              # run the jar
```

## 🐳 Deploying with Docker

```bash
docker build -t dojo-server .

docker run -d -p 7777:7777 \
  -e DB_HOST=your-db-host \
  -e DB_PORT=5432 \
  -e DB_NAME=dojo \
  -e DB_USER=dojo \
  -e DB_PASSWORD=secret \
  dojo-server
```

The image runs the `prod` profile by default, as a non-root user, on port 7777. All five `DB_*`
variables are required in production — the container will not start without them.

`.github/workflows/build-server-spring.yml` builds this image and pushes it to GHCR on every push
to `main`.

## ⚙️ Environment variables

| Name | Description | Required |
|---|---|---|
| `DB_HOST` | Database host. Defaults to `localhost` outside production. | Yes in prod |
| `DB_PORT` | Database port. Defaults to `5432` outside production. | Yes in prod |
| `DB_NAME` | Database name. Defaults to `dojo` outside production. | Yes in prod |
| `DB_USER` | Database user. Defaults to `admin` outside production. | Yes in prod |
| `DB_PASSWORD` | Database password. Defaults to `password` outside production. | Yes in prod |
| `SPRING_PROFILES_ACTIVE` | `dev`, `test` or `prod`. The Docker image sets `prod`. | No |
| `SERVER_PORT` | Port the server listens on. Defaults to `7777`. | No |

The `prod` profile deliberately has no defaults for the `DB_*` variables, so a misconfigured
deployment fails at startup instead of quietly connecting somewhere wrong.

## 📝 API docs

Interactive docs at `/api/docs`, the raw OpenAPI document at `/api/docs/openapi`. Both are
disabled on the `prod` profile.

Health check: `/actuator/health`.

## 🧱 Architecture

Code is grouped by feature — each feature owns its whole stack. Inside a feature, a request flows
through four layers:

| Layer | What it does |
|---|---|
| **Controller** | Maps HTTP to Java. Validates the request body, returns DTOs, and documents the endpoint for OpenAPI. No business logic. |
| **Service** | The business logic, and the transaction boundary. Loads entities, applies rules, throws `DojoException` subclasses when something is wrong. |
| **Repository** | Database access, via Spring Data JPA. Usually just an interface — Spring writes the queries. |
| **Entity** | A row in the database, mapped to a Java class. |

Two supporting pieces sit outside the features:

* **`config/`** — security, error handling, OpenAPI and profile configuration. `GlobalExceptionHandler`
  turns every exception into the same `DojoError` JSON shape.
* **`shared/`** — small helpers used across features, plus the `DojoException` family that decides
  which HTTP status an error becomes.

DTOs never leak entities to the outside: controllers accept a request record and return a response
record, and the entity stays inside the service and repository.

## 🗄️ Database migrations

Schema changes live in `src/main/resources/db/migration` and are applied by Flyway at startup.
Hibernate validates the schema against the entities, so the app refuses to start if the two
disagree.
