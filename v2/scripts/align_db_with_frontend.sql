-- 1. Eliminar tablas (Borrón y cuenta nueva para alinear nombres con el Frontend)
drop table if exists public.pagos;
drop table if exists public.tesoreria;
drop table if exists public.creditos;
drop table if exists public.clients;

-- 2. Crear Tabla 'clients' (Nombre en inglés como lo busca el Frontend)
create table public.clients (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null, -- 'name' en lugar de 'nombre'
  datos_contacto text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Crear Tabla 'creditos'
create table public.creditos (
  id uuid default gen_random_uuid() primary key,
  cliente_id uuid references public.clients(id) on delete cascade not null,
  monto_total numeric not null,
  tasa_interes numeric not null,
  plazo_meses int not null,
  fecha_inicio date not null,
  estado text default 'activo',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Crear Tabla 'pagos'
create table public.pagos (
  id uuid default gen_random_uuid() primary key,
  credito_id uuid references public.creditos on delete cascade not null,
  monto numeric not null,
  fecha_pago timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Crear Tabla 'tesoreria'
create table public.tesoreria (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  tipo text not null,
  monto numeric not null,
  fecha timestamp with time zone default timezone('utc'::text, now())
);

-- 6. Habilitar RLS
alter table public.clients enable row level security;
alter table public.creditos enable row level security;
alter table public.pagos enable row level security;
alter table public.tesoreria enable row level security;

-- 7. Políticas de Seguridad (Ajustadas a 'clients' y 'name')
create policy "Clients: Acceso propio" on public.clients for all using (auth.uid() = user_id);
create policy "Creditos: Acceso propio" on public.creditos for all using (exists (select 1 from public.clients where id = cliente_id and user_id = auth.uid()));
create policy "Pagos: Acceso propio" on public.pagos for all using (exists (select 1 from public.creditos c join public.clients cl on c.cliente_id = cl.id where c.id = credito_id and cl.user_id = auth.uid()));
create policy "Tesoreria: Acceso propio" on public.tesoreria for all using (auth.uid() = user_id);
