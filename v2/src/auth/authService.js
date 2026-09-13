import { supabase } from '../supabaseClient.js'

/**
 * Servicio de Autenticación
 */

// Registrar usuario
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

// Iniciar sesión
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// Cerrar sesión
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Obtener usuario actual
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Monitorear cambios en el estado de sesión
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
}
