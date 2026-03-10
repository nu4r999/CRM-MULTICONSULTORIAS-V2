import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Theme } from '../../src/constants/Theme';
import { APP_SCHEMA } from '../../src/data/schema';
import { useApp } from '../../src/context/AppContext';
import { GlowCard } from '../../src/components/GlowCard';
import { Typography } from '../../src/components/Typography';
import { ProgressBar } from '../../src/components/ProgressBar';
import { Badge } from '../../src/components/Badge';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const PRESETS = APP_SCHEMA.modules.analytics.date_filter.available_presets;

function FunnelStage({ name, count, percentage, color, maxCount }: any) {
  const barWidth = (count / maxCount) * (width - 80);
  return (
    <View style={styles.funnelRow}>
      <View style={styles.funnelLabelCol}>
        <Typography variant="caption" color="secondary" numberOfLines={1}>{name}</Typography>
      </View>
      <View style={styles.funnelBarWrap}>
        <View style={[styles.funnelBar, { width: barWidth, backgroundColor: color, shadowColor: color, shadowOpacity: 0.4, shadowRadius: 8 }]} />
      </View>
      <View style={styles.funnelCount}>
        <Typography variant="caption" style={{ color, fontWeight: '800' }}>{count}</Typography>
        <Typography variant="small" color="muted"> ({percentage}%)</Typography>
      </View>
    </View>
  );
}

const RANK_MEDALS = ['🥇', '🥈', '🥉'];

export default function AnalyticsScreen() {
  const analytics = APP_SCHEMA.modules.analytics;
  const { state } = useApp();
  const [activePreset, setActivePreset] = useState(analytics.date_filter.preset);

  const maxFunnelCount = analytics.funnel.stages[0]?.count ?? 1;

  // Compute real stats from state
  const totalVentas = state.clients.reduce((a, c) => a + c.total_sales, 0);
  const totalGanancias = state.clients.reduce((a, c) => a + c.total_profit, 0);
  const totalClientes = state.clients.length;

  const kpiValues: Record<string, { value: number; display: string }> = {
    oportunidades: { value: totalClientes, display: totalClientes.toString() },
    propuestas: { value: state.clients.filter(c => c.stage_id !== 'nuevo_cliente' && c.stage_id !== 'desistidos').length, display: state.clients.filter(c => c.stage_id !== 'nuevo_cliente' && c.stage_id !== 'desistidos').length.toString() },
    total_ventas: { value: totalVentas, display: `$${(totalVentas / 1e6).toFixed(1)}M` },
    comisiones: { value: totalGanancias, display: `$${(totalGanancias / 1e6).toFixed(1)}M` },
    desembolsos: { value: state.clients.filter(c => c.stage_id === 'aprobados' || c.stage_id === 'finalizados').length, display: state.clients.filter(c => c.stage_id === 'aprobados' || c.stage_id === 'finalizados').length.toString() },
    cobrados: { value: state.clients.filter(c => c.stage_id === 'finalizados').length, display: state.clients.filter(c => c.stage_id === 'finalizados').length.toString() },
  };

  const kpiColors = ['#00ff88', '#0088ff', '#ffaa00', '#aa00ff', '#ff5500', '#00ff88'];
  const kpiIcons: (keyof typeof Ionicons.glyphMap)[] = ['eye', 'document-text', 'cart', 'cash', 'send', 'checkmark-circle'];

  // Top clients from real state
  const topClients = [...state.clients]
    .filter(c => c.total_sales > 0)
    .sort((a, b) => b.total_sales - a.total_sales)
    .slice(0, 5);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── DATE FILTER ── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetRow}>
        {PRESETS.map(p => (
          <TouchableOpacity
            key={p.id}
            onPress={() => setActivePreset(p.id)}
            style={[styles.preset, activePreset === p.id && styles.presetActive]}
            activeOpacity={0.75}
          >
            <Typography variant="caption" style={{ color: activePreset === p.id ? Theme.colors.primary : Theme.colors.text_muted, fontWeight: '700' }}>
              {p.label}
            </Typography>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── KPI GRID ── */}
      <View style={styles.sectionLabel}>
        <View style={[styles.sectionDot, { backgroundColor: Theme.colors.primary }]} />
        <Typography variant="caption" color="muted" style={styles.sectionText}>INDICADORES</Typography>
      </View>

      <View style={styles.kpiGrid}>
        {analytics.kpis.map((kpi, i) => {
          const kv = kpiValues[kpi.id];
          const color = kpiColors[i % kpiColors.length];
          return (
            <GlowCard key={kpi.id} glowColor={color} style={styles.kpiCard} padding={14} variant="subtle">
              <View style={[styles.kpiIcon, { backgroundColor: color + '22' }]}>
                <Ionicons name={kpiIcons[i] ?? 'analytics'} size={16} color={color} />
              </View>
              <Typography variant="h3" style={{ color, fontWeight: '800', marginTop: 8, marginBottom: 2 }}>
                {kv?.display ?? kpi.display_value}
              </Typography>
              <Typography variant="small" color="muted" style={styles.kpiLabel}>{kpi.label}</Typography>
            </GlowCard>
          );
        })}
      </View>

      {/* ── FUNNEL ── */}
      <View style={[styles.sectionLabel, { marginTop: 16 }]}>
        <View style={[styles.sectionDot, { backgroundColor: Theme.colors.secondary }]} />
        <Typography variant="caption" color="muted" style={styles.sectionText}>EMBUDO DE CONVERSIÓN</Typography>
      </View>

      <GlowCard glowColor={Theme.colors.secondary} style={styles.funnelCard} padding={16}>
        <View style={styles.funnelHeader}>
          <Typography variant="label" color="secondary">Total Leads: {analytics.funnel.total_leads}</Typography>
        </View>
        {analytics.funnel.stages.map(stage => (
          <FunnelStage
            key={stage.id}
            name={stage.name}
            count={stage.count}
            percentage={stage.percentage}
            color={stage.color}
            maxCount={maxFunnelCount}
          />
        ))}
      </GlowCard>

      {/* ── TOP CLIENTS ── */}
      <View style={[styles.sectionLabel, { marginTop: 16 }]}>
        <View style={[styles.sectionDot, { backgroundColor: Theme.colors.accent }]} />
        <Typography variant="caption" color="muted" style={styles.sectionText}>TOP CLIENTES</Typography>
      </View>

      {topClients.map((c, i) => {
        const stageColors = Theme.colors.status;
        const stageColor = (stageColors as any)[c.stage_id] ?? Theme.colors.text_muted;
        const marginPct = c.total_sales > 0 ? ((c.total_profit / c.total_sales) * 100).toFixed(1) : '0';
        return (
          <GlowCard key={c.id} glowColor={stageColor} style={styles.clientCard} padding={14} variant="subtle">
            <View style={styles.clientRow}>
              <View style={[styles.rankBadge]}>
                <Typography style={{ fontSize: 18 }}>{RANK_MEDALS[i] ?? `#${i + 1}`}</Typography>
              </View>
              <View style={[styles.clientAvatar, { backgroundColor: stageColor + '22', borderColor: stageColor + '66' }]}>
                <Typography variant="label" style={{ color: stageColor, fontWeight: '800' }}>{c.initials}</Typography>
              </View>
              <View style={{ flex: 1 }}>
                <Typography variant="label" color="primary">{c.name}</Typography>
                {c.referred_by && <Typography variant="small" color="muted">Ref: {c.referred_by}</Typography>}
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Typography variant="label" style={{ color: Theme.colors.secondary, fontWeight: '700' }}>${(c.total_sales / 1e6).toFixed(1)}M</Typography>
                <Typography variant="small" style={{ color: Theme.colors.primary }}>{marginPct}% margen</Typography>
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <ProgressBar
                percentage={topClients.length > 0 ? (c.total_sales / topClients[0].total_sales) * 100 : 0}
                color={stageColor}
                height={4}
              />
            </View>
          </GlowCard>
        );
      })}

      {topClients.length === 0 && (
        <GlowCard glowColor={Theme.colors.border} padding={30}>
          <View style={{ alignItems: 'center' }}>
            <Ionicons name="bar-chart-outline" size={40} color={Theme.colors.text_muted} />
            <Typography variant="body" color="muted" style={{ marginTop: 12 }}>Sin datos de ventas</Typography>
          </View>
        </GlowCard>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Theme.colors.bg_deep },
  content: { paddingHorizontal: 16, paddingTop: 16 },

  presetRow: { flexDirection: 'row', gap: 8, paddingBottom: 16 },
  preset: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: Theme.colors.border, backgroundColor: Theme.colors.bg_card },
  presetActive: { borderColor: Theme.colors.primary + '88', backgroundColor: Theme.colors.primary + '18' },

  sectionLabel: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionDot: { width: 6, height: 6, borderRadius: 3 },
  sectionText: { textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '700' },

  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  kpiCard: { width: '30.5%' },
  kpiIcon: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  kpiLabel: { textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: '700' },

  funnelCard: { marginBottom: 8 },
  funnelHeader: { marginBottom: 16 },
  funnelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  funnelLabelCol: { width: 80 },
  funnelBarWrap: { flex: 1, height: 18, justifyContent: 'center', overflow: 'hidden' },
  funnelBar: { height: 18, borderRadius: 4, elevation: 4 },
  funnelCount: { flexDirection: 'row', alignItems: 'center', width: 70, justifyContent: 'flex-end' },

  clientCard: { marginBottom: 10 },
  clientRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rankBadge: { width: 32, alignItems: 'center' },
  clientAvatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
});
