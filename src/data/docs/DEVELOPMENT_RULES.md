# ══════════════════════════════════════════════════════════════
#         📏 REGLAS DE DESARROLLO — MULTICONSULTORIAS
# ══════════════════════════════════════════════════════════════


## ✅ REGLA 1: FUENTE ÚNICA DE VERDAD
Todo dato de la app viene del schema `app_schema.json`.
Si un componente necesita datos que no existen en el schema,
se debe PRIMERO agregar al schema y luego implementar.


## ✅ REGLA 2: SEPARACIÓN VALOR / DISPLAY
CORRECTO:
"value": 350000000,
"display_value": "350.0M"

INCORRECTO:
"value": "350.0M",

## ✅ REGLA 3: IDS RELACIONALES
Las entidades se conectan por IDs, nunca por duplicación:
Tarea → client_id: "cli_001" → apunta a Cliente
Evento → client_id: "cli_001" → apunta a Cliente
Tarea → event_id: "evt_102" → apunta a Evento
Log → client_id: "cli_003" → apunta a Cliente

## ✅ REGLA 4: ESTADO ACTIVO ÚNICO
CORRECTO:
"active_filter": "todos"

INCORRECTO:
filtros: [
{ id: "todos", active: true },
{ id: "nuevo", active: false }
]

## ✅ REGLA 5: CATÁLOGOS DEFINIDOS
Todo listado de opciones debe tener su catálogo:
- pipeline_stages → estados de clientes
- event_types → tipos de evento
- priority_levels → niveles de prioridad
- task_categories → categorías de tarea
- available_reports → tipos de reporte
- available_roles → roles de usuario


## ✅ REGLA 6: MÓDULOS AUTODOCUMENTADOS
Cada módulo incluye `_module_info` con:
- id, name, description, route, icon


## ✅ REGLA 7: COLORES CENTRALIZADOS
Los colores de UI vienen de config.theme.colors
Los colores de estados vienen de sus catálogos
NUNCA hardcodear colores en componentes


## ✅ REGLA 8: BRANDING MULTICONSULTORIAS
- Nombre en headers: "MULTICONSULTORIAS"
- Logo desde: config.branding.logo_url
- Splash screen con animación de logo
- Tagline: "Tu gestión financiera, simplificada"


## ✅ REGLA 9: ESTRUCTURA DE CARPETAS SUGERIDA

## ✅ REGLA 10: NOMENCLATURA
| Tipo              | Formato         | Ejemplo           |
|-------------------|-----------------|-------------------|
| Módulos           | snake_case      | activity_log      |
| Clientes          | cli_XXX         | cli_001           |
| Tareas            | task_XXX        | task_004          |
| Eventos           | evt_XXX         | evt_102           |
| Logs              | log_XXX         | log_001           |
| Notificaciones    | notif_XXX       | notif_001         |
| Usuarios          | usr_XXX         | usr_001           |
| Rutas             | /modulo         | /dashboard        |
| Componentes       | PascalCase      | KpiCard           |
| Funciones         | camelCase       | getClientById     |
| Constantes        | UPPER_SNAKE     | MAX_CLIENTS       |
