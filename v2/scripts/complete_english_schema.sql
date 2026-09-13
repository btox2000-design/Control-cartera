-- 1. Eliminar tablas con CASCADE para asegurar limpieza total
drop table if exists public.payments cascade;
drop table if exists public.transactions cascade;
drop table if exists public.credits cascade;
drop table if exists public.clients cascade;

-- 2. Asegurar extensión pgcrypto
create extension if not exists "pgcrypto";

-- 3. Tabla 'clients'
create table public.clients (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  contact_info text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Tabla 'credits'
create table public.credits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  client text not null,
  client_id uuid references public.clients(id) on delete cascade,
  amount numeric not null,
  months int not null,
  description text,
  paidMonths int[] default '{}',
  createdAt timestamp with time zone default timezone('utc'::text, now()),
  status text default 'active'
);

-- 5. Tabla 'payments' (Ajustada al payload detectado)
-- Payload detectado: { credit_id, monto, mes_correspondiente, fecha_pago }
create table public.payments (
  id uuid default gen_random_uuid() primary key,
  credit_id uuid references public.credits(id) on delete cascade not null,
  monto numeric not null, -- El frontend usa 'monto'
  mes_correspondiente int, -- Campo nuevo detectado en el log
  fecha_pago timestamp with time zone default timezone('utc'::text, now()) -- El frontend usa 'fecha_pago'
);

-- 6. Tabla 'transactions'
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  date timestamp with time zone default timezone('utc'::text, now()),
  concept text,
  amount numeric not null,
  "creditId" uuid,
  category text,
  type text
);

-- 7. Habilitar RLS
alter table public.clients enable row level security;
alter table public.credits enable row level security;
alter table public.payments enable row level security;
alter table public.transactions enable row level security;

-- 8. Políticas de Seguridad
create policy "Clients access" on public.clients for all using (auth.uid() = user_id);
create policy "Credits access" on public.credits for all using (auth.uid() = user_id);
create policy "Payments access" on public.payments for all using (exists (select 1 from public.credits where id = credit_id and user_id = auth.uid()));
create policy "Transactions access" on public.transactions for all using (auth.uid() = user_id);
