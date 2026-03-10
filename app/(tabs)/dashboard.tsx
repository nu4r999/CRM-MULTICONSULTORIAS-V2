import React, { useState } from 'react';
import {
  StyleSheet, View, ScrollView, TouchableOpacity,
  StatusBar, Modal, Pressable,
} from 'react-native';
import { Theme } from '../../src/constants/Theme';
import { APP_SCHEMA } from '../../src/data/schema';
import { useApp } from '../../src/context/AppContext';
import { useAuth } from '../../src/context/AuthContext';
import { GlowCard } from '../../src/components/GlowCard';
import { Typography } from '../../src/components/Typography';
import { NeonButton } from '../../src/components/NeonButton';
import { DashboardChart } from '../../src/components/DashboardChart';
import { Ionicons } from '@expo/vector-icons';

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  clientes: 'people',
  aprobado: 'checkmark-circle',
  comisiones: 'cash',
  liquidaciones: 'document-text',
  ganancias: 'trending-up',
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: Theme.colors.danger,
  high: Theme.colors.warning,
  medium: Theme.colors.accent,
  low: Theme.colors.secondary,
};

export default function DashboardScreen() {
  const { state, completeTask } = useApp();
  const { user: authUser, logout } = useAuth();
  const dash = APP_SCHEMA.modules.dashboard;
  const user = APP_SCHEMA.auth.user;

  const [activeFilter, setActiveFilter] = useState(dash.filters.active_filter);
  const [notifVisible, setNotifVisible] = useState(false);

  const pendingTasks = state.tasks.filter(t => t.status !== 'completed');
  const chartData = dash.chart;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.bg_deep} />

      {/* Notification Modal */}
      <Modal transparent visible={notifVisible} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setNotifVisible(false)}>
          <View style={styles.notifPanel}>
            <View style={styles.notifHeader}>
              <Typography variant="h3" color="primary">Notificaciones</Typography>
              <TouchableOpacity onPress={() => setNotifVisible(false)}>
                <Ionicons name="close" size={22} color={Theme.colors.text_secondary} />
              </TouchableOpacity>
            </View>
            {APP_SCHEMA.notifications.items.map(n => (
              <GlowCard key={n.id} glowColor={Theme.colors.danger} style={styles.notifCard} padding={12}>
                <Typography variant="label" color="primary">{n.title}</Typography>
                <Typography variant="small" color="secondary" style={{ marginTop: 4 }}>{n.message}</Typography>
              </GlowCard>
            ))}
          </View>
        </Pressable>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View>
            <Typography variant="small" color="muted" style={styles.headerSub}>
              {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Typography>
            <View style={styles.headerNameRow}>
              <View style={[styles.accentPill, { backgroundColor: Theme.colors.primary }]} />
              <Typography variant="h2" style={styles.headerName}>
                Hola, <Typography variant="h2" style={{ color: Theme.colors.primary }}>{authUser?.displayName?.split(' ')[0] || user.first_name}</Typography>
              </Typography>
            </View>
            <Typography variant="small" color="muted">{APP_SCHEMA.config.branding.tagline}</Typography>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => setNotifVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="notifications-outline" size={22} color={Theme.colors.text_secondary} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.notifBtn, { borderColor: Theme.colors.danger + '44' }]}
              onPress={logout}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={20} color={Theme.colors.danger} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── PIPELINE FILTERS ── */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {dash.filters.options.map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                onPress={() => setActiveFilter(f.id)}
                activeOpacity={0.75}
                style={[
                  styles.chip,
                  isActive && { backgroundColor: f.color + '22', borderColor: f.color + '99' },
                ]}
              >
                <View style={[styles.chipDot, { backgroundColor: f.color }]} />
                <Typography
                  variant="caption"
                  style={{ color: isActive ? f.color : Theme.colors.text_muted, fontWeight: '700' }}
                >
                  {f.label}
                </Typography>
                {f.count > 0 && (
                  <View style={[styles.chipCount, { backgroundColor: f.color }]}>
                    <Typography variant="small" style={{ color: '#000', fontSize: 9, fontWeight: '800' }}>
                      {f.count}
                    </Typography>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── KPI GRID ── */}
        <View style={styles.sectionLabel}>
          <View style={[styles.sectionDot, { backgroundColor: Theme.colors.primary }]} />
          <Typography variant="caption" color="muted" style={styles.sectionText}>MÉTRICAS CLAVE</Typography>
        </View>

        <View style={styles.kpiGrid}>
          {dash.kpis.map((kpi) => (
            <GlowCard key={kpi.id} glowColor={kpi.color} style={styles.kpiCard} padding={14}>
              <View style={styles.kpiTop}>
                <View style={[styles.kpiIcon, { backgroundColor: kpi.color + '22' }]}>
                  <Ionicons name={ICON_MAP[kpi.id] ?? 'analytics'} size={16} color={kpi.color} />
                </View>
                <Typography variant="small" color="muted" style={styles.kpiLabel}>{kpi.label}</Typography>
              </View>
              <Typography variant="h2" style={{ color: kpi.color, fontWeight: '800', marginVertical: 6 }}>
                {kpi.is_currency ? `$${kpi.display_value}` : kpi.display_value}
              </Typography>
              <View style={styles.kpiTrend}>
                <Ionicons
                  name={kpi.trend.direction === 'up' ? 'trending-up' : kpi.trend.direction === 'down' ? 'trending-down' : 'remove'}
                  size={11}
                  color={kpi.trend.is_positive ? Theme.colors.primary : kpi.trend.is_positive === false ? Theme.colors.danger : Theme.colors.text_muted}
                />
                <Typography
                  variant="small"
                  style={{
                    color: kpi.trend.is_positive ? Theme.colors.primary : kpi.trend.is_positive === false ? Theme.colors.danger : Theme.colors.text_muted,
                    fontWeight: '700', marginLeft: 3,
                  }}
                >
                  {kpi.trend.display}
                </Typography>
              </View>
            </GlowCard>
          ))}
        </View>

        {/* ── CHART ── */}
        <View style={[styles.sectionLabel, { marginTop: 8 }]}>
          <View style={[styles.sectionDot, { backgroundColor: Theme.colors.secondary }]} />
          <Typography variant="caption" color="muted" style={styles.sectionText}>CRÉDITOS POR MES</Typography>
        </View>

        <GlowCard glowColor={Theme.colors.secondary} style={styles.chartCard} padding={14}>
          <DashboardChart
            title=""
            labels={chartData.x_axis.short_labels}
            data={chartData.datasets[0].data.map((d) => d.value / 1000000)}
            displayValues={chartData.datasets[0].data.map((d) => d.display)}
            color={chartData.datasets[0].color}
          />
        </GlowCard>

        {/* ── TAREAS ── */}
        <View style={[styles.sectionLabel, { marginTop: 16 }]}>
          <View style={[styles.sectionDot, { backgroundColor: Theme.colors.danger }]} />
          <Typography variant="caption" color="muted" style={styles.sectionText}>
            TAREAS PENDIENTES ({pendingTasks.length})
          </Typography>
        </View>

        {pendingTasks.map((task) => (
          <GlowCard
            key={task.id}
            glowColor={PRIORITY_COLORS[task.priority]}
            style={styles.taskCard}
            padding={14}
            variant="subtle"
          >
            <View style={styles.taskRow}>
              <View style={[styles.taskPriDot, { backgroundColor: PRIORITY_COLORS[task.priority] }]} />
              <View style={{ flex: 1 }}>
                <Typography variant="label" color="primary">{task.title}</Typography>
                <Typography variant="small" color="muted">{task.status_display}</Typography>
              </View>
              <TouchableOpacity
                onPress={() => completeTask(task.id)}
                style={[styles.taskDoneBtn, { borderColor: Theme.colors.primary + '66' }]}
                activeOpacity={0.7}
              >
                <Ionicons name="checkmark" size={14} color={Theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </GlowCard>
        ))}

        {pendingTasks.length === 0 && (
          <GlowCard glowColor={Theme.colors.primary} style={styles.taskCard} padding={24}>
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="checkmark-done-circle" size={36} color={Theme.colors.primary} />
              <Typography variant="body" color="muted" style={{ marginTop: 8, textAlign: 'center' }}>
                ¡Sin tareas pendientes! 🎉
              </Typography>
            </View>
          </GlowCard>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Theme.colors.bg_deep },
  content: { paddingHorizontal: 16, paddingTop: 20 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  headerSub: { marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  headerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  accentPill: { width: 3, height: 28, borderRadius: 2 },
  headerName: { fontSize: 24, fontWeight: '700' },
  notifBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Theme.colors.bg_card,
    borderWidth: 1, borderColor: Theme.colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute', top: 8, right: 8,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Theme.colors.danger,
    borderWidth: 1.5, borderColor: Theme.colors.bg_deep,
  },

  filterRow: { flexDirection: 'row', gap: 8, paddingBottom: 16, paddingRight: 16 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 999, borderWidth: 1, borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.bg_card,
  },
  chipDot: { width: 6, height: 6, borderRadius: 3 },
  chipCount: {
    minWidth: 16, height: 16, borderRadius: 999,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
  },

  sectionLabel: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionDot: { width: 6, height: 6, borderRadius: 3 },
  sectionText: { textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '700' },

  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  kpiCard: { width: '47%' },
  kpiTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  kpiIcon: { width: 28, height: 28, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  kpiLabel: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '700', flex: 1 },
  kpiTrend: { flexDirection: 'row', alignItems: 'center' },

  chartCard: { marginBottom: 8 },

  taskCard: { marginBottom: 8 },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  taskPriDot: { width: 8, height: 8, borderRadius: 4 },
  taskDoneBtn: {
    width: 30, height: 30, borderRadius: 15,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },

  overlay: { flex: 1, backgroundColor: '#00000088', justifyContent: 'flex-start', paddingTop: 80 },
  notifPanel: {
    marginHorizontal: 16, backgroundColor: Theme.colors.bg_surface,
    borderRadius: 20, padding: 20, borderWidth: 1, borderColor: Theme.colors.border,
  },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  notifCard: { marginBottom: 8 },
});
