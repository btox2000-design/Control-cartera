# Estado del Proyecto: Control de Cartera
Sistema web local para gestión de préstamos, tesorería y analítica.

## Arquitectura
- Frontend: Vanilla JS, HTML5, CSS3.
- Persistencia: `localStorage` (`credits`, `transactions`, `clients`).
- Analítica: Chart.js.

## Módulos Implementados
1. Dashboard (Resumen): KPIs (Saldo, Mensualidades, Vencimientos), Filtros por cliente, Filtro de estado (Completados), orden inverso.
2. Gestión de Clientes: ABM de clientes.
3. Detalle de Crédito (`loan1.html`): Sistema de amortización francés, Tasa anual variable, Control de pagos mensual con confirmación modal.
4. Gestión de Fondo (Tesorería): Bitácora de transacciones automática (préstamos, pagos, reversiones, ajustes manuales con categorías), Exportación a CSV.
5. Analítica: Gráficos de barras y pastel en hoja dedicada.

## Roadmap Completado
- Fase 1: Categorización de movimientos y Exportación CSV.
- Fase 2: Alertas de vencimiento (KPI + Resaltado visual).
- Fase 3: Visualización gráfica.

## Pendientes / Ideas Futuras
- Reportes avanzados.
- Alertas proactivas (email/notificaciones).
- UI/UX responsivo.
