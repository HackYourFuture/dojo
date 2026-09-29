-- Partner organisations
create table organisations
(
    id           text        not null
        constraint organisations_pk primary key,
    picture_id   text,
    name         text        not null,
    website_url  text,
    linkedin_url text,
    location     text,
    status       text        not null,
    notes        text,
    created_at   timestamptz not null,
    updated_at   timestamptz not null
);

-- Organisation contact persons
create table contact_persons
(
    id              text        not null
        constraint contact_persons_pk primary key,
    organisation_id text        not null
        constraint contact_persons_organisation_fk references organisations on delete cascade,
    name            text        not null,
    email           text,
    phone           text,
    linkedin_url    text,
    job_title       text,
    notes           text,
    created_at      timestamptz not null,
    updated_at      timestamptz not null
);

create index contact_persons_organisation_idx on contact_persons (organisation_id);
