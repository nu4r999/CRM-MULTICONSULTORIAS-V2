// ══════════════════════════════════════════════
//  MULTICONSULTORIAS — FUTURISTIC DESIGN SYSTEM
// ══════════════════════════════════════════════

export const Theme = {
  colors: {
    // Backgrounds
    bg_deep:    '#05050d',   // deepest – main screen bg
    bg_surface: '#0a0f1e',   // cards
    bg_card:    '#0d1421',   // elevated cards
    bg_input:   '#111827',   // inputs

    // Neon Accents
    primary:    '#00ff88',   // neon green
    secondary:  '#0088ff',   // neon blue
    accent:     '#ffaa00',   // neon amber
    purple:     '#aa00ff',   // neon purple
    danger:     '#ff3366',   // neon red-pink
    warning:    '#ff5500',   // neon orange
    info:       '#5500ff',   // neon indigo

    // Text
    text_primary:   '#f0f4ff',
    text_secondary: '#8892a4',
    text_muted:     '#4a5568',

    // Borders
    border:  '#1a2236',
    divider: '#111827',

    // Glow versions (for shadows)
    glow_primary: '#00ff88',
    glow_blue:    '#0088ff',
    glow_amber:   '#ffaa00',
    glow_red:     '#ff3366',

    // Status map (pipeline)
    status: {
      nuevo_cliente:    '#888888',
      agendados:        '#ffaa00',
      en_documentacion: '#ff5500',
      radicacion:       '#aa00ff',
      aprobados:        '#00ff88',
      insolvencia:      '#5500ff',
      finalizados:      '#0088ff',
      desistidos:       '#ff3366',
    },
  },

  borderRadius: {
    xs: 6,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },

  // Neon glow shadow presets
  glow: (color: string, intensity: number = 0.5) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: intensity,
    shadowRadius: 16,
    elevation: 12,
  }),

  typography: {
    fontFamily: 'System',
    sizes: {
      xs:   10,
      sm:   12,
      base: 14,
      md:   16,
      lg:   18,
      xl:   22,
      xxl:  28,
      hero: 36,
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};

// Alias for backward compat
export const pipelineStagesColors: Record<string, string> = Theme.colors.status;
