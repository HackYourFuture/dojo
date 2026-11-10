-- Who a check-in was held with. Setting default to 'MENTOR' for migration from V1
alter table mentorship_checkins
    add column participant text not null default 'MENTOR';

alter table mentorship_checkins
    alter column participant drop default;
