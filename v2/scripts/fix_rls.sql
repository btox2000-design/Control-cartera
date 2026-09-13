-- 1. Eliminar política anterior
drop policy if exists "Usuarios solo ven su tesoreria" on public.tesoreria;

-- 2. Crear políticas granulares para permitir INSERT y SELECT
create policy "Usuarios pueden ver su tesoreria" on public.tesoreria for select using (auth.uid() = user_id);
create policy "Usuarios pueden insertar su tesoreria" on public.tesoreria for insert with check (auth.uid() = user_id);
