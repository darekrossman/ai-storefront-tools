create table "public"."waitlist" (
    "id" uuid not null default gen_random_uuid(),
    "email" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone,
    "source" text default 'homepage'::text,
    "status" text not null default 'active'::text,
    "metadata" jsonb default '{}'::jsonb
);


alter table "public"."waitlist" enable row level security;

CREATE INDEX waitlist_created_at_idx ON public.waitlist USING btree (created_at DESC);

CREATE INDEX waitlist_email_idx ON public.waitlist USING btree (email);

CREATE UNIQUE INDEX waitlist_email_key ON public.waitlist USING btree (email);

CREATE UNIQUE INDEX waitlist_pkey ON public.waitlist USING btree (id);

CREATE INDEX waitlist_status_idx ON public.waitlist USING btree (status);

alter table "public"."waitlist" add constraint "waitlist_pkey" PRIMARY KEY using index "waitlist_pkey";

alter table "public"."waitlist" add constraint "waitlist_email_key" UNIQUE using index "waitlist_email_key";

alter table "public"."waitlist" add constraint "waitlist_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'notified'::text, 'disabled'::text]))) not valid;

alter table "public"."waitlist" validate constraint "waitlist_status_check";

grant delete on table "public"."waitlist" to "anon";

grant insert on table "public"."waitlist" to "anon";

grant references on table "public"."waitlist" to "anon";

grant select on table "public"."waitlist" to "anon";

grant trigger on table "public"."waitlist" to "anon";

grant truncate on table "public"."waitlist" to "anon";

grant update on table "public"."waitlist" to "anon";

grant delete on table "public"."waitlist" to "authenticated";

grant insert on table "public"."waitlist" to "authenticated";

grant references on table "public"."waitlist" to "authenticated";

grant select on table "public"."waitlist" to "authenticated";

grant trigger on table "public"."waitlist" to "authenticated";

grant truncate on table "public"."waitlist" to "authenticated";

grant update on table "public"."waitlist" to "authenticated";

grant delete on table "public"."waitlist" to "service_role";

grant insert on table "public"."waitlist" to "service_role";

grant references on table "public"."waitlist" to "service_role";

grant select on table "public"."waitlist" to "service_role";

grant trigger on table "public"."waitlist" to "service_role";

grant truncate on table "public"."waitlist" to "service_role";

grant update on table "public"."waitlist" to "service_role";

create policy "Allow public waitlist signups"
on "public"."waitlist"
as permissive
for insert
to anon, authenticated
with check (true);


create policy "Authenticated users can read waitlist"
on "public"."waitlist"
as permissive
for select
to authenticated
using (true);


CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.waitlist FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


