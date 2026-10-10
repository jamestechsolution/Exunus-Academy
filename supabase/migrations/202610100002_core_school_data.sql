-- Core PostgreSQL foundation for Exunus Academy.
-- This migration creates durable tenant-scoped tables. The current Express API
-- still uses seed data until its routes are explicitly migrated to these tables.

create table if not exists public.schools (
  id text primary key,
  name text not null,
  code text unique,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now()
);

create table if not exists public.students (
  id text primary key,
  school_id text not null references public.schools(id) on delete restrict,
  admission_number text not null,
  first_name text not null,
  last_name text not null,
  grade_level_id text,
  section_id text,
  status text not null default 'enrolled',
  profile_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (school_id, admission_number)
);

create table if not exists public.teachers (
  id text primary key,
  school_id text not null references public.schools(id) on delete restrict,
  employee_number text,
  first_name text not null,
  last_name text not null,
  status text not null default 'active',
  profile_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (school_id, employee_number)
);

create table if not exists public.attendance_records (
  id text primary key,
  school_id text not null references public.schools(id) on delete restrict,
  student_id text not null references public.students(id) on delete cascade,
  section_id text,
  attendance_date date not null,
  status text not null check (status in ('present', 'absent', 'late', 'excused')),
  remarks text,
  marked_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (school_id, student_id, attendance_date)
);

create table if not exists public.exams (
  id text primary key,
  school_id text not null references public.schools(id) on delete restrict,
  title text not null,
  grade_level_id text,
  subject_id text,
  exam_date date,
  status text not null default 'draft' check (status in ('draft', 'published', 'closed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.exam_results (
  id text primary key,
  school_id text not null references public.schools(id) on delete restrict,
  exam_id text not null references public.exams(id) on delete cascade,
  student_id text not null references public.students(id) on delete cascade,
  subject_id text,
  score numeric(8,2) not null check (score >= 0),
  max_score numeric(8,2) not null check (max_score > 0),
  remarks text,
  marked_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (school_id, exam_id, student_id, subject_id),
  check (score <= max_score)
);

create table if not exists public.fee_payments (
  id text primary key,
  school_id text not null references public.schools(id) on delete restrict,
  student_id text not null references public.students(id) on delete restrict,
  receipt_number text not null,
  amount numeric(12,2) not null check (amount > 0),
  currency text not null default 'ETB',
  payment_method text,
  payment_date date not null default current_date,
  status text not null default 'completed' check (status in ('pending', 'completed', 'reversed')),
  recorded_by uuid references auth.users(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (school_id, receipt_number)
);

create index if not exists students_school_grade_section_idx
  on public.students (school_id, grade_level_id, section_id);
create index if not exists attendance_school_date_idx
  on public.attendance_records (school_id, attendance_date);
create index if not exists exam_results_school_student_idx
  on public.exam_results (school_id, student_id);
create index if not exists fee_payments_school_student_idx
  on public.fee_payments (school_id, student_id);

-- updated_at is maintained by the database rather than the client.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists students_set_updated_at on public.students;
create trigger students_set_updated_at before update on public.students
for each row execute function public.set_updated_at();

drop trigger if exists teachers_set_updated_at on public.teachers;
create trigger teachers_set_updated_at before update on public.teachers
for each row execute function public.set_updated_at();

drop trigger if exists exam_results_set_updated_at on public.exam_results;
create trigger exam_results_set_updated_at before update on public.exam_results
for each row execute function public.set_updated_at();

-- All data tables are tenant-scoped. A profile may only access rows for its
-- assigned school. Cross-school super-admin access must be implemented through
-- a separately audited server-only administrative path, not a client bypass.
alter table public.schools enable row level security;
alter table public.students enable row level security;
alter table public.teachers enable row level security;
alter table public.attendance_records enable row level security;
alter table public.exams enable row level security;
alter table public.exam_results enable row level security;
alter table public.fee_payments enable row level security;

drop policy if exists schools_same_tenant_select on public.schools;
create policy schools_same_tenant_select on public.schools
for select to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.is_active = true
      and (p.school_id = schools.id or p.app_role = 'super_admin')
  )
);

drop policy if exists students_same_tenant_select on public.students;
create policy students_same_tenant_select on public.students
for select to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_active = true
    and p.school_id = students.school_id
));

drop policy if exists students_staff_write on public.students;
create policy students_staff_write on public.students
for all to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_active = true
    and p.school_id = students.school_id
    and p.app_role in ('super_admin','school_admin','principal','vice_principal','academic_director','registrar')
))
with check (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_active = true
    and p.school_id = students.school_id
    and p.app_role in ('super_admin','school_admin','principal','vice_principal','academic_director','registrar')
));

drop policy if exists teachers_same_tenant_select on public.teachers;
create policy teachers_same_tenant_select on public.teachers
for select to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_active = true
    and p.school_id = teachers.school_id
));

drop policy if exists teachers_admin_write on public.teachers;
create policy teachers_admin_write on public.teachers
for all to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_active = true
    and p.school_id = teachers.school_id
    and p.app_role in ('super_admin','school_admin','principal','vice_principal','hr_manager')
))
with check (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_active = true
    and p.school_id = teachers.school_id
    and p.app_role in ('super_admin','school_admin','principal','vice_principal','hr_manager')
));

drop policy if exists attendance_same_tenant_read on public.attendance_records;
create policy attendance_same_tenant_read on public.attendance_records
for select to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_active = true
    and p.school_id = attendance_records.school_id
    and p.app_role in ('super_admin','school_admin','principal','vice_principal','academic_director','registrar','teacher')
));

drop policy if exists attendance_staff_write on public.attendance_records;
create policy attendance_staff_write on public.attendance_records
for all to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_active = true
    and p.school_id = attendance_records.school_id
    and p.app_role in ('super_admin','school_admin','principal','vice_principal','teacher')
))
with check (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_active = true
    and p.school_id = attendance_records.school_id
    and p.app_role in ('super_admin','school_admin','principal','vice_principal','teacher')
));

drop policy if exists exams_same_tenant_read on public.exams;
create policy exams_same_tenant_read on public.exams
for select to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_active = true
    and p.school_id = exams.school_id
));

drop policy if exists exams_staff_write on public.exams;
create policy exams_staff_write on public.exams
for all to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_active = true
    and p.school_id = exams.school_id
    and p.app_role in ('super_admin','school_admin','principal','vice_principal','academic_director','teacher')
))
with check (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_active = true
    and p.school_id = exams.school_id
    and p.app_role in ('super_admin','school_admin','principal','vice_principal','academic_director','teacher')
));

drop policy if exists exam_results_same_tenant_read on public.exam_results;
create policy exam_results_same_tenant_read on public.exam_results
for select to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_active = true
    and p.school_id = exam_results.school_id
    and p.app_role in ('super_admin','school_admin','principal','vice_principal','academic_director','registrar','teacher')
));

drop policy if exists exam_results_staff_write on public.exam_results;
create policy exam_results_staff_write on public.exam_results
for all to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_active = true
    and p.school_id = exam_results.school_id
    and p.app_role in ('super_admin','school_admin','principal','vice_principal','academic_director','teacher')
))
with check (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_active = true
    and p.school_id = exam_results.school_id
    and p.app_role in ('super_admin','school_admin','principal','vice_principal','academic_director','teacher')
));

drop policy if exists fee_payments_finance_read on public.fee_payments;
create policy fee_payments_finance_read on public.fee_payments
for select to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_active = true
    and p.school_id = fee_payments.school_id
    and p.app_role in ('super_admin','school_admin','principal','accountant','registrar')
));

drop policy if exists fee_payments_finance_write on public.fee_payments;
create policy fee_payments_finance_write on public.fee_payments
for all to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_active = true
    and p.school_id = fee_payments.school_id
    and p.app_role in ('super_admin','school_admin','accountant')
))
with check (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_active = true
    and p.school_id = fee_payments.school_id
    and p.app_role in ('super_admin','school_admin','accountant')
));

-- Authenticated users receive no implicit rights; RLS policies above are the gate.
grant select on public.schools, public.students, public.teachers,
  public.attendance_records, public.exams, public.exam_results, public.fee_payments
  to authenticated;
grant insert, update, delete on public.students, public.teachers,
  public.attendance_records, public.exams, public.exam_results, public.fee_payments
  to authenticated;
