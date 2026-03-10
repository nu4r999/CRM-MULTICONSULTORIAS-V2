import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Theme } from '../../src/constants/Theme';
import { APP_SCHEMA } from '../../src/data/schema';
import { GlowCard } from '../../src/components/GlowCard';
import { Typography } from '../../src/components/Typography';
import { Badge } from '../../src/components/Badge';
import { Ionicons } from '@expo/vector-icons';

const FILTERS = APP_SCHEMA.modules.activity_log.available_filters;
const ACTION_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  client_created: 'person-add',
  stage_changed: 'swap-horizontal',
  task_completed: 'checkmark-done',
  event_created: 'calendar',
  default: 'time',
};

export default function ActivityScreen() {
  const actLog = APP_SCHEMA.modules.activity_log;
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = actLog.entries.filter(entry => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'stage_changed') return entry.action === 'stage_changed';
    return entry.status_tag.id === activeFilter;
  });

  // Stats
  const totalEntries = actLog.entries.length;
  const stageChanges = actLog.entries.filter(e => e.action === 'stage_changed').length;
  const newClients = actLog.entries.filter(e => e.action === 'client_created').length;

  return (
    <View style={styles.root}>
      {/* ── STATS ── */}
      <View style={styles.statsSection}>
        <View style={styles.statsRow}>
          {[
            { label: 'Total Eventos', value: totalEntries, color: Theme.colors.primary },
            { label: 'Cambios Estado', value: stageChanges, color: Theme.colors.secondary },
            { label: 'Nuevos Clientes', value: newClients, color: Theme.colors.accent },
          ].map(s => (
            <GlowCard key={s.label} glowColor={s.color} style={styles.statCard} padding={10} variant="subtle">
              <Typography variant="h3" style={{ color: s.color, fontWeight: '800', textAlign: 'center' }}>{s.value}</Typography>
              <Typography variant="small" color="muted" style={{ textAlign: 'center' }}>{s.label}</Typography>
            </GlowCard>
          ))}
        </View>

        {/* ── FILTERS ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {FILTERS.map(f => {
            const isActive = activeFilter === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                onPress={() => setActiveFilter(f.id)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                activeOpacity={0.75}
              >
                <Typography
                  variant="caption"
                  style={{ color: isActive ? Theme.colors.primary : Theme.colors.text_muted, fontWeight: '700' }}
                >
                  {f.label}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── TIMELINE ── */}
      <FlatList
        data={filtered}
        keyExtractor={e => e.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const statusColor = item.status_tag.color;
          const icon = ACTION_ICONS[item.action] ?? ACTION_ICONS.default;
          const isLast = index === filtered.length - 1;

          return (
            <View style={styles.timelineItem}>
              {/* Timeline line */}
              <View style={styles.timelineLeft}>
                <GlowCard glowColor={statusColor} style={styles.timelineDotCard} padding={0} variant="subtle">
                  <View style={[styles.timelineDot, { borderColor: statusColor + '88' }]}>
                    <Ionicons name={icon} size={14} color={statusColor} />
                  </View>
                </GlowCard>
                {!isLast && <View style={styles.timelineLine} />}
              </View>

              {/* Content */}
              <GlowCard glowColor={statusColor} style={styles.entryCard} padding={14} variant="subtle">
                <View style={styles.entryTop}>
                  <View style={{ flex: 1 }}>
                    <Typography variant="label" color="primary">{item.client_name}</Typography>
                    <Typography variant="small" color="secondary">{item.action_label}</Typography>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <Badge label={item.status_tag.label} color={statusColor} size="sm" />
                    <Typography variant="small" color="muted">{item.time_ago}</Typography>
                  </View>
                </View>

                {item.client_identifier && item.client_identifier !== 'N/A' && (
                  <View style={styles.identifierRow}>
                    <Ionicons name="call-outline" size={11} color={Theme.colors.text_muted} />
                    <Typography variant="small" color="muted" style={{ marginLeft: 4 }}>{item.client_identifier}</Typography>
                  </View>
                )}

                <View style={styles.entryFooter}>
                  <Ionicons name="time-outline" size={11} color={Theme.colors.text_muted} />
                  <Typography variant="small" color="muted" style={{ marginLeft: 4 }}>
                    {new Date(item.timestamp).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </View>
              </GlowCard>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="time-outline" size={48} color={Theme.colors.text_muted} />
            <Typography variant="body" color="muted" style={{ marginTop: 12 }}>Sin actividad en este filtro</Typography>
          </View>
        }
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Theme.colors.bg_deep },
  statsSection: { paddingHorizontal: 16, paddingTop: 16 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  statCard: { flex: 1 },

  filters: { flexDirection: 'row', gap: 8, paddingBottom: 12 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 999, borderWidth: 1, borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.bg_card,
  },
  filterChipActive: { borderColor: Theme.colors.primary + '88', backgroundColor: Theme.colors.primary + '18' },

  list: { paddingHorizontal: 16, paddingTop: 8 },

  timelineItem: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  timelineLeft: { alignItems: 'center', width: 40 },
  timelineDotCard: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden' },
  timelineDot: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, backgroundColor: Theme.colors.bg_card,
  },
  timelineLine: { flex: 1, width: 2, backgroundColor: Theme.colors.divider, marginTop: 6 },

  entryCard: { flex: 1 },
  entryTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  identifierRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  entryFooter: {
    flexDirection: 'row', alignItems: 'center', marginTop: 8, paddingTop: 8,
    borderTopWidth: 1, borderTopColor: Theme.colors.divider,
  },
  empty: { alignItems: 'center', paddingTop: 60 },
});
