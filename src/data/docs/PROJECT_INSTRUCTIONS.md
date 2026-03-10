# ══════════════════════════════════════════════════════════════
#              🏢 PROYECTO: MULTICONSULTORIAS
#              📱 Aplicación CRM para Asesores Financieros
#              📋 Documento de Instrucciones de Desarrollo
# ══════════════════════════════════════════════════════════════

---

## 1. 🎯 DESCRIPCIÓN GENERAL

**Nombre de la App:** MULTICONSULTORIAS
**Tipo:** CRM móvil/web para asesores financieros
**Propósito:** Gestión integral de clientes, seguimiento de créditos,
              comisiones, metas y análisis de rendimiento para
              asesores financieros independientes y equipos de consultoría.

**Plataformas objetivo:** iOS, Android, Web (PWA)
**Tema visual:** Dark mode con acento verde (#00ff88)

---

## 2. 📐 ARQUITECTURA DE DATOS

La aplicación MULTICONSULTORIAS se desarrollará siguiendo estrictamente
la estructura JSON definida en el archivo `app_schema.json`.

Toda pantalla, componente y funcionalidad debe respetar los modelos
de datos aquí descritos. Cualquier modificación a la estructura
requiere actualizar este documento primero.

---

## 3. 🧱 MÓDULOS DE LA APLICACIÓN

La app se compone de 7 módulos principales:

| #  | Módulo         | Ruta          | Descripción                          |
|----|----------------|---------------|--------------------------------------|
| 1  | Dashboard      | /dashboard    | Vista general con KPIs y gráficos    |
| 2  | Clientes       | /clients      | Pipeline y gestión de clientes       |
| 3  | Calendario     | /calendar     | Eventos, llamadas y recordatorios    |
| 4  | Metas          | /goals        | Objetivos mensuales y semanales      |
| 5  | Analítica      | /analytics    | Embudo, top clientes, métricas       |
| 6  | Herramientas   | /tools        | Calculadoras y generador de reportes |
| 7  | Actividad      | /activity     | Log de actividad reciente            |

Módulo transversal:
| -  | Tareas         | (global)      | Sistema de tareas vinculado a todo   |

---

## 4. ⚙️ REGLAS DE DESARROLLO

### 4.1 Convenciones de nombrado
- IDs de módulos: snake_case (ejemplo: `activity_log`)
- IDs de entidades: prefijo + número (ejemplo: `cli_001`, `task_004`, `evt_102`)
- Colores: hexadecimal de 6 dígitos con # (ejemplo: `#00ff88`)

### 4.2 Datos numéricos
- SIEMPRE almacenar el valor numérico puro en campo `value`
- SIEMPRE incluir el valor formateado para UI en campo `display_value`
- NUNCA hacer cálculos con valores formateados

### 4.3 Estados de UI
- Un solo campo de verdad para estados activos (NO booleanos en cada item)
- Ejemplo correcto: `"active_filter": "todos"`
- Ejemplo incorrecto: cada filtro con `"active": true/false`

### 4.4 Relaciones
- Usar IDs de referencia para conectar entidades entre módulos
- Ejemplo: `"client_id": "cli_001"` en tareas, eventos, logs

---
