create table users
(
    id   TEXT not null  constraint users_pk primary key,
    email text NOT NULL constraint users_email_unique unique
);
