create table users
(
    id         TEXT        not null constraint users_pk primary key,
    email      text        not null constraint users_email_unique unique,
    name       text        not null,
    image_url  text,
    is_active  boolean     not null,
    created_at timestamptz not null,
    updated_at timestamptz not null
);

-- users_email_unique is case-sensitive.
create unique index users_email_lower_unique on users (lower(email));
