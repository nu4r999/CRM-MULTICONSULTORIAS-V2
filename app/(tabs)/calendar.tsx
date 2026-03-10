import React, { useState } from 'react';
import {
  StyleSheet, View, ScrollView, TouchableOpacity,
  Modal, Pressable, TextInput, Switch,
} from 'react-native';
import { Theme } from '../../src/constants/Theme';
import { APP_SCHEMA } from '../../src/data/schema';
import { useApp } from '../../src/context/AppContext';
import { GlowCard } from '../../src/components/GlowCard';
import { Typography } from '../../src/components/Typography';
import { NeonButton } from '../../src/components/NeonButton';
import { Badge } from '../../src/components/Badge';
import { Ionicons } from '@expo/vector-icons';

const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const DAYS_FULL = ['lun','mar','mié','jue','vie','sáb','dom'];

const EVENT_TYPES = APP_SCHEMA.modules.calendar.event_types;
const EVENT_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  call: 'call', task: 'checkmark-circle', meeting: 'people', reminder: 'notifications',
};

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y: number, m: number) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }
function fmt(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}

export default function CalendarScreen() {
  const { state, addEvent, toggleEventComplete } = useApp();
  const cal = APP_SCHEMA.modules.calendar;

  const now = new Date();
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(2);
  const [selected, setSelected] = useState('2026-03-09');
  const [showAdd, setShowAdd] = useState(false);

  const [form, setForm] = useState({
    title: '', type: 'call', time_start: '', description: '', all_day: false
  });

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);
  const cells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const byDate = state.events.reduce((acc: any, ev) => {
    if (!acc[ev.date]) acc[ev.date] = [];
    acc[ev.date].push(ev);
    return acc;
  }, {});

  const selectedEvents = byDate[selected] ?? [];

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1);
  }

  function handleAddEvent() {
    if (!form.title.trim()) return;
    const evType = EVENT_TYPES.find(t => t.id === form.type)!;
    addEvent({
      title: form.title.trim(),
      type: form.type as any,
      date: selected,
      time_start: form.all_day ? null : (form.time_start || null),
      time_end: null, all_day: form.all_day,
      color: evType.default_color,
      client_id: null,
      description: form.description || null,
      completed: false,
      reminder: { enabled: false, minutes_before: null },
    });
    setForm({ title: '', type: 'call', time_start: '', description: '', all_day: false });
    setShowAdd(false);
  }

  const stats = [
    { label: 'Vencidas', value: cal.stats.overdue, color: Theme.colors.danger },
    { label: 'Pendientes', value: state.events.filter(e => !e.completed).length, color: Theme.colors.warning },
    { label: 'Recordatorios', value: cal.stats.reminders, color: Theme.colors.accent },
    { label: 'Total Eventos', value: state.events.length, color: Theme.colors.secondary },
  ];

  return (
    <View style={styles.root}>
      {/* ADD EVENT MODAL */}
      <Modal transparent visible={showAdd} animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setShowAdd(false)} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Typography variant="h3" color="primary" style={{ marginBottom: 20 }}>
            Nuevo Evento — {selected.split('-').reverse().join('/')}
          </Typography>

          <View style={styles.fg}>
            <Typography variant="caption" color="muted" style={styles.fl}>TÍTULO</Typography>
            <TextInput style={styles.input} placeholder="Ej: Llamada Davivienda"
              placeholderTextColor={Theme.colors.text_muted}
              value={form.title} onChangeText={v => setForm(p => ({ ...p, title: v }))} />
          </View>

          <View style={styles.fg}>
            <Typography variant="caption" color="muted" style={styles.fl}>TIPO</Typography>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {EVENT_TYPES.map(t => (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => setForm(p => ({ ...p, type: t.id }))}
                  style={[styles.typeChip, form.type === t.id && { borderColor: t.default_color, backgroundColor: t.default_color + '22' }]}
                >
                  <Ionicons name={EVENT_ICONS[t.id]} size={13} color={form.type === t.id ? t.default_color : Theme.colors.text_muted} />
                  <Typography variant="caption" style={{ color: form.type === t.id ? t.default_color : Theme.colors.text_muted, fontWeight: '700' }}>
                    {t.label}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.fg, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <Typography variant="caption" color="muted" style={styles.fl}>TODO EL DÍA</Typography>
            <Switch
              value={form.all_day}
              onValueChange={v => setForm(p => ({ ...p, all_day: v }))}
              trackColor={{ true: Theme.colors.primary }}
              thumbColor={form.all_day ? '#000' : Theme.colors.text_muted}
            />
          </View>

          {!form.all_day && (
            <View style={styles.fg}>
              <Typography variant="caption" color="muted" style={styles.fl}>HORA (HH:MM)</Typography>
              <TextInput style={styles.input} placeholder="Ej: 10:30"
                placeholderTextColor={Theme.colors.text_muted}
                value={form.time_start} onChangeText={v => setForm(p => ({ ...p, time_start: v }))}
                keyboardType="numbers-and-punctuation" />
            </View>
          )}

          <View style={styles.fg}>
            <Typography variant="caption" color="muted" style={styles.fl}>DESCRIPCIÓN (opcional)</Typography>
            <TextInput style={[styles.input, { minHeight: 60 }]} placeholder="Ej: Seguimiento crédito..."
              placeholderTextColor={Theme.colors.text_muted} multiline
              value={form.description} onChangeText={v => setForm(p => ({ ...p, description: v }))} />
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <NeonButton label="Cancelar" onPress={() => setShowAdd(false)} variant="outlined" color={Theme.colors.text_muted} style={{ flex: 1 }} />
            <NeonButton label="Crear Evento" onPress={handleAddEvent} color={Theme.colors.primary} style={{ flex: 1 }} />
          </View>
        </View>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* STATS */}
        <View style={styles.statsRow}>
          {stats.map(s => (
            <GlowCard key={s.label} glowColor={s.color} style={styles.statCard} padding={10} variant="subtle">
              <Typography variant="h3" style={{ color: s.color, fontWeight: '800', textAlign: 'center' }}>{s.value}</Typography>
              <Typography variant="small" color="muted" style={{ textAlign: 'center' }}>{s.label}</Typography>
            </GlowCard>
          ))}
        </View>

        {/* CALENDAR HEADER */}
        <GlowCard glowColor={Theme.colors.secondary} style={styles.calCard} padding={16}>
          <View style={styles.calHeader}>
            <TouchableOpacity onPress={prevMonth} style={styles.navBtn} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={20} color={Theme.colors.primary} />
            </TouchableOpacity>
            <Typography variant="h3" style={{ color: Theme.colors.primary, fontWeight: '700' }}>
              {MONTHS[month]} {year}
            </Typography>
            <TouchableOpacity onPress={nextMonth} style={styles.navBtn} activeOpacity={0.7}>
              <Ionicons name="chevron-forward" size={20} color={Theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Day headers */}
          <View style={styles.dayHeaders}>
            {DAYS_FULL.map(d => (
              <Typography key={d} variant="small" color="muted" style={styles.dayH}>{d}</Typography>
            ))}
          </View>

          {/* Grid */}
          <View style={styles.grid}>
            {Array.from({ length: cells }).map((_, i) => {
              const dayNum = i - firstDay + 1;
              const valid = dayNum >= 1 && dayNum <= daysInMonth;
              const dateStr = valid ? fmt(year, month, dayNum) : '';
              const todayStr = fmt(now.getFullYear(), now.getMonth(), now.getDate());
              const isToday = dateStr === todayStr;
              const isSel = dateStr === selected;
              const evs = dateStr ? (byDate[dateStr] ?? []) : [];

              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.cell,
                    isSel && { backgroundColor: Theme.colors.primary, borderRadius: 10 },
                    isToday && !isSel && { borderWidth: 1, borderColor: Theme.colors.primary, borderRadius: 10 },
                  ]}
                  onPress={() => valid && setSelected(dateStr)}
                  disabled={!valid}
                  activeOpacity={0.7}
                >
                  {valid && (
                    <>
                      <Typography
                        variant="label"
                        style={{ color: isSel ? '#000' : isToday ? Theme.colors.primary : Theme.colors.text_primary, fontWeight: isSel || isToday ? '800' : '400', fontSize: 13 }}
                      >
                        {dayNum}
                      </Typography>
                      <View style={styles.evDots}>
                        {evs.slice(0, 3).map((ev: any, idx: number) => (
                          <View key={idx} style={[styles.evDot, { backgroundColor: ev.color }]} />
                        ))}
                      </View>
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </GlowCard>

        {/* SELECTED DAY EVENTS */}
        <View style={styles.evSection}>
          <View style={styles.evHeader}>
            <View style={[styles.accentBar, { backgroundColor: Theme.colors.primary }]} />
            <Typography variant="label" color="secondary">
              {selected.split('-').reverse().join('/')} — {selectedEvents.length} evento{selectedEvents.length !== 1 ? 's' : ''}
            </Typography>
          </View>

          {selectedEvents.length === 0 ? (
            <GlowCard glowColor={Theme.colors.border} style={{ padding: 24 }} padding={24}>
              <View style={{ alignItems: 'center' }}>
                <Ionicons name="calendar-outline" size={36} color={Theme.colors.text_muted} />
                <Typography variant="body" color="muted" style={{ marginTop: 8 }}>Sin eventos este día</Typography>
                <NeonButton label="+ Crear Evento" onPress={() => setShowAdd(true)} variant="outlined" color={Theme.colors.primary} size="sm" style={{ marginTop: 12 }} />
              </View>
            </GlowCard>
          ) : (
            selectedEvents.map((ev: any) => (
              <GlowCard key={ev.id} glowColor={ev.color} style={styles.evCard} padding={14} variant="subtle">
                <View style={styles.evRow}>
                  <View style={[styles.evIcon, { backgroundColor: ev.color + '33' }]}>
                    <Ionicons name={EVENT_ICONS[ev.type] ?? 'calendar'} size={18} color={ev.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Typography
                      variant="label"
                      style={{ color: ev.completed ? Theme.colors.text_muted : Theme.colors.text_primary, textDecorationLine: ev.completed ? 'line-through' : 'none' }}
                    >
                      {ev.title}
                    </Typography>
                    {ev.time_start && <Typography variant="small" color="muted">{ev.time_start}{ev.time_end ? ` → ${ev.time_end}` : ''}</Typography>}
                    {ev.all_day && <Typography variant="small" color="muted">Todo el día</Typography>}
                    {ev.description && <Typography variant="small" color="muted" style={{ marginTop: 2 }}>{ev.description}</Typography>}
                  </View>
                  <TouchableOpacity onPress={() => toggleEventComplete(ev.id)} activeOpacity={0.7}
                    style={[styles.completeBtn, ev.completed && { backgroundColor: Theme.colors.primary + '33', borderColor: Theme.colors.primary }]}>
                    <Ionicons name={ev.completed ? 'checkmark' : 'ellipse-outline'} size={16} color={ev.completed ? Theme.colors.primary : Theme.colors.text_muted} />
                  </TouchableOpacity>
                </View>
              </GlowCard>
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setShowAdd(true)} activeOpacity={0.8}>
        <Ionicons name="add" size={28} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Theme.colors.bg_deep },
  content: { paddingHorizontal: 16, paddingTop: 16 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statCard: { flex: 1 },
  calCard: { marginBottom: 20 },
  calHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  navBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Theme.colors.bg_surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Theme.colors.border },
  dayHeaders: { flexDirection: 'row', marginBottom: 8 },
  dayH: { width: `${100/7}%`, textAlign: 'center', textTransform: 'uppercase', fontSize: 10, letterSpacing: 0.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100/7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', padding: 2 },
  evDots: { flexDirection: 'row', gap: 2, marginTop: 1 },
  evDot: { width: 4, height: 4, borderRadius: 2 },
  evSection: { marginBottom: 16 },
  evHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  accentBar: { width: 3, height: 18, borderRadius: 2 },
  evCard: { marginBottom: 8 },
  evRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  evIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  completeBtn: { width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: Theme.colors.border, alignItems: 'center', justifyContent: 'center' },
  fab: {
    position: 'absolute', bottom: 88, right: 20,
    width: 56, height: 56, borderRadius: 28, backgroundColor: Theme.colors.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Theme.colors.primary, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7, shadowRadius: 16, elevation: 14,
  },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#00000088' },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Theme.colors.bg_surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40,
    borderWidth: 1, borderColor: Theme.colors.border,
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Theme.colors.border, alignSelf: 'center', marginBottom: 20 },
  fg: { marginBottom: 16 },
  fl: { textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '700', marginBottom: 8 },
  input: { backgroundColor: Theme.colors.bg_input, borderRadius: 10, borderWidth: 1, borderColor: Theme.colors.border, color: Theme.colors.text_primary, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14 },
  typeChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: Theme.colors.border, backgroundColor: Theme.colors.bg_card },
});
