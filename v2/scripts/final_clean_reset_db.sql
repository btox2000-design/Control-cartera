-- 1. Eliminar tablas (Orden inverso para evitar errores de FK)
drop table if exists public.pagos;
drop table if exists public.tesoreria;
drop table if exists public.creditos;
drop table if exists public.clientes;

-- 2. Asegurar extensión pgcrypto
create extension if not exists "pgcrypto";

-- 3. Crear Tabla 'clientes' (UUID)
create table public.clientes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  nombre text not null,
  datos_contacto text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Crear Tabla 'creditos' (UUID, cliente_id es UUID)
create table public.creditos (
  id uuid default gen_random_uuid() primary key,
  cliente_id uuid references public.clientes on delete cascade not null,
  monto_total numeric not null,
  tasa_interes numeric not null,
  plazo_meses int not null,
  fecha_inicio date not null,
  estado text default 'activo',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Crear Tabla 'pagos' (UUID, credito_id es UUID)
create table public.pagos (
  id uuid default gen_random_uuid() primary key,
  credito_id uuid references public.creditos on delete cascade not null,
  monto numeric not null,
  fecha_pago timestamp with time zone default timezone('utc'::text, now())
);

-- 6. Crear Tabla 'tesoreria' (UUID)
create table public.tesoreria (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  tipo text not null,
  monto numeric not null,
  fecha timestamp with time zone default timezone('utc'::text, now())
);

-- 7. Habilitar RLS
alter table public.clientes enable row level security;
alter table public.creditos enable row level security;
alter table public.pagos enable row level security;
alter table public.tesoreria enable row level security;

-- 8. Políticas de Seguridad (UUID)
create policy "Clientes: Acceso propio" on public.clientes for all using (auth.uid() = user_id);
create policy "Creditos: Acceso propio" on public.creditos for all using (exists (select 1 from public.clientes where id = cliente_id and user_id = auth.uid()));
create policy "Pagos: Acceso propio" on public.pagos for all using (exists (select 1 from public.creditos c join public.clientes cl on c.cliente_id = cl.id where c.id = credito_id and cl.user_id = auth.uid()));
create policy "Tesoreria: Acceso propio" on public.tesoreria for all using (auth.uid() = user_id);
