-- ZRG Classics - Forum moderation
-- Run this in the Supabase SQL Editor AFTER supabase-migration-security.sql.
-- Safe to re-run: every statement is idempotent.
--
-- Adds a moderator flag to profiles and three functions the site calls to
-- pin, lock, or delete threads and delete replies. The functions check the
-- caller's flag themselves and run with the table owner's rights, so the
-- column-protection triggers from the security migration still stop regular
-- users from pinning or locking their own threads.
--
-- To make yourself a moderator (after signing up on the site):
--   update public.profiles set is_moderator = true where username = 'YOUR_USERNAME';

-- ============================================
-- 1. MODERATOR FLAG
-- ============================================
alter table public.profiles
  add column if not exists is_moderator boolean not null default false;

-- Users can't grant themselves the flag: reset it on client updates...
create or replace function public.protect_profile_columns()
returns trigger as $$
begin
  if current_user in ('anon', 'authenticated') then
    NEW.id := OLD.id;
    NEW.reputation := OLD.reputation;
    NEW.post_count := OLD.post_count;
    NEW.created_at := OLD.created_at;
    NEW.is_moderator := OLD.is_moderator;
  end if;
  return NEW;
end;
$$ language plpgsql;

-- ...and refuse it on client inserts.
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id and not is_moderator);

-- ============================================
-- 2. MODERATION FUNCTIONS
-- ============================================
create or replace function public.is_moderator()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select coalesce((select is_moderator from public.profiles where id = auth.uid()), false);
$$;

-- p_action: 'pin', 'unpin', 'lock', 'unlock', or 'delete'
create or replace function public.moderate_thread(p_thread_id int, p_action text)
returns void
language plpgsql security definer
set search_path = public
as $$
begin
  if not public.is_moderator() then
    raise exception 'Only moderators can do that' using errcode = '42501';
  end if;

  if p_action = 'pin' then
    update public.forum_threads set is_pinned = true where id = p_thread_id;
  elsif p_action = 'unpin' then
    update public.forum_threads set is_pinned = false where id = p_thread_id;
  elsif p_action = 'lock' then
    update public.forum_threads set is_locked = true where id = p_thread_id;
  elsif p_action = 'unlock' then
    update public.forum_threads set is_locked = false where id = p_thread_id;
  elsif p_action = 'delete' then
    delete from public.forum_threads where id = p_thread_id;
  else
    raise exception 'Unknown action: %', p_action using errcode = '22023';
  end if;

  if not found then
    raise exception 'Thread % not found', p_thread_id using errcode = 'P0002';
  end if;
end;
$$;

create or replace function public.moderate_delete_reply(p_reply_id int)
returns void
language plpgsql security definer
set search_path = public
as $$
begin
  if not public.is_moderator() then
    raise exception 'Only moderators can do that' using errcode = '42501';
  end if;

  delete from public.forum_replies where id = p_reply_id;

  if not found then
    raise exception 'Reply % not found', p_reply_id using errcode = 'P0002';
  end if;
end;
$$;

revoke all on function public.moderate_thread(int, text) from public, anon;
revoke all on function public.moderate_delete_reply(int) from public, anon;
grant execute on function public.moderate_thread(int, text) to authenticated;
grant execute on function public.moderate_delete_reply(int) to authenticated;
grant execute on function public.is_moderator() to anon, authenticated;
