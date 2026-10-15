-- Exunus Academy identity profile. Provision rows from trusted server/admin workflows only.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  full_name text not null default '',
  app_role text not null default 'student'
    check (app_role in (
      'super_admin', 'school_admin', 'principal', 'vice_principal',
      'academic_director', 'registrar', 'teacher', 'student', 'parent',
      'accountant', 'hr_manager', 'librarian', 'transport_manager',
      'store_manager', 'staff'
    )),
  school_id text not null,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists profiles_username_case_insensitive
  on public.profiles (lower(username))
  where username is not null;

alter table public.profiles enable row level security;

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;

drop policy if exists "Users read their own profile" on public.profiles;
create policy "Users read their own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

-- Deliberately no client INSERT/UPDATE policy. Account creation, username assignment,
-- school assignment, activation, and role changes must be done by a trusted admin workflow.
