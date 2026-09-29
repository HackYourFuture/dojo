-- Interactions with organisations: each profile type has its own column, and exactly one of them is set
alter table interactions
    alter column trainee_id drop not null,
    add column organisation_id text
        constraint interactions_organisation_fk references organisations on delete cascade,
    add constraint interactions_one_profile check (num_nonnulls(trainee_id, organisation_id) = 1);

create index interactions_organisation_idx on interactions (organisation_id);
