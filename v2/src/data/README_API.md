# API Contract: Payment Service (`src/data/payments.js`)

Esta documentación define la interfaz entre el Frontend y el Backend para la gestión de pagos. Todos los servicios devuelven un objeto consistente con la estructura `{ data, error }`.

## Estructura de Respuesta
```javascript
{ 
  data: result | null, // Resultado de la operación en caso de éxito
  error: errorObject | null // Objeto de error de Supabase en caso de fallo
}
```

## Funciones Disponibles

### 1. `getPagos(creditoId)`
Obtiene el historial de pagos de un crédito específico.
- **Parámetros:**
  - `creditoId` (string/UUID): ID del crédito.
- **Retorno:** Array de objetos de pagos ordenados por `fecha_pago`.

### 2. `createPago(creditoId, monto)`
Registra un nuevo pago.
- **Parámetros:**
  - `creditoId` (string/UUID): ID del crédito.
  - `monto` (number): Monto pagado.

### 3. `deletePago(id)`
Elimina un registro de pago.
- **Parámetros:**
  - `id` (string/UUID): ID del registro de pago.

---

## Flujo Recomendado de Integración
Debido a la refactorización para una mayor robustez relacional:

1. **No manejar `paidMonths` en la tabla de créditos.**
2. **Utilizar `getCreditoDetalle(creditoId)`** desde `src/data/credits.js` para obtener el crédito y sus pagos asociados (`pagos[*]`).
3. **Calcular dinámicamente** en el Frontend qué meses están pagados basándose en el historial de pagos recibido.
