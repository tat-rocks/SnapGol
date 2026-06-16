-- ─────────────────────────────────────────────────────────────
-- SnapGol — Initial Schema
-- ─────────────────────────────────────────────────────────────

-- Enable UUID extension

-- ─── profiles ────────────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique not null,
  avatar_url  text,
  country     text,
  created_at  timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Profiles are public"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'user_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── matches ─────────────────────────────────────────────────
create table public.matches (
  id        uuid primary key default gen_random_uuid(),
  team_a    text not null,
  team_b    text not null,
  flag_a    text not null default '',
  flag_b    text not null default '',
  stage     text not null default 'groups',
  match_date date,
  venue     text,
  score_a   int,
  score_b   int,
  created_at timestamptz default now() not null
);

alter table public.matches enable row level security;
create policy "Matches are public" on public.matches for select using (true);

-- ─── cards ───────────────────────────────────────────────────
create type rarity_type as enum ('common', 'rare', 'epic', 'legendary');

create table public.cards (
  id                uuid primary key default gen_random_uuid(),
  photographer_id   uuid not null references public.profiles(id) on delete cascade,
  match_id          uuid references public.matches(id) on delete set null,
  photo_url         text not null,
  thumbnail_url     text,
  caption           text,
  rarity            rarity_type not null default 'common',
  likes             int not null default 0,
  serial_number     int,
  total_supply      int,
  is_minted         boolean not null default false,
  price_usd         numeric(10,2) not null default 0.99,
  is_for_sale       boolean not null default false,
  created_at        timestamptz default now() not null
);

alter table public.cards enable row level security;

create policy "Cards are public" on public.cards for select using (true);
create policy "Users can insert their own cards"
  on public.cards for insert with check (auth.uid() = photographer_id);
create policy "Users can update their own cards"
  on public.cards for update using (auth.uid() = photographer_id);

-- ─── collections (cards owned by users) ──────────────────────
create table public.collections (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  card_id     uuid not null references public.cards(id) on delete cascade,
  quantity    int not null default 1,
  acquired_at timestamptz default now() not null,
  unique(user_id, card_id)
);

alter table public.collections enable row level security;

create policy "Users can view their own collection"
  on public.collections for select using (auth.uid() = user_id);
create policy "Users can insert into their collection"
  on public.collections for insert with check (auth.uid() = user_id);
create policy "Users can update their collection"
  on public.collections for update using (auth.uid() = user_id);

-- ─── listings (marketplace) ───────────────────────────────────
create table public.listings (
  id          uuid primary key default gen_random_uuid(),
  card_id     uuid not null references public.cards(id) on delete cascade,
  seller_id   uuid not null references public.profiles(id) on delete cascade,
  price_usd   numeric(10,2) not null,
  status      text not null default 'active', -- active | sold | cancelled
  buyer_id    uuid references public.profiles(id),
  sold_at     timestamptz,
  created_at  timestamptz default now() not null
);

alter table public.listings enable row level security;

create policy "Listings are public" on public.listings for select using (true);
create policy "Users can create listings"
  on public.listings for insert with check (auth.uid() = seller_id);
create policy "Sellers can update their listings"
  on public.listings for update using (auth.uid() = seller_id);

-- ─── card_likes ───────────────────────────────────────────────
create table public.card_likes (
  user_id  uuid not null references public.profiles(id) on delete cascade,
  card_id  uuid not null references public.cards(id) on delete cascade,
  created_at timestamptz default now() not null,
  primary key (user_id, card_id)
);

alter table public.card_likes enable row level security;
create policy "Likes are public" on public.card_likes for select using (true);
create policy "Users can like cards"
  on public.card_likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike cards"
  on public.card_likes for delete using (auth.uid() = user_id);

-- Auto-update cards.likes counter
create or replace function update_card_likes()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    update public.cards set likes = likes + 1 where id = new.card_id;
    -- Auto-promote rarity based on likes
    update public.cards set rarity =
      case
        when likes >= 10000 then 'legendary'::rarity_type
        when likes >= 2000  then 'epic'::rarity_type
        when likes >= 500   then 'rare'::rarity_type
        else 'common'::rarity_type
      end
    where id = new.card_id;
  elsif TG_OP = 'DELETE' then
    update public.cards set likes = greatest(0, likes - 1) where id = old.card_id;
  end if;
  return null;
end;
$$;

create trigger on_card_like
  after insert or delete on public.card_likes
  for each row execute procedure update_card_likes();

-- ─── packs ────────────────────────────────────────────────────
create table public.packs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  cards       uuid[] not null default '{}',
  price_paid  numeric(10,2) not null default 1.99,
  opened_at   timestamptz default now() not null
);

alter table public.packs enable row level security;
create policy "Users can view their own packs"
  on public.packs for select using (auth.uid() = user_id);

-- ─── Storage buckets ──────────────────────────────────────────
insert into storage.buckets (id, name, public)
  values ('card-photos', 'card-photos', true)
  on conflict do nothing;

create policy "Anyone can view card photos"
  on storage.objects for select
  using (bucket_id = 'card-photos');

create policy "Authenticated users can upload card photos"
  on storage.objects for insert
  with check (bucket_id = 'card-photos' and auth.role() = 'authenticated');

create policy "Users can update their own photos"
  on storage.objects for update
  using (bucket_id = 'card-photos' and auth.uid()::text = (storage.foldername(name))[1]);

-- ─── Seed: World Cup 2026 matches ─────────────────────────────
insert into public.matches (team_a, team_b, flag_a, flag_b, stage, match_date, venue) values
  ('Brazil',    'Argentina', '🇧🇷', '🇦🇷', 'groups',        '2026-06-14', 'MetLife Stadium'),
  ('France',    'Spain',     '🇫🇷', '🇪🇸', 'groups',        '2026-06-15', 'SoFi Stadium'),
  ('Germany',   'Portugal',  '🇩🇪', '🇵🇹', 'groups',        '2026-06-16', 'AT&T Stadium'),
  ('England',   'Italy',     '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇮🇹', 'groups',        '2026-06-17', 'Gillette Stadium'),
  ('Morocco',   'Senegal',   '🇲🇦', '🇸🇳', 'groups',        '2026-06-18', 'Arrowhead Stadium'),
  ('USA',       'Mexico',    '🇺🇸', '🇲🇽', 'groups',        '2026-06-19', 'Rose Bowl'),
  ('Japan',     'Croatia',   '🇯🇵', '🇭🇷', 'groups',        '2026-06-20', 'Lumen Field'),
  ('Argentina', 'France',    '🇦🇷', '🇫🇷', 'semi-final',    '2026-07-10', 'MetLife Stadium'),
  ('Brazil',    'England',   '🇧🇷', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'semi-final',    '2026-07-11', 'SoFi Stadium'),
  ('Argentina', 'Brazil',    '🇦🇷', '🇧🇷', 'final',         '2026-07-19', 'MetLife Stadium');
