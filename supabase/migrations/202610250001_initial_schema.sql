-- CampusExist initial schema for Supabase.
-- Review this migration before applying it to a project with existing data.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  course text not null default '',
  hostel text not null default '',
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (length(trim(title)) between 1 and 120),
  description text not null default '',
  category text not null,
  type text not null check (type in ('sell', 'rent', 'lend')),
  price numeric(10,2) not null default 0 check (price >= 0),
  condition text not null default 'good' check (condition in ('new', 'like_new', 'good', 'fair', 'poor')),
  image_url text,
  status text not null default 'available' check (status in ('available', 'reserved', 'sold', 'unavailable')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lost_found_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('lost', 'found')),
  title text not null check (length(trim(title)) between 1 and 120),
  description text not null default '',
  location text not null,
  report_date date not null default current_date,
  image_url text,
  status text not null default 'open' check (status in ('open', 'returned', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.borrow_requests (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  requester_id uuid not null references public.profiles(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  start_date date,
  end_date date,
  request_type text not null default 'borrow' check (request_type in ('borrow', 'purchase')),
  message text not null default '',
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined', 'returned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (requester_id <> owner_id),
  check (start_date is null or end_date is null or end_date >= start_date)
);

create table if not exists public.belongings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (length(trim(name)) between 1 and 120),
  category text not null default 'Other',
  serial_or_note text not null default '',
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_browse_idx on public.listings(status, type, category, created_at desc);
create index if not exists listings_owner_idx on public.listings(owner_id, created_at desc);
create index if not exists lost_found_browse_idx on public.lost_found_reports(status, kind, report_date desc);
create index if not exists borrow_requests_requester_idx on public.borrow_requests(requester_id, status, created_at desc);
create index if not exists borrow_requests_owner_idx on public.borrow_requests(owner_id, status, created_at desc);
create index if not exists belongings_owner_idx on public.belongings(owner_id, created_at desc);

-- Keep updated_at current on updates.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['profiles','listings','lost_found_reports','borrow_requests','belongings'] loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- Automatically create a profile when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- RLS is required on all tables exposed through the Supabase API.
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.lost_found_reports enable row level security;
alter table public.borrow_requests enable row level security;
alter table public.belongings enable row level security;

-- Profiles are private by default. A user can read/update only their own profile.
drop policy if exists "profile select own" on public.profiles;
create policy "profile select own" on public.profiles for select to authenticated using (id = (select auth.uid()));
drop policy if exists "profile update own" on public.profiles;
create policy "profile update own" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Marketplace listings are visible to signed-in users; only the owner can mutate them.
drop policy if exists "listings read authenticated" on public.listings;
create policy "listings read authenticated" on public.listings for select to authenticated using (true);
drop policy if exists "listings insert own" on public.listings;
create policy "listings insert own" on public.listings for insert to authenticated with check (owner_id = (select auth.uid()));
drop policy if exists "listings update own" on public.listings;
create policy "listings update own" on public.listings for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
drop policy if exists "listings delete own" on public.listings;
create policy "listings delete own" on public.listings for delete to authenticated using (owner_id = (select auth.uid()));

-- Lost/found reports are campus-visible to authenticated users; reporter manages own report.
drop policy if exists "reports read authenticated" on public.lost_found_reports;
create policy "reports read authenticated" on public.lost_found_reports for select to authenticated using (true);
drop policy if exists "reports insert own" on public.lost_found_reports;
create policy "reports insert own" on public.lost_found_reports for insert to authenticated with check (reporter_id = (select auth.uid()));
drop policy if exists "reports update own" on public.lost_found_reports;
create policy "reports update own" on public.lost_found_reports for update to authenticated using (reporter_id = (select auth.uid())) with check (reporter_id = (select auth.uid()));
drop policy if exists "reports delete own" on public.lost_found_reports;
create policy "reports delete own" on public.lost_found_reports for delete to authenticated using (reporter_id = (select auth.uid()));

-- Requests are visible only to requester and owner. New requests must match the listing owner.
drop policy if exists "requests read participants" on public.borrow_requests;
create policy "requests read participants" on public.borrow_requests for select to authenticated using (requester_id = (select auth.uid()) or owner_id = (select auth.uid()));
drop policy if exists "requests insert valid requester" on public.borrow_requests;
create policy "requests insert valid requester" on public.borrow_requests for insert to authenticated with check (
  requester_id = (select auth.uid())
  and owner_id <> (select auth.uid())
  and exists (
    select 1 from public.listings l
    where l.id = listing_id and l.owner_id = owner_id
      and l.status = 'available' and l.type in ('rent', 'lend')
  )
);
-- No direct UPDATE policy: request status changes should use the validated RPC below.

create or replace function public.respond_to_borrow_request(p_request_id uuid, p_status text)
returns public.borrow_requests
language plpgsql
security definer
set search_path = ''
as $$
declare updated_request public.borrow_requests;
begin
  if p_status not in ('approved', 'declined', 'returned') then
    raise exception 'Invalid request status';
  end if;

  update public.borrow_requests br
  set status = p_status
  where br.id = p_request_id
    and br.owner_id = (select auth.uid())
    and (
      (br.status = 'pending' and p_status in ('approved', 'declined'))
      or (br.status = 'approved' and p_status = 'returned')
    )
  returning br.* into updated_request;

  if updated_request.id is null then
    raise exception 'Request not found or transition not permitted';
  end if;
  return updated_request;
end;
$$;
revoke all on function public.respond_to_borrow_request(uuid, text) from public, anon;
grant execute on function public.respond_to_borrow_request(uuid, text) to authenticated;

-- Private inventory: owners only.
drop policy if exists "belongings owner all" on public.belongings;
create policy "belongings owner all" on public.belongings for all to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

-- Public read bucket for listing/report photos; authenticated users can upload only under their own UID folder.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('item-images', 'item-images', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "item images authenticated upload own folder" on storage.objects;
create policy "item images authenticated upload own folder" on storage.objects for insert to authenticated
with check (bucket_id = 'item-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "item images owner update" on storage.objects;
create policy "item images owner update" on storage.objects for update to authenticated
using (bucket_id = 'item-images' and owner_id = (select auth.uid())::text)
with check (bucket_id = 'item-images' and owner_id = (select auth.uid())::text);
drop policy if exists "item images owner delete" on storage.objects;
create policy "item images owner delete" on storage.objects for delete to authenticated
using (bucket_id = 'item-images' and owner_id = (select auth.uid())::text);
