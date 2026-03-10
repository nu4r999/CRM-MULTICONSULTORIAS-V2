export const APP_SCHEMA = {
  _meta: {
    schema_version: "2.0.0",
    app_name: "MULTICONSULTORIAS",
    app_display_name: "MultiConsultorías",
    last_updated: "2026-03-09T19:16:11-05:00",
    platform: ["ios", "android", "web"],
  },

  config: {
    branding: {
      app_name: "MULTICONSULTORIAS",
      tagline: "Tu gestión financiera, simplificada",
    },
    theme: {
      mode: "dark",
      colors: {
        primary: "#00ff88",
        secondary: "#0088ff",
        accent: "#ffaa00",
        danger: "#ff0000",
        warning: "#ff5500",
        info: "#5500ff",
        success: "#00ff88",
        muted: "#888888",
        background: "#0a0a0a",
        surface: "#1a1a2e",
        card: "#16213e",
        text_primary: "#ffffff",
        text_secondary: "#aaaaaa",
        text_muted: "#666666",
        border: "#2a2a3e",
        divider: "#1e1e30",
      },
    },
    locale: {
      language: "es",
      country: "CO",
      timezone: "America/Bogota",
      currency: {
        code: "COP",
        symbol: "$",
        suffix_millions: "M",
        suffix_thousands: "K",
      },
      date_format: "DD/MM/YYYY",
    },
  },

  auth: {
    user: {
      id: "usr_001",
      name: "Asesor Demo",
      first_name: "Asesor",
      last_name: "Demo",
      email: "asesor@multiconsultorias.com",
      phone: "+573001234567",
      avatar_url: null,
      role: { id: "asesor_financiero", label: "Asesor Financiero", level: 2 },
      permissions: [
        "view_dashboard","manage_clients","manage_calendar",
        "view_goals","edit_goals","view_analytics","use_tools",
        "generate_reports","view_activity_log",
      ],
    },
    session: { is_authenticated: true },
  },

  notifications: {
    unread_count: 9,
    items: [
      {
        id: "notif_001",
        channel: "tasks",
        type: "task_overdue",
        title: "Tarea vencida",
        message: "CrediTu hp - Documentación lleva 24 días vencida",
        read: false,
        created_at: "2026-03-06T08:00:00-05:00",
      },
    ],
  },

  navigation: {
    type: "bottom_tab_bar",
    active_route: "dashboard",
    menu_items: [
      { id: "dashboard", icon: "grid", label: "Dashboard", route: "/dashboard", badge: null },
      { id: "clients", icon: "users", label: "Clientes", route: "/clients", badge: null },
      { id: "calendar", icon: "calendar", label: "Calendario", route: "/calendar", badge: 5 },
      { id: "goals", icon: "target", label: "Metas", route: "/goals", badge: null },
      { id: "analytics", icon: "chart-bar", label: "Analítica", route: "/analytics", badge: null },
      { id: "tools", icon: "wrench", label: "Herramientas", route: "/tools", badge: null },
      { id: "activity", icon: "clock", label: "Actividad", route: "/activity", badge: 3 },
    ],
  },

  modules: {
    dashboard: {
      _module_info: { id: "dashboard", name: "Dashboard MULTICONSULTORIAS", route: "/dashboard" },
      filters: {
        active_filter: "todos",
        options: [
          { id: "todos", label: "Todos", color: "#00ff88", count: 5 },
          { id: "nuevo_cliente", label: "Nuevo Cliente", color: "#888888", count: 1 },
          { id: "agendados", label: "Agendados", color: "#ffaa00", count: 0 },
          { id: "en_documentacion", label: "En Documentación", color: "#ff5500", count: 1 },
          { id: "radicacion", label: "Radicación", color: "#aa00ff", count: 0 },
          { id: "aprobados", label: "Aprobados", color: "#00ff88", count: 2 },
          { id: "insolvencia", label: "Insolvencia / Liquidación", color: "#5500ff", count: 1 },
          { id: "finalizados", label: "Finalizados", color: "#0088ff", count: 0 },
          { id: "desistidos", label: "Desistidos", color: "#ff0000", count: 0 },
        ],
      },
      kpis: [
        {
          id: "clientes", label: "CLIENTES", value: 5, display_value: "5", is_currency: false,
          trend: { value: -100, display: "-100%", direction: "down", is_positive: false },
          icon: "users", color: "#00ff88",
        },
        {
          id: "aprobado", label: "APROBADO", value: 350000000, display_value: "350.0M", is_currency: true,
          trend: { value: -100, display: "-100%", direction: "down", is_positive: false },
          icon: "check-circle", color: "#0088ff",
        },
        {
          id: "comisiones", label: "COMISIONES", value: 52500000, display_value: "52.5M", is_currency: true,
          trend: { value: -100, display: "-100%", direction: "down", is_positive: false },
          icon: "dollar-sign", color: "#ffaa00",
        },
        {
          id: "liquidaciones", label: "LIQUIDACIONES", value: 45000000, display_value: "45.0M", is_currency: true,
          trend: { value: 0, display: "0%", direction: "neutral", is_positive: null },
          icon: "file-text", color: "#aa00ff",
        },
        {
          id: "ganancias", label: "GANANCIAS", value: 47500000, display_value: "47.5M", is_currency: true,
          trend: { value: -100, display: "-100%", direction: "down", is_positive: false },
          icon: "trending-up", color: "#00ff88",
        },
      ],
      chart: {
        type: "bar",
        title: "Créditos por Mes",
        period: "6_months",
        x_axis: {
          type: "category",
          labels: ["Oct 2025","Nov 2025","Dic 2025","Ene 2026","Feb 2026","Mar 2026"],
          short_labels: ["oct.","nov.","dic.","ene.","feb.","mar."],
        },
        y_axis: { type: "currency", min: 0, max: 300000000 },
        datasets: [
          {
            id: "creditos",
            label: "Créditos",
            color: "#00ff88",
            data: [
              { period: "2025-10", value: 45000000, display: "45M" },
              { period: "2025-11", value: 60000000, display: "60M" },
              { period: "2025-12", value: 0, display: "0" },
              { period: "2026-01", value: 0, display: "0" },
              { period: "2026-02", value: 240000000, display: "240M" },
              { period: "2026-03", value: 0, display: "0" },
            ],
          },
        ],
      },
    },

    clients: {
      _module_info: { id: "clients", name: "Clientes MULTICONSULTORIAS", route: "/clients" },
      pipeline_stages: [
        { id: "nuevo_cliente", label: "Nuevo Cliente", color: "#888888", order: 1 },
        { id: "agendados", label: "Agendados", color: "#ffaa00", order: 2 },
        { id: "en_documentacion", label: "En Documentación", color: "#ff5500", order: 3 },
        { id: "radicacion", label: "Radicación", color: "#aa00ff", order: 4 },
        { id: "aprobados", label: "Aprobados", color: "#00ff88", order: 5 },
        { id: "insolvencia", label: "Insolvencia / Liquidación", color: "#5500ff", order: 6 },
        { id: "finalizados", label: "Finalizados", color: "#0088ff", order: 7 },
        { id: "desistidos", label: "Desistidos", color: "#ff0000", order: 8 },
      ],
      search: { query: "", sort_by: "updated_at", sort_order: "desc", filter_stage: "todos" },
      list: [
        {
          id: "cli_001", name: "Yulieth Canaval", initials: "YC",
          phone: "3137121004", email: null, referred_by: "Esteban",
          stage_id: "aprobados", total_sales: 120000000, display_sales: "120M",
          total_profit: 18000000, display_profit: "18M", notes: null,
          created_at: "2026-02-08T10:00:00-05:00", updated_at: "2026-02-08T14:30:00-05:00",
        },
        {
          id: "cli_002", name: "Danny Quiñones", initials: "DQ",
          phone: null, email: null, referred_by: "fff",
          stage_id: "en_documentacion", total_sales: 65000000, display_sales: "65M",
          total_profit: 9750000, display_profit: "9.7M", notes: null,
          created_at: "2026-02-10T09:00:00-05:00", updated_at: "2026-02-10T09:00:00-05:00",
        },
        {
          id: "cli_003", name: "Stevan", initials: "S",
          phone: "3775567788", email: null, referred_by: null,
          stage_id: "nuevo_cliente", total_sales: 0, display_sales: "0",
          total_profit: 0, display_profit: "0", notes: null,
          created_at: "2026-02-13T11:00:00-05:00", updated_at: "2026-02-13T11:00:00-05:00",
        },
        {
          id: "cli_004", name: "María López", initials: "ML",
          phone: "3001234567", email: "maria@email.com", referred_by: "Directo",
          stage_id: "aprobados", total_sales: 230000000, display_sales: "230M",
          total_profit: 34500000, display_profit: "34.5M", notes: "Cliente VIP",
          created_at: "2026-01-15T10:00:00-05:00", updated_at: "2026-02-20T10:00:00-05:00",
        },
        {
          id: "cli_005", name: "Carlos Ruiz", initials: "CR",
          phone: "3109876543", email: null, referred_by: "Esteban",
          stage_id: "insolvencia", total_sales: 45000000, display_sales: "45M",
          total_profit: 6750000, display_profit: "6.7M", notes: null,
          created_at: "2026-01-20T09:00:00-05:00", updated_at: "2026-02-25T09:00:00-05:00",
        },
      ],
    },

    calendar: {
      _module_info: { id: "calendar", name: "Calendario MULTICONSULTORIAS", route: "/calendar" },
      ui_state: {
        current_view: "month",
        available_views: ["day", "week", "month"],
        selected_date: "2026-03-09",
        visible_range: { start: "2026-03-01", end: "2026-03-31" },
      },
      stats: { today_pending: 0, overdue: 5, reminders: 7, total_tasks: 5 },
      event_types: [
        { id: "call", label: "Llamada", icon: "phone", default_color: "#8B6508" },
        { id: "task", label: "Tarea", icon: "check-square", default_color: "#004d33" },
        { id: "meeting", label: "Reunión", icon: "users", default_color: "#0088ff" },
        { id: "reminder", label: "Recordatorio", icon: "bell", default_color: "#ffaa00" },
      ],
      events: [
        {
          id: "evt_101", title: "Uuuuu", type: "call",
          date: "2026-03-03", time_start: "00:36", time_end: null, all_day: false,
          color: "#8B6508", client_id: null, description: null, completed: false,
          reminder: { enabled: true, minutes_before: 15 },
        },
        {
          id: "evt_102", title: "Davivienda - Llamada", type: "call",
          date: "2026-03-03", time_start: "10:00", time_end: "10:30", all_day: false,
          color: "#8B6508", client_id: "cli_001", description: "Seguimiento crédito Davivienda",
          completed: false, reminder: { enabled: true, minutes_before: 30 },
        },
        {
          id: "evt_103", title: "Hheheh4", type: "task",
          date: "2026-03-04", time_start: null, time_end: null, all_day: true,
          color: "#004d33", client_id: null, description: null, completed: false,
          reminder: { enabled: false, minutes_before: null },
        },
        {
          id: "evt_104", title: "Davivienda - Seguimiento", type: "task",
          date: "2026-03-09", time_start: null, time_end: null, all_day: true,
          color: "#004d33", client_id: "cli_001", description: null, completed: false,
          reminder: { enabled: false, minutes_before: null },
        },
        {
          id: "evt_105", title: "Reunión Equipo", type: "meeting",
          date: "2026-03-12", time_start: "14:00", time_end: "15:00", all_day: false,
          color: "#0088ff", client_id: null, description: "Revisión mensual de metas",
          completed: false, reminder: { enabled: true, minutes_before: 60 },
        },
        {
          id: "evt_106", title: "Recordatorio - Pago Danny", type: "reminder",
          date: "2026-03-15", time_start: null, time_end: null, all_day: true,
          color: "#ffaa00", client_id: "cli_002", description: null, completed: false,
          reminder: { enabled: true, minutes_before: 0 },
        },
      ],
    },

    goals: {
      _module_info: { id: "goals", name: "Metas MULTICONSULTORIAS", route: "/goals" },
      active_period: {
        start: "2025-10-31", end: "2025-11-29", display: "31/10/2025 - 29/11/2025",
      },
      monthly: {
        target: 40000000, current: 26000000, percentage: 65,
        display_target: "40M", display_current: "26M",
        remaining: 14000000, display_remaining: "14M",
      },
      trend: { period_days: 30, percentage: 44, display: "+44%", direction: "up", is_positive: true },
      weekly_breakdown: [
        {
          id: "week_1", label: "Sem 1",
          date_range: { start: "2025-10-31", end: "2025-11-06" },
          target: 8000000, current: 0, percentage: 0,
          display_target: "8M", display_current: "0",
        },
        {
          id: "week_2", label: "Sem 2",
          date_range: { start: "2025-11-07", end: "2025-11-13" },
          target: 8000000, current: 0, percentage: 0,
          display_target: "8M", display_current: "0",
        },
        {
          id: "week_3", label: "Sem 3",
          date_range: { start: "2025-11-14", end: "2025-11-20" },
          target: 8000000, current: 26000000, percentage: 100,
          display_target: "8M", display_current: "26M",
        },
        {
          id: "week_4", label: "Sem 4",
          date_range: { start: "2025-11-21", end: "2025-11-29" },
          target: 8000000, current: 0, percentage: 0,
          display_target: "8M", display_current: "0",
        },
      ],
    },

    analytics: {
      _module_info: { id: "analytics", name: "Analítica MULTICONSULTORIAS", route: "/analytics" },
      date_filter: {
        start: "2026-03-01", end: "2026-03-09",
        display_start: "01/03/2026", display_end: "09/03/2026",
        preset: "this_month",
        available_presets: [
          { id: "today", label: "Hoy" },
          { id: "this_week", label: "Esta Semana" },
          { id: "this_month", label: "Este Mes" },
          { id: "last_month", label: "Mes Anterior" },
          { id: "last_90_days", label: "Últimos 90 días" },
          { id: "custom", label: "Personalizado" },
        ],
      },
      kpis: [
        {
          id: "oportunidades", label: "Oportunidades", value: 5, display_value: "5", is_currency: false,
          trend: { value: 0, display: "+0%", direction: "neutral" }, icon: "eye",
        },
        {
          id: "propuestas", label: "Propuestas", value: 3, display_value: "3", is_currency: false,
          trend: { value: 0, display: "+0%", direction: "neutral" }, icon: "file-text",
        },
        {
          id: "total_ventas", label: "Total Ventas", value: 460000000, display_value: "460M", is_currency: true,
          trend: { value: 0, display: "+0%", direction: "neutral" }, icon: "shopping-cart",
        },
        {
          id: "comisiones", label: "Comisiones", value: 52500000, display_value: "52.5M", is_currency: true,
          trend: { value: 0, display: "+0%", direction: "neutral" }, icon: "dollar-sign",
        },
        {
          id: "desembolsos", label: "Desembolsos", value: 2, display_value: "2", is_currency: false,
          trend: { value: 0, display: "+0%", direction: "neutral" }, icon: "send",
        },
        {
          id: "cobrados", label: "Cobrados", value: 2, display_value: "2", is_currency: false,
          trend: { value: 0, display: "+0%", direction: "neutral" }, icon: "check-circle",
        },
      ],
      funnel: {
        total_leads: 5,
        stages: [
          { id: "registrados", name: "Registrados", count: 5, percentage: 100, color: "#00ff88" },
          { id: "en_pipeline", name: "En Pipeline", count: 4, percentage: 80, color: "#0088ff" },
          { id: "propuestas", name: "Propuestas", count: 3, percentage: 60, color: "#ffaa00" },
          { id: "aprobados", name: "Aprobados", count: 2, percentage: 40, color: "#aa00ff" },
          { id: "desembolsados", name: "Desembolsados", count: 2, percentage: 40, color: "#00ff88" },
        ],
      },
      top_clients: {
        sort_by: "total_sales",
        sort_order: "desc",
        max_display: 10,
        items: [
          {
            rank: 1, client_id: "cli_004", name: "María López", initials: "ML",
            referred_by: "Directo", total_sales: 230000000, display_sales: "230M",
            profit: 34500000, display_profit: "34.5M",
          },
          {
            rank: 2, client_id: "cli_001", name: "Yulieth Canaval", initials: "YC",
            referred_by: "Esteban", total_sales: 120000000, display_sales: "120M",
            profit: 18000000, display_profit: "18M",
          },
          {
            rank: 3, client_id: "cli_002", name: "Danny Quiñones", initials: "DQ",
            referred_by: "fff", total_sales: 65000000, display_sales: "65M",
            profit: 9750000, display_profit: "9.7M",
          },
          {
            rank: 4, client_id: "cli_005", name: "Carlos Ruiz", initials: "CR",
            referred_by: "Esteban", total_sales: 45000000, display_sales: "45M",
            profit: 6750000, display_profit: "6.7M",
          },
        ],
      },
    },

    tools: {
      _module_info: { id: "tools", name: "Herramientas MULTICONSULTORIAS", route: "/tools" },
      available_tools: [
        {
          id: "commission_calculator", label: "Calculadora de Comisiones",
          icon: "calculator", description: "Calcula comisiones por monto y tasa",
        },
        {
          id: "goal_projection", label: "Proyección de Meta",
          icon: "trending-up", description: "Proyecta cumplimiento mensual",
        },
        {
          id: "report_generator", label: "Generador de Reportes",
          icon: "file-text", description: "Genera reportes exportables PDF/Excel",
        },
      ],
    },

    activity_log: {
      _module_info: { id: "activity_log", name: "Actividad Reciente MULTICONSULTORIAS", route: "/activity" },
      active_filter: "all",
      available_filters: [
        { id: "all", label: "Todas" },
        { id: "nuevo_cliente", label: "Nuevos Clientes" },
        { id: "en_documentacion", label: "En Documentación" },
        { id: "en_liquidacion", label: "En Liquidación" },
        { id: "aprobados", label: "Aprobados" },
        { id: "stage_changed", label: "Cambios de Estado" },
      ],
      entries: [
        {
          id: "log_001", client_id: "cli_003", client_name: "Stevan",
          client_identifier: "3775567788", action: "client_created",
          action_label: "Cliente registrado",
          status_tag: { id: "nuevo_cliente", label: "Nuevo Cliente", color: "#888888" },
          timestamp: "2026-02-13T11:00:00-05:00", time_ago: "hace 24 días",
        },
        {
          id: "log_002", client_id: "cli_004", client_name: "María López",
          client_identifier: "3001234567", action: "stage_changed",
          action_label: "Cambió a Aprobados",
          status_tag: { id: "aprobados", label: "Aprobados", color: "#00ff88" },
          timestamp: "2026-02-20T10:00:00-05:00", time_ago: "hace 17 días",
        },
        {
          id: "log_003", client_id: "cli_001", client_name: "Yulieth Canaval",
          client_identifier: "3137121004", action: "stage_changed",
          action_label: "Cambió a Aprobados",
          status_tag: { id: "aprobados", label: "Aprobados", color: "#00ff88" },
          timestamp: "2026-02-08T14:30:00-05:00", time_ago: "hace 29 días",
        },
        {
          id: "log_004", client_id: "cli_002", client_name: "Danny Quiñones",
          client_identifier: "N/A", action: "stage_changed",
          action_label: "Cambió a Documentación",
          status_tag: { id: "en_documentacion", label: "En Documentación", color: "#ff5500" },
          timestamp: "2026-02-10T09:00:00-05:00", time_ago: "hace 27 días",
        },
        {
          id: "log_005", client_id: "cli_005", client_name: "Carlos Ruiz",
          client_identifier: "3109876543", action: "client_created",
          action_label: "Cliente registrado",
          status_tag: { id: "nuevo_cliente", label: "Nuevo Cliente", color: "#888888" },
          timestamp: "2026-01-20T09:00:00-05:00", time_ago: "hace 48 días",
        },
      ],
    },
  },

  tasks: {
    _module_info: { id: "tasks", name: "Sistema de Tareas MULTICONSULTORIAS", scope: "global" },
    summary: { total: 5, overdue: 5, due_today: 0, upcoming: 0, completed: 0 },
    priority_levels: [
      { id: "urgent", label: "Urgente", color: "#ff0000", order: 1 },
      { id: "high", label: "Alta", color: "#ff5500", order: 2 },
      { id: "medium", label: "Media", color: "#ffaa00", order: 3 },
      { id: "low", label: "Baja", color: "#0088ff", order: 4 },
    ],
    task_categories: [
      { id: "documentacion", label: "Documentación", icon: "file" },
      { id: "seguimiento", label: "Seguimiento", icon: "refresh-cw" },
      { id: "llamada", label: "Llamada", icon: "phone" },
      { id: "reunion", label: "Reunión", icon: "users" },
      { id: "radicacion", label: "Radicación", icon: "send" },
      { id: "general", label: "General", icon: "check-square" },
    ],
    items: [
      {
        id: "task_001", title: "CrediTu hp - Documentación", description: null,
        client_id: null, event_id: null, priority: "medium", category: "documentacion",
        status: "overdue", due_date: "2026-02-10", days_overdue: 27,
        status_display: "Vencida hace 27 días",
        created_at: "2026-02-08T10:00:00-05:00", completed_at: null,
      },
      {
        id: "task_002", title: "Davivienda - Seguimiento", description: null,
        client_id: "cli_001", event_id: null, priority: "medium", category: "seguimiento",
        status: "overdue", due_date: "2026-02-10", days_overdue: 27,
        status_display: "Vencida hace 27 días",
        created_at: "2026-02-08T10:00:00-05:00", completed_at: null,
      },
      {
        id: "task_003", title: "Danny - Documentos pendientes", description: null,
        client_id: "cli_002", event_id: null, priority: "high", category: "documentacion",
        status: "overdue", due_date: "2026-02-15", days_overdue: 22,
        status_display: "Vencida hace 22 días",
        created_at: "2026-02-10T09:00:00-05:00", completed_at: null,
      },
      {
        id: "task_004", title: "Davivienda - Llamada", description: null,
        client_id: "cli_001", event_id: "evt_102", priority: "urgent", category: "llamada",
        status: "overdue", due_date: "2026-02-26", days_overdue: 11,
        status_display: "Vencida hace 11 días",
        created_at: "2026-02-20T09:00:00-05:00", completed_at: null,
      },
      {
        id: "task_005", title: "Carlos - Reunión liquidación", description: null,
        client_id: "cli_005", event_id: null, priority: "high", category: "reunion",
        status: "overdue", due_date: "2026-03-01", days_overdue: 8,
        status_display: "Vencida hace 8 días",
        created_at: "2026-02-25T09:00:00-05:00", completed_at: null,
      },
    ],
  },
};
