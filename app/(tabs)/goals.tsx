import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Theme } from '../../src/constants/Theme';
import { APP_SCHEMA } from '../../src/data/schema';
import { GlowCard } from '../../src/components/GlowCard';
import { Typography } from '../../src/components/Typography';
import { CircularProgress } from '../../src/components/CircularProgress';
import { ProgressBar } from '../../src/components/ProgressBar';
import { Ionicons } from '@expo/vector-icons';

export default function GoalsScreen() {
  const { goals } = APP_SCHEMA.modules;
  const { monthly, trend, weekly_breakdown, active_period } = goals;

  const daysLeft = 7; // Could compute from active_period
  const dailyNeeded = monthly.remaining / Math.max(daysLeft, 1);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── HEADER ── */}
      <View style={styles.periodRow}>
        <View style={[styles.periodBadge, { borderColor: Theme.colors.primary + '44' }]}>
          <Ionicons name="calendar-outline" size={12} color={Theme.colors.primary} />
          <Typography variant="caption" style={{ color: Theme.colors.primary, fontWeight: '700', marginLeft: 6 }}>
            Período: {active_period.display}
          </Typography>
        </View>
        <View style={[styles.trendBadge, { borderColor: Theme.colors.primary + '66', backgroundColor: Theme.colors.primary + '15' }]}>
          <Ionicons name="trending-up" size={12} color={Theme.colors.primary} />
          <Typography variant="caption" style={{ color: Theme.colors.primary, fontWeight: '700', marginLeft: 4 }}>
            {trend.display}
          </Typography>
        </View>
      </View>

      {/* ── MAIN PROGRESS CARD ── */}
      <GlowCard glowColor={Theme.colors.primary} style={styles.mainCard} padding={24} variant="strong">
        <View style={styles.mainInner}>
          <CircularProgress
            size={160}
            progress={monthly.percentage}
            color={Theme.colors.primary}
            trackColor={Theme.colors.border}
            strokeWidth={10}
            label="Meta Mensual"
            sublabel={`${monthly.display_current} / ${monthly.display_target}`}
          />
          <View style={styles.mainStats}>
            <View style={styles.mainStat}>
              <Typography variant="caption" color="muted" style={styles.mainStatLabel}>META</Typography>
              <Typography variant="h2" style={{ color: Theme.colors.text_primary, fontWeight: '800' }}>
                ${monthly.display_target}
              </Typography>
            </View>
            <View style={[styles.mainStatDivider]} />
            <View style={styles.mainStat}>
              <Typography variant="caption" color="muted" style={styles.mainStatLabel}>ACTUAL</Typography>
              <Typography variant="h2" style={{ color: Theme.colors.primary, fontWeight: '800' }}>
                ${monthly.display_current}
              </Typography>
            </View>
            <View style={styles.mainStatDivider} />
            <View style={styles.mainStat}>
              <Typography variant="caption" color="muted" style={styles.mainStatLabel}>FALTA</Typography>
              <Typography variant="h2" style={{ color: Theme.colors.danger, fontWeight: '800' }}>
                ${monthly.display_remaining}
              </Typography>
            </View>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={{ marginTop: 20 }}>
          <ProgressBar
            percentage={monthly.percentage}
            color={Theme.colors.primary}
            height={8}
            showLabel
          />
        </View>
      </GlowCard>

      {/* ── DAILY NEEDED ── */}
      <View style={styles.miniStats}>
        {[
          { label: 'DÍAS RESTANTES', value: daysLeft.toString(), color: Theme.colors.secondary, icon: 'time-outline' as const },
          { label: 'DIARIO NECESARIO', value: `$${(dailyNeeded / 1e6).toFixed(1)}M`, color: Theme.colors.accent, icon: 'flash-outline' as const },
          { label: 'TENDENCIA', value: trend.display, color: Theme.colors.primary, icon: 'trending-up' as const },
        ].map(item => (
          <GlowCard key={item.label} glowColor={item.color} style={styles.miniCard} padding={12} variant="subtle">
            <View style={[styles.miniIcon, { backgroundColor: item.color + '22' }]}>
              <Ionicons name={item.icon} size={16} color={item.color} />
            </View>
            <Typography variant="h3" style={{ color: item.color, fontWeight: '800', marginTop: 8 }}>{item.value}</Typography>
            <Typography variant="small" color="muted" style={styles.miniLabel}>{item.label}</Typography>
          </GlowCard>
        ))}
      </View>

      {/* ── WEEKLY BREAKDOWN ── */}
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionDot, { backgroundColor: Theme.colors.accent }]} />
        <Typography variant="caption" color="muted" style={styles.sectionText}>DESGLOSE SEMANAL</Typography>
      </View>

      {weekly_breakdown.map((week, idx) => {
        const pct = Math.min((week.current / week.target) * 100, 100);
        const color = pct >= 100 ? Theme.colors.primary : pct >= 50 ? Theme.colors.accent : Theme.colors.danger;
        return (
          <GlowCard key={week.id} glowColor={color} style={styles.weekCard} padding={14} variant="subtle">
            <View style={styles.weekHeader}>
              <View style={styles.weekLeft}>
                <View style={[styles.weekNum, { backgroundColor: color + '22', borderColor: color + '55' }]}>
                  <Typography variant="label" style={{ color, fontWeight: '800' }}>{idx + 1}</Typography>
                </View>
                <View>
                  <Typography variant="label" color="primary">{week.label}</Typography>
                  <Typography variant="small" color="muted">
                    {week.date_range.start.split('-').reverse().slice(0,2).join('/')} — {week.date_range.end.split('-').reverse().slice(0,2).join('/')}
                  </Typography>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Typography variant="label" style={{ color, fontWeight: '800' }}>
                  {pct >= 100 ? '✓' : `${Math.round(pct)}%`}
                </Typography>
                <Typography variant="small" color="muted">${week.display_current} / ${week.display_target}</Typography>
              </View>
            </View>
            <ProgressBar percentage={pct} color={color} height={5} style={{ marginTop: 10 }} />
          </GlowCard>
        );
      })}

      {/* ── MOTIVATION ── */}
      <GlowCard glowColor={Theme.colors.purple} style={styles.motivCard} padding={20} variant="strong">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={[styles.motivIcon, { backgroundColor: Theme.colors.purple + '33' }]}>
            <Typography style={{ fontSize: 28 }}>🚀</Typography>
          </View>
          <View style={{ flex: 1 }}>
            <Typography variant="h3" color="primary">¡Sigue así!</Typography>
            <Typography variant="body" color="secondary" style={{ marginTop: 4 }}>
              {monthly.percentage >= 100
                ? '¡Meta completada! Excelente trabajo.'
                : `Necesitas $${monthly.display_remaining} más para alcanzar tu meta.`}
            </Typography>
          </View>
        </View>
      </GlowCard>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Theme.colors.bg_deep },
  content: { paddingHorizontal: 16, paddingTop: 20 },

  periodRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  periodBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1, backgroundColor: Theme.colors.bg_card },
  trendBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },

  mainCard: { marginBottom: 16 },
  mainInner: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  mainStats: { flex: 1, gap: 12 },
  mainStat: { alignItems: 'center' },
  mainStatLabel: { textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '700', marginBottom: 2 },
  mainStatDivider: { height: 1, backgroundColor: Theme.colors.divider },

  miniStats: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  miniCard: { flex: 1 },
  miniIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  miniLabel: { textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: '700', marginTop: 4 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionDot: { width: 6, height: 6, borderRadius: 3 },
  sectionText: { textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '700' },

  weekCard: { marginBottom: 10 },
  weekHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  weekLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  weekNum: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },

  motivCard: { marginTop: 8, marginBottom: 8 },
  motivIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
