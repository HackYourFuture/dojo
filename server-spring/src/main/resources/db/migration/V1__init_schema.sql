create table users
(
    id         TEXT        not null constraint users_pk primary key,
    email      text        NOT NULL constraint users_email_unique unique,
    created_at timestamptz not null,
    updated_at timestamptz not null
);

-- The unique constraint above is case-sensitive, so this catches Alice@ vs alice@.
create unique index users_email_lower_unique on users (lower(email));
