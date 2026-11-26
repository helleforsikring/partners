-- Samlet skema for LEA Landingpages (svarer til de 8 Lovable-migrationer + drizzle-politikken)
-- Køres én gang i en ny, tom Supabase.

create table public.landing_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  badge_text text not null default '',
  hero_highlight text not null default 'skræddersyet',
  accent_color text not null default '#3994BA',
  accent_hover_color text not null default '#2d7a99',
  badge_bg_color text not null default '#341132',
  logo_url text,
  meta_title text not null default '',
  meta_description text not null default '',
  is_visible boolean not null default true,
  deleted_at timestamptz,
  products jsonb not null default '[
  {"key":"indbo","label":"Indboforsikring","calculator_url":"https://demo.leaforsikring.dk/forsikring/indbo/beregner","input_type":"text","input_label":"Søg din adresse","input_placeholder":"F.eks. Strandgade 12, 1401 København K","input_suffix":"","options":[]},
  {"key":"husleje","label":"Huslejeforsikring","calculator_url":"https://demo.leaforsikring.dk/forsikring/husleje/beregner","input_type":"number","input_label":"Månedlig husleje","input_placeholder":"F.eks. 8500","input_suffix":"kr./md.","options":[]},
  {"key":"ulykke","label":"Ulykkesforsikring","calculator_url":"https://demo.leaforsikring.dk/forsikring/ulykke/beregner","input_type":"select","input_label":"Vælg din beskæftigelse","input_placeholder":"Vælg beskæftigelse","input_suffix":"","options":["Lønmodtager","Selvstændig","Studerende","Pensionist","Arbejdssøgende","Andet"]}
]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.page_content (
  id uuid primary key default gen_random_uuid(),
  slug text not null references public.landing_pages(slug) on delete cascade on update cascade,
  key text not null,
  value text not null default '',
  updated_at timestamptz not null default now(),
  unique (slug, key)
);

create table public.admin_audit_log (
  id uuid not null default gen_random_uuid() primary key,
  table_name text not null,
  slug text,
  action text not null,
  field text,
  old_value text,
  new_value text,
  actor_email text,
  created_at timestamptz not null default now()
);
create index idx_audit_created_at on public.admin_audit_log (created_at desc);

-- Funktioner
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((auth.jwt() ->> 'email') = 'info@helleforsikring.dk', false)
$$;

create trigger lp_touch before update on public.landing_pages for each row execute function public.touch_updated_at();
create trigger pc_touch before update on public.page_content for each row execute function public.touch_updated_at();

-- RLS
alter table public.landing_pages enable row level security;
alter table public.page_content enable row level security;
alter table public.admin_audit_log enable row level security;

create policy lp_read_active on public.landing_pages for select to anon, authenticated
  using (deleted_at is null or public.is_admin());
create policy lp_admin_insert on public.landing_pages for insert to authenticated with check (public.is_admin());
create policy lp_admin_update on public.landing_pages for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy lp_admin_delete on public.landing_pages for delete to authenticated using (public.is_admin());

create policy pc_read_active on public.page_content for select to anon, authenticated
  using (public.is_admin() or exists (select 1 from public.landing_pages lp where lp.slug = page_content.slug and lp.deleted_at is null));
create policy pc_admin_insert on public.page_content for insert to authenticated with check (public.is_admin());
create policy pc_admin_update on public.page_content for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy pc_admin_delete on public.page_content for delete to authenticated using (public.is_admin());

create policy audit_admin_read on public.admin_audit_log for select to authenticated using (public.is_admin());
create policy audit_admin_insert on public.admin_audit_log for insert to authenticated with check (public.is_admin());

-- Audit-triggere
create or replace function public.log_page_content_change()
returns trigger language plpgsql security definer set search_path = public as $$
declare email_val text := coalesce(auth.jwt() ->> 'email', 'system');
begin
  if tg_op = 'INSERT' then
    insert into public.admin_audit_log(table_name, slug, action, field, old_value, new_value, actor_email)
    values ('page_content', new.slug, 'create', new.key, null, new.value, email_val);
    return new;
  elsif tg_op = 'UPDATE' then
    if new.value is distinct from old.value then
      insert into public.admin_audit_log(table_name, slug, action, field, old_value, new_value, actor_email)
      values ('page_content', new.slug, 'update', new.key, old.value, new.value, email_val);
    end if;
    return new;
  elsif tg_op = 'DELETE' then
    insert into public.admin_audit_log(table_name, slug, action, field, old_value, new_value, actor_email)
    values ('page_content', old.slug, 'delete', old.key, old.value, null, email_val);
    return old;
  end if;
  return null;
end; $$;

create or replace function public.log_landing_page_change()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  email_val text := coalesce(auth.jwt() ->> 'email', 'system');
  k text;
  fields text[] := array['name','slug','badge_text','hero_highlight','accent_color','accent_hover_color','badge_bg_color','logo_url','meta_title','meta_description','is_visible','deleted_at'];
  old_json jsonb; new_json jsonb;
begin
  if tg_op = 'INSERT' then
    insert into public.admin_audit_log(table_name, slug, action, field, old_value, new_value, actor_email)
    values ('landing_pages', new.slug, 'create', 'name', null, new.name, email_val);
    return new;
  elsif tg_op = 'UPDATE' then
    old_json := to_jsonb(old); new_json := to_jsonb(new);
    foreach k in array fields loop
      if (old_json -> k) is distinct from (new_json -> k) then
        insert into public.admin_audit_log(table_name, slug, action, field, old_value, new_value, actor_email)
        values ('landing_pages', new.slug, 'update', k, old_json ->> k, new_json ->> k, email_val);
      end if;
    end loop;
    return new;
  elsif tg_op = 'DELETE' then
    insert into public.admin_audit_log(table_name, slug, action, field, old_value, new_value, actor_email)
    values ('landing_pages', old.slug, 'delete', null, old.name, null, email_val);
    return old;
  end if;
  return null;
end; $$;

create trigger trg_page_content_audit after insert or update or delete on public.page_content
  for each row execute function public.log_page_content_change();
create trigger trg_landing_pages_audit after insert or update or delete on public.landing_pages
  for each row execute function public.log_landing_page_change();

revoke execute on function public.log_page_content_change() from public, anon, authenticated;
revoke execute on function public.log_landing_page_change() from public, anon, authenticated;

-- Storage: offentlig logo-bucket, kun admin må skrive
insert into storage.buckets (id, name, public) values ('logos', 'logos', true) on conflict (id) do nothing;
create policy logos_public_get on storage.objects for select using (bucket_id = 'logos');
create policy logos_admin_insert on storage.objects for insert to authenticated with check (bucket_id = 'logos' and public.is_admin());
create policy logos_admin_update on storage.objects for update to authenticated using (bucket_id = 'logos' and public.is_admin());
create policy logos_admin_delete on storage.objects for delete to authenticated using (bucket_id = 'logos' and public.is_admin());
