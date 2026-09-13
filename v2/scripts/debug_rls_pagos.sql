-- 1. Eliminar todas las políticas actuales de la tabla 'pagos'
drop policy if exists "Usuarios pueden ver sus pagos" on public.pagos;
drop policy if exists "Usuarios pueden insertar sus pagos" on public.pagos;

-- 2. Crear una política de INSERCIÓN temporal muy permisiva para depuración
-- Si esto funciona, sabremos que el problema es la lógica del 'exists'
create policy "DEBUG_PERMITIR_INSERT_AUTENTICADO" on public.pagos 
  for insert with check (auth.role() = 'authenticated');

-- 3. Crear una política de SELECT temporal muy permisiva
create policy "DEBUG_PERMITIR_SELECT_AUTENTICADO" on public.pagos 
  for select using (auth.role() = 'authenticated');
