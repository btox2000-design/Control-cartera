import { supabase } from '../supabaseClient.js';

/**
 * Servicio de datos para Tesorería
 */

// Obtener todos los movimientos del usuario actual
export async function getMovimientos() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });
  return { data, error };
}

// Registrar un nuevo movimiento
export async function createMovimiento(tipo, monto, creditId = null, payment_id = null) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Usuario no autenticado' };

  // Nota: 'payment_id' no está en el esquema original de 'transactions'. 
  // Asumiremos que el backend lo maneja o que necesitamos añadirlo si el esquema cambia.
  // Por ahora, usaremos los campos disponibles en 'transactions'.
  
  const { data, error } = await supabase
    .from('transactions')
    .insert([
      { 
        user_id: user.id, 
        type: tipo, // 'tipo' -> 'type'
        amount: monto, // 'monto' -> 'amount'
        creditId: creditId,
        concept: 'Pago de mensualidad'
      }
    ])
    .select();
  return { data, error };
}

// Eliminar un movimiento
export async function deleteMovimiento(creditId, amount) {
  // Como 'transactions' no tiene 'payment_id', filtramos por 'creditId' y 'amount' para eliminar
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('creditId', creditId)
    .eq('amount', amount);
  return { error };
}
