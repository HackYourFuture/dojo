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

create table trainees
(
    id             TEXT        not null constraint trainees_pk primary key,
    image_url      text,
    thumbnail_url  text,
    first_name     text        not null,
    last_name      text        not null,
    preferred_name text,
    email          text        not null,
    gender         text,
    pronouns       text,
    created_at     timestamptz not null,
    updated_at     timestamptz not null
);

-- Email uniqueness is enforced case-insensitively via the index below (upper(email)).
create unique index trainees_email_upper_unique on trainees (upper(email));

-- upper(...) to match the case-insensitive lookups the future trainee search will run.
create index trainees_first_name_upper_idx on trainees (upper(first_name));
create index trainees_last_name_upper_idx on trainees (upper(last_name));
