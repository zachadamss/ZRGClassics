-- ZRG Classics Database Schema
-- Run this in Supabase SQL Editor (SQL Editor > New Query > Paste > Run)

-- ============================================
-- 1. USER PROFILES
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text,
  avatar_url text,
  location text,
  bio text,
  vehicles text[] default '{}',
  reputation int default 0,
  post_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ============================================
-- 2. FORUM CATEGORIES
-- ============================================
create table public.forum_categories (
  id serial primary key,
  slug text unique not null,
  name text not null,
  description text,
  vehicle text,
  brand text,
  display_order int default 0,
  thread_count int default 0,
  post_count int default 0,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.forum_categories enable row level security;

-- Everyone can read categories
create policy "Categories are viewable by everyone"
  on public.forum_categories for select
  using (true);

-- Insert default categories
insert into public.forum_categories (slug, name, description, vehicle, brand, display_order) values
  ('general', 'General Discussion', 'Off-topic chat, introductions, and community news', null, null, 1),
  ('e28', 'BMW E28 (1982-1988)', 'Discussion for E28 5 Series owners', 'e28', 'BMW', 10),
  ('e30', 'BMW E30 (1982-1994)', 'Discussion for E30 3 Series owners', 'e30', 'BMW', 11),
  ('e34', 'BMW E34 (1988-1996)', 'Discussion for E34 5 Series owners', 'e34', 'BMW', 12),
  ('e36', 'BMW E36 (1990-2000)', 'Discussion for E36 3 Series owners', 'e36', 'BMW', 13),
  ('e39', 'BMW E39 (1995-2003)', 'Discussion for E39 5 Series owners', 'e39', 'BMW', 14),
  ('e46', 'BMW E46 (1999-2006)', 'Discussion for E46 3 Series owners', 'e46', 'BMW', 15),
  ('e90', 'BMW E90 (2005-2013)', 'Discussion for E90/E91/E92/E93 owners', 'e90', 'BMW', 16),
  ('924', 'Porsche 924 (1976-1988)', 'Discussion for 924 owners', '924', 'Porsche', 20),
  ('928', 'Porsche 928 (1977-1995)', 'Discussion for 928 owners', '928', 'Porsche', 21),
  ('944', 'Porsche 944 (1982-1991)', 'Discussion for 944 owners', '944', 'Porsche', 22),
  ('964', 'Porsche 964 (1989-1994)', 'Discussion for 964 911 owners', '964', 'Porsche', 23),
  ('993', 'Porsche 993 (1994-1998)', 'Discussion for 993 911 owners', '993', 'Porsche', 24),
  ('996', 'Porsche 996 (1998-2005)', 'Discussion for 996 911 owners', '996', 'Porsche', 25),
  ('997', 'Porsche 997 (2004-2012)', 'Discussion for 997 911 owners', '997', 'Porsche', 26),
  ('991', 'Porsche 991 (2011-2019)', 'Discussion for 991 911 owners', '991', 'Porsche', 27),
  ('986', 'Porsche 986 Boxster (1996-2004)', 'Discussion for 986 Boxster owners', '986', 'Porsche', 28),
  ('987', 'Porsche 987 Boxster/Cayman (2005-2012)', 'Discussion for 987 owners', '987', 'Porsche', 29);

-- ============================================
-- 3. FORUM THREADS
-- ============================================
create table public.forum_threads (
  id serial primary key,
  category_id int references public.forum_categories on delete cascade not null,
  author_id uuid references public.profiles on delete set null,
  title text not null,
  slug text not null,
  content text not null,
  is_pinned boolean default false,
  is_locked boolean default false,
  view_count int default 0,
  reply_count int default 0,
  last_reply_at timestamptz,
  last_reply_by uuid references public.profiles on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index for faster queries
create index forum_threads_category_id_idx on public.forum_threads(category_id);
create index forum_threads_author_id_idx on public.forum_threads(author_id);
create index forum_threads_created_at_idx on public.forum_threads(created_at desc);

-- Enable RLS
alter table public.forum_threads enable row level security;

-- Policies
create policy "Threads are viewable by everyone"
  on public.forum_threads for select
  using (true);

create policy "Authenticated users can create threads"
  on public.forum_threads for insert
  with check (auth.uid() = author_id);

create policy "Authors can update own threads"
  on public.forum_threads for update
  using (auth.uid() = author_id);

-- ============================================
-- 4. FORUM REPLIES
-- ============================================
create table public.forum_replies (
  id serial primary key,
  thread_id int references public.forum_threads on delete cascade not null,
  author_id uuid references public.profiles on delete set null,
  content text not null,
  is_solution boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index
create index forum_replies_thread_id_idx on public.forum_replies(thread_id);
create index forum_replies_author_id_idx on public.forum_replies(author_id);

-- Enable RLS
alter table public.forum_replies enable row level security;

-- Policies
create policy "Replies are viewable by everyone"
  on public.forum_replies for select
  using (true);

create policy "Authenticated users can create replies"
  on public.forum_replies for insert
  with check (auth.uid() = author_id);

create policy "Authors can update own replies"
  on public.forum_replies for update
  using (auth.uid() = author_id);

-- ============================================
-- 5. FUNCTIONS & TRIGGERS
-- ============================================

-- Function to generate slug from title
create or replace function generate_slug(title text)
returns text as $$
begin
  return lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
end;
$$ language plpgsql;

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'username', 'New Member')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update thread reply count
create or replace function public.update_thread_reply_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.forum_threads
    set reply_count = reply_count + 1,
        last_reply_at = NEW.created_at,
        last_reply_by = NEW.author_id
    where id = NEW.thread_id;

    update public.profiles
    set post_count = post_count + 1
    where id = NEW.author_id;

    return NEW;
  elsif (TG_OP = 'DELETE') then
    update public.forum_threads
    set reply_count = reply_count - 1
    where id = OLD.thread_id;

    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

-- Trigger for reply count
create trigger on_reply_change
  after insert or delete on public.forum_replies
  for each row execute procedure public.update_thread_reply_count();

-- Function to update category counts
create or replace function public.update_category_counts()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.forum_categories
    set thread_count = thread_count + 1
    where id = NEW.category_id;

    update public.profiles
    set post_count = post_count + 1
    where id = NEW.author_id;

    return NEW;
  elsif (TG_OP = 'DELETE') then
    update public.forum_categories
    set thread_count = thread_count - 1
    where id = OLD.category_id;

    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

-- Trigger for category counts
create trigger on_thread_change
  after insert or delete on public.forum_threads
  for each row execute procedure public.update_category_counts();

-- Function to increment view count
create or replace function public.increment_thread_views(thread_id int)
returns void as $$
begin
  update public.forum_threads
  set view_count = view_count + 1
  where id = thread_id;
end;
$$ language plpgsql security definer;

-- ============================================
-- 6. INDEXES FOR SEARCH
-- ============================================
create extension if not exists pg_trgm;

create index forum_threads_title_trgm_idx on public.forum_threads using gin (title gin_trgm_ops);
create index forum_threads_content_trgm_idx on public.forum_threads using gin (content gin_trgm_ops);
