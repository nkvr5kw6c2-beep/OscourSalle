-- IRON LOG: cloud persistence schema
-- Run this file in Supabase Dashboard > SQL Editor.
-- Row Level Security ensures each signed-in user can access only their own state.

create table if not exists public.user_app_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  app_state jsonb not null default '{"logs":[],"drafts":{},"weight":[]}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_app_state enable row level security;

drop policy if exists "Users can read their own IRON LOG state" on public.user_app_state;
create policy "Users can read their own IRON LOG state"
  on public.user_app_state
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own IRON LOG state" on public.user_app_state;
create policy "Users can insert their own IRON LOG state"
  on public.user_app_state
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own IRON LOG state" on public.user_app_state;
create policy "Users can update their own IRON LOG state"
  on public.user_app_state
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update on public.user_app_state to authenticated;
