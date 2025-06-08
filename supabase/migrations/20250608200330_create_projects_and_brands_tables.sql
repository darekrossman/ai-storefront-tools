create type "public"."brand_status" as enum ('draft', 'active', 'archived');

create type "public"."session_status" as enum ('active', 'completed', 'archived');

drop policy "Public profiles are viewable by everyone." on "public"."profiles";

drop policy "Users can insert their own profile." on "public"."profiles";

drop policy "Users can update own profile." on "public"."profiles";

create table "public"."brands" (
    "id" bigint generated always as identity not null,
    "project_id" bigint not null,
    "name" text not null,
    "tagline" text,
    "mission" text,
    "vision" text,
    "values" text[] default '{}'::text[],
    "target_market" jsonb default '{}'::jsonb,
    "brand_personality" jsonb default '{}'::jsonb,
    "positioning" jsonb default '{}'::jsonb,
    "visual_identity" jsonb default '{}'::jsonb,
    "status" brand_status not null default 'draft'::brand_status,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."brands" enable row level security;

create table "public"."projects" (
    "id" bigint generated always as identity not null,
    "user_id" uuid not null,
    "name" text not null,
    "description" text,
    "status" session_status not null default 'active'::session_status,
    "settings" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."projects" enable row level security;

CREATE UNIQUE INDEX brands_pkey ON public.brands USING btree (id);

CREATE INDEX idx_brands_brand_personality_gin ON public.brands USING gin (brand_personality);

CREATE INDEX idx_brands_created_at_desc ON public.brands USING btree (created_at DESC);

CREATE INDEX idx_brands_name ON public.brands USING btree (name);

CREATE INDEX idx_brands_positioning_gin ON public.brands USING gin (positioning);

CREATE INDEX idx_brands_project_id ON public.brands USING btree (project_id);

CREATE INDEX idx_brands_status ON public.brands USING btree (status);

CREATE INDEX idx_brands_target_market_gin ON public.brands USING gin (target_market);

CREATE INDEX idx_brands_visual_identity_gin ON public.brands USING gin (visual_identity);

CREATE INDEX idx_projects_created_at_desc ON public.projects USING btree (created_at DESC);

CREATE INDEX idx_projects_status ON public.projects USING btree (status);

CREATE INDEX idx_projects_user_id ON public.projects USING btree (user_id);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id);

alter table "public"."brands" add constraint "brands_pkey" PRIMARY KEY using index "brands_pkey";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."brands" add constraint "brands_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE not valid;

alter table "public"."brands" validate constraint "brands_project_id_fkey";

alter table "public"."projects" add constraint "projects_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."projects" validate constraint "projects_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

grant delete on table "public"."brands" to "anon";

grant insert on table "public"."brands" to "anon";

grant references on table "public"."brands" to "anon";

grant select on table "public"."brands" to "anon";

grant trigger on table "public"."brands" to "anon";

grant truncate on table "public"."brands" to "anon";

grant update on table "public"."brands" to "anon";

grant delete on table "public"."brands" to "authenticated";

grant insert on table "public"."brands" to "authenticated";

grant references on table "public"."brands" to "authenticated";

grant select on table "public"."brands" to "authenticated";

grant trigger on table "public"."brands" to "authenticated";

grant truncate on table "public"."brands" to "authenticated";

grant update on table "public"."brands" to "authenticated";

grant delete on table "public"."brands" to "service_role";

grant insert on table "public"."brands" to "service_role";

grant references on table "public"."brands" to "service_role";

grant select on table "public"."brands" to "service_role";

grant trigger on table "public"."brands" to "service_role";

grant truncate on table "public"."brands" to "service_role";

grant update on table "public"."brands" to "service_role";

grant delete on table "public"."projects" to "anon";

grant insert on table "public"."projects" to "anon";

grant references on table "public"."projects" to "anon";

grant select on table "public"."projects" to "anon";

grant trigger on table "public"."projects" to "anon";

grant truncate on table "public"."projects" to "anon";

grant update on table "public"."projects" to "anon";

grant delete on table "public"."projects" to "authenticated";

grant insert on table "public"."projects" to "authenticated";

grant references on table "public"."projects" to "authenticated";

grant select on table "public"."projects" to "authenticated";

grant trigger on table "public"."projects" to "authenticated";

grant truncate on table "public"."projects" to "authenticated";

grant update on table "public"."projects" to "authenticated";

grant delete on table "public"."projects" to "service_role";

grant insert on table "public"."projects" to "service_role";

grant references on table "public"."projects" to "service_role";

grant select on table "public"."projects" to "service_role";

grant trigger on table "public"."projects" to "service_role";

grant truncate on table "public"."projects" to "service_role";

grant update on table "public"."projects" to "service_role";

create policy "Users can delete brands from their own projects"
on "public"."brands"
as permissive
for delete
to authenticated
using ((project_id IN ( SELECT projects.id
   FROM projects
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can insert brands into their own projects"
on "public"."brands"
as permissive
for insert
to authenticated
with check ((project_id IN ( SELECT projects.id
   FROM projects
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can update brands from their own projects"
on "public"."brands"
as permissive
for update
to authenticated
using ((project_id IN ( SELECT projects.id
   FROM projects
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can view brands from their own projects"
on "public"."brands"
as permissive
for select
to authenticated
using ((project_id IN ( SELECT projects.id
   FROM projects
  WHERE (projects.user_id = auth.uid()))));


create policy "Public profiles are viewable by everyone"
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Users can insert their own profile"
on "public"."profiles"
as permissive
for insert
to authenticated
with check ((auth.uid() = id));


create policy "Users can update own profile"
on "public"."profiles"
as permissive
for update
to authenticated
using ((auth.uid() = id));


create policy "Users can delete their own projects"
on "public"."projects"
as permissive
for delete
to authenticated
using ((user_id = auth.uid()));


create policy "Users can insert their own projects"
on "public"."projects"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "Users can update their own projects"
on "public"."projects"
as permissive
for update
to authenticated
using ((user_id = auth.uid()));


create policy "Users can view their own projects"
on "public"."projects"
as permissive
for select
to authenticated
using ((user_id = auth.uid()));


CREATE TRIGGER trigger_brands_updated_at BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trigger_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


