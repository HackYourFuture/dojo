-- Users
create table users
(
    id         TEXT        not null
        constraint users_pk primary key,
    email      text        not null,
    name       text        not null,
    image_url  text,
    is_active  boolean     not null,
    created_at timestamptz not null,
    updated_at timestamptz not null
);

create unique index users_email_upper_unique on users (upper(email));

-- Trainees
create table trainees
(
    -- Personal
    id                             TEXT        not null
        constraint trainees_pk primary key,
    image_url                      text,
    thumbnail_url                  text,
    first_name                     text        not null,
    last_name                      text        not null,
    preferred_name                 text,
    gender                         text,
    pronouns                       text,
    date_of_birth                  date,
    location                       text,
    english_level                  text,
    professional_dutch             boolean,
    country_of_origin              text,
    background                     text,
    nl_arrival_date                date,
    first_permit_issue_date        date,
    financial_support              text,
    education_level                text,
    education_background           text,
    weekly_work_hours              int,
    dietary_preference             text,
    health_condition               text,
    comments                       text,
    esf_id                         text,

    -- Contact
    email                          text        not null,
    slack_id                       text,
    phone                          text,
    github_handle                  text,
    linkedin_url                   text,
    emergency_contact_name         text,
    emergency_contact_relationship text,
    emergency_contact_phone        text,

    -- Education
    start_cohort                   int         not null,
    current_cohort                 int,
    track                          text        not null,
    learning_status                text        not null,
    start_date                     date,
    graduation_date                date,
    quit_date                      date,
    quit_reason                    text,
    mentor_tech                    text,
    mentor_hr                      text,
    mentor_english                 text,

    -- Placement
    job_path                       text        not null,
    job_support_end_date           date,
    has_car                        boolean,

    created_at                     timestamptz not null,
    updated_at                     timestamptz not null
);

create unique index trainees_email_upper_unique on trainees (upper(email));
create index trainees_first_name_upper_idx on trainees (upper(first_name));
create index trainees_last_name_upper_idx on trainees (upper(last_name));
create index trainees_esf_id_idx on trainees (esf_id);
