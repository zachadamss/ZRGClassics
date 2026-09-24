-- ZRG Classics - My Garage columns the site uses
-- Run this in the Supabase SQL Editor. Safe to re-run, and safe if some or all
-- of these columns already exist (they may have been added by hand when the
-- features were built; supabase-schema-garage.sql didn't have them).
--
-- Check first if you're curious (lists whichever of these columns exist):
--   select table_name, column_name from information_schema.columns
--   where table_schema = 'public'
--     and (table_name, column_name) in (
--       ('garage_vehicles','make'), ('garage_vehicles','model'),
--       ('garage_restoration_items','status'), ('garage_restoration_items','estimated_cost'),
--       ('garage_restoration_items','actual_cost'), ('garage_restoration_items','category'),
--       ('garage_restoration_items','item_name'));

-- ============================================
-- 1. CARS THAT AREN'T ON THE PLATFORM LIST
-- ============================================
-- "Add a car" accepts any make/model; those rows have no platform.
alter table public.garage_vehicles add column if not exists make text;
alter table public.garage_vehicles add column if not exists model text;
alter table public.garage_vehicles alter column platform drop not null;

-- ============================================
-- 2. RESTORATION TRACKER
-- ============================================
-- Each checklist item has a status (not-started / in-progress / complete /
-- skipped), a budget, the actual spend, and, for custom items, a category
-- and name.
alter table public.garage_restoration_items add column if not exists status text not null default 'not-started';
alter table public.garage_restoration_items add column if not exists estimated_cost numeric(10,2) default 0;
alter table public.garage_restoration_items add column if not exists actual_cost numeric(10,2) default 0;
alter table public.garage_restoration_items add column if not exists category text;
alter table public.garage_restoration_items add column if not exists item_name text;

-- Rows saved before the status column existed: derive it from "completed"
update public.garage_restoration_items
  set status = 'complete'
  where completed and status = 'not-started';
