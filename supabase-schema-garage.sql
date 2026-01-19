-- ZRG Classics - My Garage Database Schema
-- Run this SQL in your Supabase SQL Editor to create the garage tables

-- ============================================
-- 1. GARAGE VEHICLES TABLE
-- ============================================
create table public.garage_vehicles (
  id serial primary key,
  user_id uuid references public.profiles on delete cascade not null,
  platform text not null,  -- e30, 944, etc. (links to vehicleList)
  year int,
  nickname text,
  color text,
  vin text,
  mileage int,
  purchase_date date,
  purchase_price decimal(10,2),
  notes text,
  photo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for faster user lookups
create index garage_vehicles_user_id_idx on public.garage_vehicles(user_id);

-- Enable RLS
alter table public.garage_vehicles enable row level security;

-- RLS Policies
create policy "Users can view own vehicles"
  on public.garage_vehicles for select
  using (auth.uid() = user_id);

create policy "Users can insert own vehicles"
  on public.garage_vehicles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own vehicles"
  on public.garage_vehicles for update
  using (auth.uid() = user_id);

create policy "Users can delete own vehicles"
  on public.garage_vehicles for delete
  using (auth.uid() = user_id);


-- ============================================
-- 2. GARAGE RESTORATION ITEMS TABLE
-- ============================================
create table public.garage_restoration_items (
  id serial primary key,
  garage_vehicle_id int references public.garage_vehicles on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  item_id text not null,  -- matches restorationChecklist.json item IDs
  completed boolean default false,
  date_completed date,
  cost decimal(10,2),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(garage_vehicle_id, item_id)
);

-- Indexes
create index garage_restoration_items_vehicle_idx on public.garage_restoration_items(garage_vehicle_id);
create index garage_restoration_items_user_idx on public.garage_restoration_items(user_id);

-- Enable RLS
alter table public.garage_restoration_items enable row level security;

-- RLS Policies
create policy "Users can view own restoration items"
  on public.garage_restoration_items for select
  using (auth.uid() = user_id);

create policy "Users can insert own restoration items"
  on public.garage_restoration_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update own restoration items"
  on public.garage_restoration_items for update
  using (auth.uid() = user_id);

create policy "Users can delete own restoration items"
  on public.garage_restoration_items for delete
  using (auth.uid() = user_id);


-- ============================================
-- 3. GARAGE MAINTENANCE SCHEDULE TABLE
-- ============================================
create table public.garage_maintenance_schedule (
  id serial primary key,
  garage_vehicle_id int references public.garage_vehicles on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  name text not null,
  interval_miles int,
  interval_months int,
  last_service_date date,
  last_service_mileage int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index garage_maintenance_schedule_vehicle_idx on public.garage_maintenance_schedule(garage_vehicle_id);
create index garage_maintenance_schedule_user_idx on public.garage_maintenance_schedule(user_id);

-- Enable RLS
alter table public.garage_maintenance_schedule enable row level security;

-- RLS Policies
create policy "Users can view own maintenance schedule"
  on public.garage_maintenance_schedule for select
  using (auth.uid() = user_id);

create policy "Users can insert own maintenance schedule"
  on public.garage_maintenance_schedule for insert
  with check (auth.uid() = user_id);

create policy "Users can update own maintenance schedule"
  on public.garage_maintenance_schedule for update
  using (auth.uid() = user_id);

create policy "Users can delete own maintenance schedule"
  on public.garage_maintenance_schedule for delete
  using (auth.uid() = user_id);


-- ============================================
-- 4. GARAGE SERVICE HISTORY TABLE
-- ============================================
create table public.garage_service_history (
  id serial primary key,
  garage_vehicle_id int references public.garage_vehicles on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  maintenance_id int references public.garage_maintenance_schedule on delete set null,
  service_name text not null,
  service_date date not null,
  mileage int,
  cost decimal(10,2),
  shop_type text,  -- 'diy', 'shop', 'dealer'
  parts_used text,
  notes text,
  created_at timestamptz default now()
);

-- Indexes
create index garage_service_history_vehicle_idx on public.garage_service_history(garage_vehicle_id);
create index garage_service_history_user_idx on public.garage_service_history(user_id);
create index garage_service_history_date_idx on public.garage_service_history(service_date);

-- Enable RLS
alter table public.garage_service_history enable row level security;

-- RLS Policies
create policy "Users can view own service history"
  on public.garage_service_history for select
  using (auth.uid() = user_id);

create policy "Users can insert own service history"
  on public.garage_service_history for insert
  with check (auth.uid() = user_id);

create policy "Users can update own service history"
  on public.garage_service_history for update
  using (auth.uid() = user_id);

create policy "Users can delete own service history"
  on public.garage_service_history for delete
  using (auth.uid() = user_id);


-- ============================================
-- HELPFUL VIEWS (Optional)
-- ============================================

-- View for vehicle restoration progress
create or replace view garage_restoration_progress as
select
  gv.id as vehicle_id,
  gv.user_id,
  gv.nickname,
  gv.platform,
  count(gri.id) filter (where gri.completed = true) as completed_items,
  count(gri.id) as total_tracked_items,
  coalesce(sum(gri.cost) filter (where gri.completed = true), 0) as total_cost
from garage_vehicles gv
left join garage_restoration_items gri on gv.id = gri.garage_vehicle_id
group by gv.id, gv.user_id, gv.nickname, gv.platform;
