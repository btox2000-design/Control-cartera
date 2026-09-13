# Diagnóstico de Error 400 (Bad Request) - Servicio de Pagos

El equipo de Frontend está experimentando errores `400 Bad Request` al interactuar con la tabla `pagos` de Supabase. Tras analizar los logs, se ha identificado una discrepancia crítica en los datos enviados.

## Identificación del Problema
Los logs muestran peticiones como:
`GET .../rest/v1/pagos?select=*&credito_id=eq.20`

**El error radica en el tipo de dato de `credito_id`:**
1.  **Backend (Schema):** Definimos `credito_id` como un tipo **`UUID`** (ej. `a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11`).
2.  **Frontend (Petición):** Se está enviando el valor `20` (un entero), lo cual no es un UUID válido. Esto provoca que Supabase rechace la petición con un error 400.

## Pasos de Acción requeridos por el Frontend:
1.  **Revisar el origen del `credito_id`:** Asegurarse de que el ID que se está utilizando para las consultas y registros sea el UUID real generado por Supabase y no un ID secuencial local o numérico.
2.  **Verificar la obtención del ID:** Al cargar el detalle del crédito o listar los créditos, asegúrense de mapear el campo `id` de la tabla `creditos` (que es el UUID) y no utilizar una variable que contenga un índice numérico.
3.  **Depuración:** Antes de realizar la llamada a `createPago(creditoId, ...)` o `getPagos(creditoId)`, realizar un `console.log(creditoId)` para confirmar que efectivamente se está pasando una cadena de texto (UUID) y no un número.
