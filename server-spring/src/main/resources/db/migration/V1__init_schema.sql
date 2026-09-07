create table users
(
    id         TEXT        not null constraint users_pk primary key,
    email      text        not null,
    name       text        not null,
    image_url  text,
    is_active  boolean     not null,
    created_at timestamptz not null,
    updated_at timestamptz not null
);

-- Email uniqueness is enforced case-insensitively via the index below (upper(email)).
create unique index users_email_upper_unique on users (upper(email));