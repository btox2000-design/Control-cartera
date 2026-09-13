import { supabase } from '../supabaseClient.js';

/**
 * Servicio de datos para Pagos
 */

// Obtener pagos de un crédito específico
export async function getPagos(creditoId) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('credit_id', creditoId)
    .order('fecha_pago', { ascending: true });
  return { data, error };
}

// Registrar un nuevo pago
export async function createPago(creditoId, monto, mes) {
  const { data, error } = await supabase
    .from('payments')
    .insert([
      { 
        credit_id: creditoId, 
        monto,
        mes_correspondiente: mes
      }
    ])
    .select();
  return { data, error };
}

// Eliminar un pago
export async function deletePago(id) {
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id);
  return { error };
}
