import React, { useState } from 'react';
import {
  StyleSheet, View, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Theme } from '../../src/constants/Theme';
import { APP_SCHEMA } from '../../src/data/schema';
import { GlowCard } from '../../src/components/GlowCard';
import { Typography } from '../../src/components/Typography';
import { NeonButton } from '../../src/components/NeonButton';
import { Ionicons } from '@expo/vector-icons';

type ToolId = 'commission_calculator' | 'goal_projection' | 'report_generator';

const TOOL_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  commission_calculator: 'calculator',
  goal_projection: 'trending-up',
  report_generator: 'document-text',
};
const TOOL_COLORS: Record<string, string> = {
  commission_calculator: Theme.colors.primary,
  goal_projection: Theme.colors.secondary,
  report_generator: Theme.colors.accent,
};

function formatCOP(num: number): string {
  return new Intl.NumberFormat('es-CO').format(Math.round(num));
}

// ── COMMISSION CALCULATOR ─────────────────────
function CommissionCalculator() {
  const [amount, setAmount] = useState('1000000');
  const [rate, setRate] = useState('2.5');

  const rawAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.')) || 0;
  const rawRate = parseFloat(rate.replace(',', '.')) || 0;
  const commission = (rawAmount * rawRate) / 100;
  const net = rawAmount - commission;

  return (
    <View>
      <View style={styles.calcRow}>
        <View style={styles.calcField}>
          <Typography variant="caption" color="muted" style={styles.fl}>MONTO DEL CRÉDITO (COP)</Typography>
          <View style={styles.inputWrap}>
            <Typography variant="label" style={{ color: Theme.colors.primary, marginRight: 6 }}>$</Typography>
            <TextInput
              style={styles.calcInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={Theme.colors.text_muted}
            />
          </View>
        </View>
        <View style={styles.calcField}>
          <Typography variant="caption" color="muted" style={styles.fl}>TASA (%)</Typography>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.calcInput}
              value={rate}
              onChangeText={setRate}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={Theme.colors.text_muted}
            />
            <Typography variant="label" style={{ color: Theme.colors.accent, marginLeft: 6 }}>%</Typography>
          </View>
        </View>
      </View>

      <GlowCard glowColor={Theme.colors.primary} style={styles.resultCard} padding={20} variant="strong">
        <Typography variant="caption" color="muted" style={[styles.fl, { textAlign: 'center' }]}>COMISIÓN GENERADA</Typography>
        <Typography variant="h2" style={{ color: Theme.colors.primary, fontWeight: '800', textAlign: 'center', fontSize: 32, marginVertical: 8 }}>
          ${formatCOP(commission)}
        </Typography>
        <View style={styles.resultRow}>
          <View style={styles.resultItem}>
            <Typography variant="small" color="muted">MONTO BRUTO</Typography>
            <Typography variant="label" style={{ color: Theme.colors.text_primary }}>${formatCOP(rawAmount)}</Typography>
          </View>
          <View style={styles.resultDivider} />
          <View style={styles.resultItem}>
            <Typography variant="small" color="muted">TASA</Typography>
            <Typography variant="label" style={{ color: Theme.colors.accent }}>{rawRate}%</Typography>
          </View>
          <View style={styles.resultDivider} />
          <View style={styles.resultItem}>
            <Typography variant="small" color="muted">NETO CLIENTE</Typography>
            <Typography variant="label" style={{ color: Theme.colors.secondary }}>${formatCOP(net)}</Typography>
          </View>
        </View>
      </GlowCard>
    </View>
  );
}

// ── GOAL PROJECTION ───────────────────────────
function GoalProjection() {
  const [accumulated, setAccumulated] = useState('5000000');
  const [goal, setGoal] = useState('40000000');
  const [daysLeft, setDaysLeft] = useState('15');

  const acc = parseFloat(accumulated.replace(/[^0-9]/g, '')) || 0;
  const goalVal = parseFloat(goal.replace(/[^0-9]/g, '')) || 1;
  const days = parseInt(daysLeft) || 1;
  const remaining = Math.max(goalVal - acc, 0);
  const dailyNeeded = remaining / days;
  const pct = Math.min((acc / goalVal) * 100, 100);
  const onTrack = acc / goalVal >= (1 - days / 30);

  return (
    <View>
      {[
        { label: 'ACUMULADO ACTUAL', value: accumulated, setter: setAccumulated, prefix: '$' },
        { label: 'META MENSUAL', value: goal, setter: setGoal, prefix: '$' },
        { label: 'DÍAS RESTANTES', value: daysLeft, setter: setDaysLeft, prefix: '📅' },
      ].map(f => (
        <View key={f.label} style={styles.formGroup}>
          <Typography variant="caption" color="muted" style={styles.fl}>{f.label}</Typography>
          <View style={styles.inputWrap}>
            <Typography variant="label" style={{ color: Theme.colors.primary, marginRight: 6 }}>{f.prefix}</Typography>
            <TextInput
              style={styles.calcInput}
              value={f.value}
              onChangeText={f.setter}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={Theme.colors.text_muted}
            />
          </View>
        </View>
      ))}

      <GlowCard
        glowColor={onTrack ? Theme.colors.primary : Theme.colors.danger}
        style={styles.resultCard}
        padding={20}
        variant="strong"
      >
        <View style={styles.trackRow}>
          <View style={[styles.trackBadge, { backgroundColor: (onTrack ? Theme.colors.primary : Theme.colors.danger) + '22', borderColor: (onTrack ? Theme.colors.primary : Theme.colors.danger) }]}>
            <Ionicons name={onTrack ? 'checkmark-circle' : 'alert-circle'} size={18} color={onTrack ? Theme.colors.primary : Theme.colors.danger} />
            <Typography variant="label" style={{ color: onTrack ? Theme.colors.primary : Theme.colors.danger, marginLeft: 6 }}>
              {onTrack ? 'EN LÍNEA' : 'EN RIESGO'}
            </Typography>
          </View>
          <Typography variant="h2" style={{ color: onTrack ? Theme.colors.primary : Theme.colors.danger, fontWeight: '800' }}>
            {Math.round(pct)}%
          </Typography>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: onTrack ? Theme.colors.primary : Theme.colors.danger }]} />
        </View>

        <View style={[styles.resultRow, { marginTop: 16 }]}>
          <View style={styles.resultItem}>
            <Typography variant="small" color="muted">FALTA</Typography>
            <Typography variant="label" style={{ color: Theme.colors.danger, fontWeight: '700' }}>${formatCOP(remaining)}</Typography>
          </View>
          <View style={styles.resultDivider} />
          <View style={styles.resultItem}>
            <Typography variant="small" color="muted">DIARIO</Typography>
            <Typography variant="label" style={{ color: Theme.colors.accent, fontWeight: '700' }}>${formatCOP(dailyNeeded)}</Typography>
          </View>
        </View>
      </GlowCard>
    </View>
  );
}

// ── REPORT GENERATOR ─────────────────────────
function ReportGenerator() {
  const [selectedReport, setSelectedReport] = useState('client_list');
  const [generating, setGenerating] = useState(false);

  const reports = APP_SCHEMA.modules.tools.available_tools.filter(t => t.id === 'report_generator')[0];
  const reportTypes = [
    { id: 'client_list', label: 'Lista de Clientes', icon: 'people' as const, formats: ['PDF', 'Excel', 'CSV'], description: 'Todos los clientes con estado actual' },
    { id: 'sales_report', label: 'Reporte de Ventas', icon: 'cart' as const, formats: ['PDF', 'Excel'], description: 'Detalle de ventas por período' },
    { id: 'commission_report', label: 'Reporte de Comisiones', icon: 'cash' as const, formats: ['PDF', 'Excel'], description: 'Comisiones generadas y pendientes' },
  ];

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      Alert.alert('✅ Reporte generado', 'Tu reporte está listo para descargar.', [{ text: 'OK' }]);
    }, 1500);
  }

  return (
    <View>
      {reportTypes.map(r => (
        <TouchableOpacity
          key={r.id}
          onPress={() => setSelectedReport(r.id)}
          activeOpacity={0.8}
          style={{ marginBottom: 10 }}
        >
          <GlowCard
            glowColor={selectedReport === r.id ? Theme.colors.accent : Theme.colors.border}
            style={[styles.reportCard, selectedReport === r.id && { borderColor: Theme.colors.accent + '88' }]}
            padding={14}
            variant={selectedReport === r.id ? 'default' : 'subtle'}
          >
            <View style={styles.reportRow}>
              <View style={[styles.reportIcon, { backgroundColor: (selectedReport === r.id ? Theme.colors.accent : Theme.colors.text_muted) + '22' }]}>
                <Ionicons name={r.icon} size={20} color={selectedReport === r.id ? Theme.colors.accent : Theme.colors.text_muted} />
              </View>
              <View style={{ flex: 1 }}>
                <Typography variant="label" style={{ color: selectedReport === r.id ? Theme.colors.text_primary : Theme.colors.text_secondary }}>
                  {r.label}
                </Typography>
                <Typography variant="small" color="muted">{r.description}</Typography>
                <View style={styles.formatsRow}>
                  {r.formats.map(f => (
                    <View key={f} style={styles.formatBadge}>
                      <Typography variant="small" style={{ color: Theme.colors.accent, fontSize: 9, fontWeight: '700' }}>{f}</Typography>
                    </View>
                  ))}
                </View>
              </View>
              {selectedReport === r.id && (
                <Ionicons name="checkmark-circle" size={20} color={Theme.colors.accent} />
              )}
            </View>
          </GlowCard>
        </TouchableOpacity>
      ))}
      <NeonButton
        label={generating ? 'Generando...' : '⬇ Generar Reporte'}
        onPress={handleGenerate}
        color={Theme.colors.accent}
        loading={generating}
        fullWidth
        size="lg"
        style={{ marginTop: 8 }}
      />
    </View>
  );
}

// ── MAIN SCREEN ───────────────────────────────
export default function ToolsScreen() {
  const tools = APP_SCHEMA.modules.tools.available_tools;
  const [activeTool, setActiveTool] = useState<ToolId>('commission_calculator');

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* ── TOOL SELECTOR ── */}
        <View style={styles.toolSelector}>
          {tools.map(t => {
            const color = TOOL_COLORS[t.id];
            const isActive = activeTool === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                onPress={() => setActiveTool(t.id as ToolId)}
                activeOpacity={0.8}
                style={[styles.toolTab, isActive && { borderBottomColor: color, borderBottomWidth: 2 }]}
              >
                <View style={[styles.toolTabIcon, { backgroundColor: isActive ? color + '33' : Theme.colors.bg_card }]}>
                  <Ionicons name={TOOL_ICONS[t.id]} size={20} color={isActive ? color : Theme.colors.text_muted} />
                </View>
                <Typography
                  variant="small"
                  style={{ color: isActive ? color : Theme.colors.text_muted, fontWeight: '700', textAlign: 'center', marginTop: 4 }}
                  numberOfLines={2}
                >
                  {t.label}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── ACTIVE TOOL ── */}
        <GlowCard
          glowColor={TOOL_COLORS[activeTool]}
          style={styles.toolCard}
          padding={20}
        >
          <View style={styles.toolHeader}>
            <View style={[styles.toolHeaderIcon, { backgroundColor: TOOL_COLORS[activeTool] + '22' }]}>
              <Ionicons name={TOOL_ICONS[activeTool]} size={22} color={TOOL_COLORS[activeTool]} />
            </View>
            <View style={{ flex: 1 }}>
              <Typography variant="h3" color="primary">
                {tools.find(t => t.id === activeTool)?.label}
              </Typography>
              <Typography variant="small" color="muted">
                {tools.find(t => t.id === activeTool)?.description}
              </Typography>
            </View>
          </View>

          <View style={styles.toolDivider} />

          {activeTool === 'commission_calculator' && <CommissionCalculator />}
          {activeTool === 'goal_projection' && <GoalProjection />}
          {activeTool === 'report_generator' && <ReportGenerator />}
        </GlowCard>

        <View style={{ height: 100 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Theme.colors.bg_deep },
  content: { paddingHorizontal: 16, paddingTop: 16 },

  toolSelector: { flexDirection: 'row', gap: 0, marginBottom: 20 },
  toolTab: { flex: 1, alignItems: 'center', paddingVertical: 8, paddingHorizontal: 4, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  toolTabIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

  toolCard: {},
  toolHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 0 },
  toolHeaderIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  toolDivider: { height: 1, backgroundColor: Theme.colors.divider, marginVertical: 16 },

  calcRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  calcField: { flex: 1 },
  formGroup: { marginBottom: 14 },
  fl: { textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '700', marginBottom: 8 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Theme.colors.bg_input, borderRadius: 10,
    borderWidth: 1, borderColor: Theme.colors.border,
    paddingHorizontal: 12, paddingVertical: 11,
  },
  calcInput: { flex: 1, color: Theme.colors.text_primary, fontSize: 15, fontWeight: '600' },

  resultCard: { marginTop: 4 },
  resultRow: { flexDirection: 'row', gap: 0 },
  resultItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  resultDivider: { width: 1, backgroundColor: Theme.colors.divider },

  trackRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  trackBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  progressTrack: { height: 8, backgroundColor: Theme.colors.border, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4 },

  reportCard: {},
  reportRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  reportIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  formatsRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
  formatBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, backgroundColor: Theme.colors.accent + '22', borderWidth: 1, borderColor: Theme.colors.accent + '44' },
});
