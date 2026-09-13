import { supabase } from '../supabaseClient.js';

/**
 * Servicio de datos para Créditos
 */

// Obtener un crédito con sus pagos asociados
export async function getCreditoDetalle(id) {
  const { data, error } = await supabase
    .from('creditos')
    .select('*, clientes(nombre), pagos(*)')
    .eq('id', id)
    .single();
  return { data, error };
}

// Obtener créditos, opcionalmente filtrados por cliente
export async function getCreditos(clienteId = null) {
  let query = supabase
    .from('creditos')
    .select('*, clientes(nombre)')
    .order('created_at', { ascending: false });

  if (clienteId) {
    query = query.eq('cliente_id', clienteId);
  }

  const { data, error } = await query;
  return { data, error };
}

// Crear un nuevo crédito y registrar movimiento en Tesorería
export async function createCredito(creditoData) {
  console.log('--- Iniciando createCredito ---');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('Error: Usuario no autenticado');
    return { error: 'Usuario no autenticado' };
  }

  // 1. Insertar Crédito
  console.log('Insertando crédito...');
  const { data: credito, error: creditoError } = await supabase
    .from('creditos')
    .insert([creditoData])
    .select();
  
  if (creditoError) {
    console.error('Error insertando crédito:', creditoError);
    return { error: creditoError };
  }
  console.log('Crédito insertado correctamente:', credito);

  // 2. Registrar movimiento en Tesorería
  console.log('Insertando movimiento en tesorería...');
  const { error: tesoreriaError } = await supabase
    .from('tesoreria')
    .insert([
      { 
        user_id: user.id, 
        tipo: 'retiro', 
        monto: parseFloat(creditoData.monto_total) 
      }
    ]);

  if (tesoreriaError) {
    console.error('DETALLE ERROR TESORERIA:', tesoreriaError);
    return { data: credito, error: tesoreriaError };
  }
  console.log('Movimiento en tesorería registrado correctamente');

  return { data: credito, error: null };
}

// Eliminar un crédito y revertir movimiento en Tesorería
export async function deleteCredito(id, monto) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Usuario no autenticado' };

  // 1. Eliminar Crédito
  const { error: creditoError } = await supabase
    .from('creditos')
    .delete()
    .eq('id', id);
  
  if (creditoError) return { error: creditoError };

  // 2. Revertir movimiento en Tesorería
  const { error: tesoreriaError } = await supabase
    .from('tesoreria')
    .insert([
      { 
        user_id: user.id, 
        tipo: 'inyeccion',
        monto: parseFloat(monto) 
      }
    ]);

  return { error: tesoreriaError };
}
