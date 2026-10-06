-- Users
create table users
(
    id         text        not null
        constraint users_pk primary key,
    email      text        not null,
    name       text        not null,
    google_id  text
        constraint users_unique_key_google_id unique,
    picture_id text,
    is_active  boolean     not null,
    created_at timestamptz not null,
    updated_at timestamptz not null
);

create unique index users_email_upper_unique on users (upper(email));

-- Tokens
create table tokens
(
    id         text        not null
        constraint tokens_pk primary key,
    type       text        not null,
    token_hash text        not null,
    user_id    text        not null
        constraint tokens_user_fk references users on delete cascade,
    expires_at timestamptz not null,
    created_at timestamptz not null,
    updated_at timestamptz not null
);

create unique index tokens_hash_unique on tokens (token_hash);
create index tokens_user_idx on tokens (user_id);

-- Trainees
create table trainees
(
    -- Personal
    id                             text        not null
        constraint trainees_pk primary key,
    picture_id                     text,
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

-- Trainee employment history
create table employment_history
(
    id            text        not null
        constraint employment_history_pk primary key,
    trainee_id    text        not null
        constraint employment_history_trainee_fk references trainees on delete cascade,
    type          text        not null,
    company_name  text        not null,
    role          text        not null,
    start_date    date        not null,
    end_date      date,
    fee_collected boolean     not null,
    fee_amount    numeric(10, 2),
    comments      text,
    created_at    timestamptz not null,
    updated_at    timestamptz not null
);

create index employment_history_trainee_idx on employment_history (trainee_id);

-- Trainee assessments
create table assessments
(
    id         text        not null
        constraint assessments_pk primary key,
    trainee_id text        not null
        constraint assessments_trainee_fk references trainees on delete cascade,
    date       date        not null,
    type       text        not null,
    result     text        not null,
    score      numeric(4, 1),
    comments   text,
    created_at timestamptz not null,
    updated_at timestamptz not null
);

create index assessments_trainee_idx on assessments (trainee_id);

-- Volunteers
create table volunteers
(
    id            text        not null
        constraint volunteers_pk primary key,
    picture_id    text,
    first_name    text        not null,
    last_name     text        not null,
    gender        text,
    pronouns      text,
    company_name  text,
    job_role      text,
    email         text        not null,
    phone         text,
    github_handle text,
    slack_id      text,
    linkedin_url  text,
    status        text        not null,
    notes         text,
    created_at    timestamptz not null,
    updated_at    timestamptz not null
);

create unique index volunteers_email_upper_unique on volunteers (upper(email));

-- Partner organisations
create table organisations
(
    id                text        not null
        constraint organisations_pk primary key,
    picture_id        text,
    name              text        not null,
    website_url       text,
    linkedin_url      text,
    location          text,
    status            text        not null,
    partnership_types text[]      not null,
    responsible_ids   text[]      not null,
    notes             text,
    created_at        timestamptz not null,
    updated_at        timestamptz not null
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

-- Interactions
create table interactions
(
    id              text        not null
        constraint interactions_pk primary key,
    trainee_id      text
        constraint interactions_trainee_fk references trainees on delete cascade,
    organisation_id text
        constraint interactions_organisation_fk references organisations on delete cascade,
    volunteer_id    text
        constraint interactions_volunteer_fk references volunteers on delete cascade,
    date            timestamptz not null,
    type            text        not null,
    reporter_id     text        not null
        constraint interactions_reporter_fk references users on delete restrict,
    title           text        not null,
    details         text        not null,
    created_at      timestamptz not null,
    updated_at      timestamptz not null,
    -- Exactly one profile per interaction
    constraint interactions_one_profile check (num_nonnulls(trainee_id, organisation_id, volunteer_id) = 1)
);

create index interactions_trainee_idx on interactions (trainee_id);
create index interactions_organisation_idx on interactions (organisation_id);
create index interactions_volunteer_idx on interactions (volunteer_id);
