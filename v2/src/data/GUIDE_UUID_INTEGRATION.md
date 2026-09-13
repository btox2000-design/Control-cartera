# Guía de Integración: Uso de UUIDs en Frontend

Hemos revertido la base de datos a usar **UUIDs** (el estándar nativo de Supabase) en lugar de IDs numéricos (`SERIAL`). Esta guía es para el equipo de frontend.

## ¿Qué cambió?
- Las columnas `id` (clientes, creditos, pagos, tesoreria) ahora son de tipo `UUID`.
- Supabase genera automáticamente estos valores como cadenas de texto (ej. `f47ac10b-58cc-4372-a567-0e02b2c3d479`).

## Instrucciones para el Frontend
Para evitar los errores `400 Bad Request`, sigan estas reglas estrictas:

1. **Tratar IDs como Strings:** Nunca intenten convertir el `id` de un registro a `Number` o `Integer`. Manténganlo siempre como una cadena de texto (`string`).
2. **Uso directo:** Al realizar llamadas a la API (o usar el cliente de Supabase), pasen el ID tal cual lo reciben en la respuesta `data`.
3. **No enviar ID en INSERT:** Al realizar un `insert()`, **no incluyan el campo `id`**. Supabase generará el UUID automáticamente en el servidor.
4. **Verificación:** Si el Frontend está intentando mapear los datos a una estructura local, asegurense de que el campo `id` sea tratado como `string`.

Ejemplo de uso correcto:
```javascript
// ✅ CORRECTO
const { data, error } = await supabase
  .from('pagos')
  .insert([{ credito_id: "el-uuid-de-texto", monto: 100 }]); 

// ❌ INCORRECTO
const { data, error } = await supabase
  .from('pagos')
  .insert([{ credito_id: 20, monto: 100 }]); // ERROR: 20 no es un UUID
```
