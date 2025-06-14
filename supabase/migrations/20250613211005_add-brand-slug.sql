alter table "public"."brands" add column "slug" text not null;

CREATE UNIQUE INDEX idx_brands_slug_unique ON public.brands USING btree (slug);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.generate_brand_slug(brand_name text, brand_id bigint DEFAULT NULL::bigint)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
declare
  base_slug text;
  final_slug text;
  counter integer := 0;
begin
  -- Create base slug from name
  base_slug := lower(trim(brand_name));
  -- Replace spaces and special characters with hyphens
  base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
  -- Remove leading/trailing hyphens
  base_slug := trim(base_slug, '-');
  -- Ensure slug is not empty
  if base_slug = '' then
    base_slug := 'brand';
  end if;
  
  final_slug := base_slug;
  
  -- Check for uniqueness and append counter if needed
  while exists (
    select 1 from public.brands 
    where slug = final_slug 
    and (brand_id is null or id != brand_id)
  ) loop
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  end loop;
  
  return final_slug;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.set_brand_slug()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  -- Only generate slug if name changed or slug is empty
  if TG_OP = 'INSERT' or OLD.name != NEW.name or NEW.slug is null or NEW.slug = '' then
    NEW.slug := public.generate_brand_slug(NEW.name, NEW.id);
  end if;
  return NEW;
end;
$function$
;

CREATE TRIGGER trigger_brands_set_slug BEFORE INSERT OR UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION set_brand_slug();


