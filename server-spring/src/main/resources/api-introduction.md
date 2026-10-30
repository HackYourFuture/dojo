Dojo is HackYourFuture's internal tool for tracking trainees, volunteers and partner organisations. This API
serves the Dojo web client, and scripts and integrations can use it too.

Every endpoint is under `/api` and speaks JSON, apart from picture uploads and downloads and the CSV exports.

## Authentication

Every endpoint needs a signed-in Dojo user, apart from signing in itself. A request carries one of two
credentials:

- **An API token**, for scripts and integrations, in an `Authorization: Bearer dojo_api_…` header. It lasts a
  year. No endpoint hands them out: ask a Dojo maintainer for one.
- **The session cookie** `dojo_access_token`, for the web client. Signing in with Google sets it for 15 minutes,
  and `POST /api/auth/refresh` renews it for up to 14 days.

To try requests on this page, paste an API token under **Authentication**.

A request that changes data with the cookie must also send an `Origin` header that Dojo knows. Browsers do that
themselves, and requests with an API token are exempt.

## Errors

Every error has the same body, `{ "error": "…" }`, with a message written for people, such as "Email is already in
use by another trainee."

| Status | Meaning                                                                        |
|--------|--------------------------------------------------------------------------------|
| `400`  | The body or a parameter is invalid                                             |
| `401`  | No valid session or API token. Unknown paths answer `401` too, not `404`       |
| `403`  | Not allowed, such as changing an interaction someone else recorded             |
| `404`  | No record has that id                                                          |
| `409`  | The change clashes with existing data, such as an email address already in use |
| `413`  | The upload is larger than 10 MB                                                |

## Conventions

### Ids, fields and dates

- Records have 10-character random ids such as `Xy7Pq2Lm9A`, set by the server. Countries use their ISO code,
  such as `NL`, and cities a readable id, such as `amsterdam`.
- Field names are camelCase. A response always has every field of its schema, with `null` for a value that is
  not set.
- Enum values are upper case with underscores, such as `ON_HOLD`, in bodies and query parameters alike.
- Dates are ISO 8601: `2026-03-01` for a day and `2024-01-15T14:30:00Z` for a moment.

### Paging

The trainee, volunteer, organisation and mentorship lists return one page at a time. `page` counts from 0, and
`size` is 25 unless you ask for up to 100, or up to 5000 trainees. Each filter narrows the list, and a filter
repeated in the query matches any of its values. The trainee, volunteer and organisation lists each have a
`GET …/export` too, which takes the same filters and returns every row they match as a CSV file in the order of
the list: UTF-8 with a byte order mark, named like `trainees-2026-10-29.csv`.

```json
{
  "content": [],
  "page": {
    "size": 25,
    "number": 0,
    "totalElements": 132,
    "totalPages": 6
  }
}
```

### Updates

Trainees, volunteers and organisations change with `PATCH`: send only the fields to change. A field you leave
out keeps its value, and a field you send as `null` is cleared. Other records are replaced whole with `PUT`.

### Pictures

Trainees, volunteers and users have a picture, and organisations a logo. Upload one with `PUT …/picture` as
`multipart/form-data`, the image in the `picture` part: a JPEG, PNG, GIF, BMP, TIFF or WebP file up to 10 MB.
Dojo stores it as a JPEG with a thumbnail and returns the URLs of both. Every upload gets a new picture id, so a
picture URL never changes content and browsers can cache it.
