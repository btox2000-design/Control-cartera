-- 1. Eliminar tablas existentes (orden inverso por FKs)
drop table if exists public.pagos;
drop table if exists public.tesoreria;
drop table if exists public.creditos;
drop table if exists public.clientes;

-- 2. Crear Tabla 'clientes' con ID Serial
create table public.clientes (
  id serial primary key,
  user_id uuid references auth.users not null,
  nombre text not null,
  datos_contacto text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Crear Tabla 'creditos' con ID Serial
create table public.creditos (
  id serial primary key,
  cliente_id int references public.clientes on delete cascade not null,
  monto_total numeric not null,
  tasa_interes numeric not null,
  plazo_meses int not null,
  fecha_inicio date not null,
  estado text default 'activo',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Crear Tabla 'pagos' con ID Serial
create table public.pagos (
  id serial primary key,
  credito_id int references public.creditos on delete cascade not null,
  monto numeric not null,
  fecha_pago timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Crear Tabla 'tesoreria' con ID Serial
create table public.tesoreria (
  id serial primary key,
  user_id uuid references auth.users not null,
  tipo text not null,
  monto numeric not null,
  fecha timestamp with time zone default timezone('utc'::text, now())
);

-- 6. Habilitar RLS
alter table public.clientes enable row level security;
alter table public.creditos enable row level security;
alter table public.pagos enable row level security;
alter table public.tesoreria enable row level security;

-- 7. Crear Políticas RLS actualizadas para usar enteros
create policy "Usuarios solo ven sus clientes" on public.clientes for all using (auth.uid() = user_id);
create policy "Usuarios solo ven sus creditos" on public.creditos for all using (exists (select 1 from public.clientes where id = cliente_id and user_id = auth.uid()));
create policy "Usuarios solo ven sus pagos" on public.pagos for all using (exists (select 1 from public.creditos c join public.clientes cl on c.cliente_id = cl.id where c.id = credito_id and cl.user_id = auth.uid()));
create policy "Usuarios solo ven su tesoreria" on public.tesoreria for all using (auth.uid() = user_id);
