import { supabase } from '../supabaseClient.js';

/**
 * Servicio de datos para Clientes
 */

// Obtener todos los clientes del usuario actual
export async function getClientes() {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
}

// Crear un nuevo cliente
export async function createCliente(nombre, datos_contacto) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Usuario no autenticado' };

  const { data, error } = await supabase
    .from('clientes')
    .insert([
      { 
        user_id: user.id, 
        nombre, 
        datos_contacto 
      }
    ])
    .select();
  return { data, error };
}

// Actualizar un cliente
export async function updateCliente(id, updates) {
  const { data, error } = await supabase
    .from('clientes')
    .update(updates)
    .eq('id', id)
    .select();
  return { data, error };
}

// Eliminar un cliente
export async function deleteCliente(id) {
  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', id);
  return { error };
}
