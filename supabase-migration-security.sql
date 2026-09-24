-- ZRG Classics - Forum & Profile Security Hardening
-- Run this in the Supabase SQL Editor AFTER supabase-schema.sql.
-- Safe to re-run: every statement is idempotent.

-- ============================================
-- 1. PROFILE DATA CONSTRAINTS
-- ============================================
-- Match the registration form rules (3-20 letters, numbers, underscores).
-- NOT VALID enforces the rule on new/updated rows without failing on any
-- legacy rows; run "alter table ... validate constraint ..." once those are clean.
alter table public.profiles drop constraint if exists profiles_username_format;
alter table public.profiles
  add constraint profiles_username_format
  check (username ~ '^[A-Za-z0-9_]{3,20}$') not valid;

alter table public.profiles drop constraint if exists profiles_avatar_url_https;
alter table public.profiles
  add constraint profiles_avatar_url_https
  check (avatar_url is null or avatar_url ~* '^https://') not valid;

-- ============================================
-- 2. PROTECT SYSTEM-MANAGED COLUMNS
-- ============================================
-- RLS lets users update their own rows, but not every column on those rows
-- should be user-editable. These triggers reset protected columns whenever the
-- update comes from a client role (anon/authenticated). Counter updates made
-- by the security-definer trigger functions run as the table owner and pass.

create or replace function public.protect_profile_columns()
returns trigger as $$
begin
  if current_user in ('anon', 'authenticated') then
    NEW.id := OLD.id;
    NEW.reputation := OLD.reputation;
    NEW.post_count := OLD.post_count;
    NEW.created_at := OLD.created_at;
  end if;
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists protect_profile_columns on public.profiles;
create trigger protect_profile_columns
  before update on public.profiles
  for each row execute procedure public.protect_profile_columns();

create or replace function public.protect_thread_columns()
returns trigger as $$
begin
  if current_user in ('anon', 'authenticated') then
    NEW.author_id := OLD.author_id;
    NEW.category_id := OLD.category_id;
    NEW.is_pinned := OLD.is_pinned;
    NEW.is_locked := OLD.is_locked;
    NEW.view_count := OLD.view_count;
    NEW.reply_count := OLD.reply_count;
    NEW.last_reply_at := OLD.last_reply_at;
    NEW.last_reply_by := OLD.last_reply_by;
    NEW.created_at := OLD.created_at;
  end if;
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists protect_thread_columns on public.forum_threads;
create trigger protect_thread_columns
  before update on public.forum_threads
  for each row execute procedure public.protect_thread_columns();

create or replace function public.protect_reply_columns()
returns trigger as $$
begin
  if current_user in ('anon', 'authenticated') then
    NEW.thread_id := OLD.thread_id;
    NEW.author_id := OLD.author_id;
    NEW.created_at := OLD.created_at;
  end if;
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists protect_reply_columns on public.forum_replies;
create trigger protect_reply_columns
  before update on public.forum_replies
  for each row execute procedure public.protect_reply_columns();

-- ============================================
-- 3. BLOCK REPLIES TO LOCKED THREADS
-- ============================================
drop policy if exists "Authenticated users can create replies" on public.forum_replies;
create policy "Authenticated users can create replies"
  on public.forum_replies for insert
  with check (
    auth.uid() = author_id
    and exists (
      select 1 from public.forum_threads t
      where t.id = thread_id and not t.is_locked
    )
  );

-- ============================================
-- 4. OPTIONAL: REMOVE RETIRED INVOICE TABLES
-- ============================================
-- The Invoice Creator tool has been removed from the site. Export any invoice
-- data you want to keep, then uncomment and run these two lines.
-- drop table if exists public.invoices;
-- drop table if exists public.invoice_templates;
