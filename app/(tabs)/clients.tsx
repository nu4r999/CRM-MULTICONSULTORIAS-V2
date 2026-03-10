import React, { useState } from 'react';
import {
  StyleSheet, View, FlatList, TouchableOpacity,
  TextInput, Modal, Pressable, ScrollView, Alert,
} from 'react-native';
import { Theme } from '../../src/constants/Theme';
import { APP_SCHEMA } from '../../src/data/schema';
import { useApp } from '../../src/context/AppContext';
import { GlowCard } from '../../src/components/GlowCard';
import { Typography } from '../../src/components/Typography';
import { NeonButton } from '../../src/components/NeonButton';
import { Badge } from '../../src/components/Badge';
import { Ionicons } from '@expo/vector-icons';

const STAGES = APP_SCHEMA.modules.clients.pipeline_stages;

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <View style={[styles.avatar, { backgroundColor: color + '22', borderColor: color + '55' }]}>
      <Typography variant="label" style={{ color, fontWeight: '800', fontSize: 15 }}>{initials}</Typography>
    </View>
  );
}

export default function ClientsScreen() {
  const { state, addClient, updateClientStage, updateClientNotes, addSale, deleteClient } = useApp();
  const stageMap = Object.fromEntries(STAGES.map(s => [s.id, s]));

  const [search, setSearch] = useState('');
  const [activeStage, setActiveStage] = useState('todos');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [editNotes, setEditNotes] = useState('');

  // Sale form state
  const [saleForm, setSaleForm] = useState({ amount: '', commission: '' });

  // Form state
  const [form, setForm] = useState({ name: '', phone: '', referred_by: '', stage_id: 'nuevo_cliente' });

  const filtered = state.clients.filter(c => {
    const matchSearch = search === '' ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone ?? '').includes(search);
    const matchStage = activeStage === 'todos' || c.stage_id === activeStage;
    return matchSearch && matchStage;
  });

  const totalVentas = filtered.reduce((a, c) => a + c.total_sales, 0);
  const totalGanancias = filtered.reduce((a, c) => a + c.total_profit, 0);

  function handleAddClient() {
    if (!form.name.trim()) { Alert.alert('Error', 'El nombre es requerido'); return; }
    addClient({
      name: form.name.trim(),
      initials: form.name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      phone: form.phone || null,
      email: null,
      referred_by: form.referred_by || null,
      stage_id: form.stage_id,
      total_sales: 0, display_sales: '0',
      total_profit: 0, display_profit: '0',
      notes: null,
    });
    setForm({ name: '', phone: '', referred_by: '', stage_id: 'nuevo_cliente' });
    setShowAddModal(false);
  }

  function handleChangeStage(stageId: string) {
    if (selectedClient) {
      updateClientStage(selectedClient.id, stageId);
      setShowStageModal(false);
      setSelectedClient(null);
    }
  }

  function openStageChange(client: any) {
    setSelectedClient(client);
    setShowStageModal(true);
  }

  function openClientDetails(client: any) {
    setSelectedClient(client);
    setEditNotes(client.notes || '');
    setShowDetailsModal(true);
  }

  function handleSaveNotes() {
    if (selectedClient) {
      updateClientNotes(selectedClient.id, editNotes);
      setSelectedClient({ ...selectedClient, notes: editNotes });
      Alert.alert('Éxito', 'Notas actualizadas');
    }
  }

  function handleAddSale() {
    if (!selectedClient) return;
    const amount = parseFloat(saleForm.amount.replace(/[^0-9]/g, '')) || 0;
    const commission = parseFloat(saleForm.commission.replace(/[^0-9]/g, '')) || 0;
    if (amount <= 0) { Alert.alert('Error', 'El monto debe ser mayor a 0'); return; }
    addSale(selectedClient.id, amount, commission);
    setSaleForm({ amount: '', commission: '' });
    setShowSaleModal(false);
    Alert.alert('✅ Venta Registrada', `$${(amount/1e6).toFixed(2)}M agregados a ${selectedClient.name}`);
  }

  function handleDeleteClient() {
    if (!selectedClient) return;
    Alert.alert(
      'Eliminar Cliente',
      `¿Eliminar a ${selectedClient.name}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar', style: 'destructive',
          onPress: () => {
            deleteClient(selectedClient.id);
            setShowDetailsModal(false);
            setSelectedClient(null);
          },
        },
      ]
    );
  }

  return (
    <View style={styles.root}>

      {/* ── ADD CLIENT MODAL ── */}
      <Modal transparent visible={showAddModal} animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setShowAddModal(false)} />
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Typography variant="h3" color="primary" style={styles.modalTitle}>Nuevo Cliente</Typography>

          {[
            { key: 'name', label: 'Nombre completo *', placeholder: 'Ej: María López', keyboard: 'default' },
            { key: 'phone', label: 'Teléfono', placeholder: 'Ej: 3001234567', keyboard: 'phone-pad' },
            { key: 'referred_by', label: 'Referido por', placeholder: 'Ej: Esteban', keyboard: 'default' },
          ].map(f => (
            <View key={f.key} style={styles.formGroup}>
              <Typography variant="caption" color="muted" style={styles.formLabel}>{f.label}</Typography>
              <TextInput
                style={styles.input}
                placeholder={f.placeholder}
                placeholderTextColor={Theme.colors.text_muted}
                value={form[f.key as keyof typeof form]}
                onChangeText={v => setForm(prev => ({ ...prev, [f.key]: v }))}
                keyboardType={f.keyboard as any}
              />
            </View>
          ))}

          <View style={styles.formGroup}>
            <Typography variant="caption" color="muted" style={styles.formLabel}>Estado inicial</Typography>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {STAGES.slice(0, 4).map(s => (
                  <TouchableOpacity
                    key={s.id}
                    onPress={() => setForm(prev => ({ ...prev, stage_id: s.id }))}
                    style={[styles.stageChipSm, form.stage_id === s.id && { borderColor: s.color, backgroundColor: s.color + '22' }]}
                  >
                    <Typography variant="small" style={{ color: form.stage_id === s.id ? s.color : Theme.colors.text_muted, fontWeight: '700' }}>
                      {s.label}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
            <NeonButton label="Cancelar" onPress={() => setShowAddModal(false)} variant="outlined" color={Theme.colors.text_muted} style={{ flex: 1 }} />
            <NeonButton label="Guardar" onPress={handleAddClient} color={Theme.colors.primary} style={{ flex: 1 }} />
          </View>
        </View>
      </Modal>

      {/* ── STAGE CHANGE MODAL ── */}
      <Modal transparent visible={showStageModal} animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setShowStageModal(false)} />
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Typography variant="h3" color="primary" style={styles.modalTitle}>
            Cambiar Estado — {selectedClient?.name}
          </Typography>
          {STAGES.map(s => (
            <TouchableOpacity
              key={s.id}
              onPress={() => handleChangeStage(s.id)}
              style={[styles.stageRow, selectedClient?.stage_id === s.id && { backgroundColor: s.color + '22', borderColor: s.color }]}
              activeOpacity={0.75}
            >
              <View style={[styles.stageDot, { backgroundColor: s.color }]} />
              <Typography variant="label" style={{ color: selectedClient?.stage_id === s.id ? s.color : Theme.colors.text_primary }}>
                {s.label}
              </Typography>
              {selectedClient?.stage_id === s.id && (
                <Ionicons name="checkmark-circle" size={18} color={s.color} style={{ marginLeft: 'auto' }} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

      {/* ── CLIENT DETAILS MODAL ── */}
      <Modal transparent visible={showDetailsModal} animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setShowDetailsModal(false)} />
        <View style={[styles.modalSheet, { height: '85%' }]}>
          <View style={styles.modalHandle} />
          {selectedClient && (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <View style={{ flex: 1 }}>
                  <Typography variant="h2" color="primary">{selectedClient.name}</Typography>
                  <Typography variant="small" color="muted" style={{ marginTop: 2 }}>
                    Registrado: {new Date(selectedClient.created_at).toLocaleDateString()}
                  </Typography>
                </View>
                <TouchableOpacity onPress={() => setShowDetailsModal(false)} style={{ padding: 4 }}>
                  <Ionicons name="close-circle" size={28} color={Theme.colors.text_muted} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
                  <GlowCard glowColor={Theme.colors.secondary} style={{ flex: 1, minWidth: '45%' }} padding={14} variant="subtle">
                    <Typography variant="caption" color="muted">TELÉFONO</Typography>
                    <Typography variant="label" style={{ marginTop: 6, fontSize: 16 }}>{selectedClient.phone || 'N/A'}</Typography>
                  </GlowCard>
                  <GlowCard glowColor={Theme.colors.accent} style={{ flex: 1, minWidth: '45%' }} padding={14} variant="subtle">
                    <Typography variant="caption" color="muted">ESTADO</Typography>
                    <Typography variant="label" style={{ marginTop: 6, fontSize: 16 }}>
                      {stageMap[selectedClient.stage_id]?.label || selectedClient.stage_id}
                    </Typography>
                  </GlowCard>
                  <GlowCard glowColor={Theme.colors.primary} style={{ flex: 1, minWidth: '45%' }} padding={14} variant="subtle">
                    <Typography variant="caption" color="muted">VENTAS TOTALES</Typography>
                    <Typography variant="label" style={{ marginTop: 6, fontSize: 16, color: Theme.colors.primary }}>${selectedClient.display_sales}</Typography>
                  </GlowCard>
                  <GlowCard glowColor={Theme.colors.bg_surface} style={{ flex: 1, minWidth: '45%', borderWidth: 1, borderColor: Theme.colors.border }} padding={14} variant="subtle">
                    <Typography variant="caption" color="muted">REFERIDO POR</Typography>
                    <Typography variant="label" style={{ marginTop: 6, fontSize: 16 }}>{selectedClient.referred_by || 'N/A'}</Typography>
                  </GlowCard>
                </View>

                <View style={styles.formGroup}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Ionicons name="document-text" size={18} color={Theme.colors.primary} />
                    <Typography variant="h3" color="primary">Notas y Seguimiento</Typography>
                  </View>
                  <TextInput
                    style={[styles.input, { height: 160, textAlignVertical: 'top', fontSize: 15 }]}
                    placeholder="Escribe aquí los apuntes, historial de llamadas o requerimientos del cliente..."
                    placeholderTextColor={Theme.colors.text_muted}
                    multiline
                    value={editNotes}
                    onChangeText={setEditNotes}
                  />
                  <NeonButton 
                    label="Guardar Notas" 
                    onPress={handleSaveNotes} 
                    color={Theme.colors.primary} 
                    style={{ marginTop: 16 }} 
                  />
                </View>

                {/* ACCIONES DEL CLIENTE */}
                <View style={styles.formGroup}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Ionicons name="flash" size={18} color={Theme.colors.accent} />
                    <Typography variant="h3" color="accent">Acciones Rápidas</Typography>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <NeonButton 
                      label="Registrar Venta" 
                      onPress={() => setShowSaleModal(true)} 
                      color={Theme.colors.secondary} 
                      style={{ flex: 1 }} 
                    />
                    <NeonButton 
                      label="Eliminar" 
                      onPress={handleDeleteClient} 
                      color={Theme.colors.danger} 
                      variant="outlined"
                      style={{ flex: 1 }} 
                    />
                  </View>
                </View>
              </ScrollView>
            </>
          )}
        </View>
      </Modal>

      {/* ── REGISTER SALE MODAL ── */}
      <Modal transparent visible={showSaleModal} animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setShowSaleModal(false)} />
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Typography variant="h3" color="secondary" style={styles.modalTitle}>
            Registrar Venta — {selectedClient?.name}
          </Typography>

          <View style={styles.formGroup}>
            <Typography variant="caption" color="muted" style={styles.formLabel}>Monto Total (COP) *</Typography>
            <TextInput
              style={styles.input}
              placeholder="Ej: 50000000"
              placeholderTextColor={Theme.colors.text_muted}
              value={saleForm.amount}
              onChangeText={v => setSaleForm(prev => ({ ...prev, amount: v }))}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Typography variant="caption" color="muted" style={styles.formLabel}>Comisión Ganada (COP) *</Typography>
            <TextInput
              style={styles.input}
              placeholder="Ej: 1500000"
              placeholderTextColor={Theme.colors.text_muted}
              value={saleForm.commission}
              onChangeText={v => setSaleForm(prev => ({ ...prev, commission: v }))}
              keyboardType="numeric"
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
            <NeonButton label="Cancelar" onPress={() => setShowSaleModal(false)} variant="outlined" color={Theme.colors.text_muted} style={{ flex: 1 }} />
            <NeonButton label="Registrar" onPress={handleAddSale} color={Theme.colors.secondary} style={{ flex: 1 }} />
          </View>
        </View>
      </Modal>

      {/* ── SEARCH & TOTALS ── */}
      <View style={styles.topSection}>
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={16} color={Theme.colors.text_muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar cliente o teléfono..."
            placeholderTextColor={Theme.colors.text_muted}
            value={search}
            onChangeText={setSearch}
          />
          {search !== '' && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={16} color={Theme.colors.text_muted} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.totalsRow}>
          {[
            { label: 'CLIENTES', value: filtered.length.toString(), color: Theme.colors.primary },
            { label: 'VENTAS', value: `$${(totalVentas / 1e6).toFixed(1)}M`, color: Theme.colors.secondary },
            { label: 'GANANCIAS', value: `$${(totalGanancias / 1e6).toFixed(1)}M`, color: Theme.colors.accent },
          ].map(item => (
            <GlowCard key={item.label} glowColor={item.color} style={styles.totalCard} padding={10} variant="subtle">
              <Typography variant="small" color="muted" style={styles.totalLabel}>{item.label}</Typography>
              <Typography variant="h3" style={{ color: item.color, fontWeight: '800' }}>{item.value}</Typography>
            </GlowCard>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stageFilters}>
          <TouchableOpacity
            onPress={() => setActiveStage('todos')}
            style={[styles.stageChip, activeStage === 'todos' && styles.stageChipActiveAll]}
          >
            <Typography variant="caption" style={{ color: activeStage === 'todos' ? Theme.colors.primary : Theme.colors.text_muted, fontWeight: '700' }}>
              Todos
            </Typography>
          </TouchableOpacity>
          {STAGES.map(s => {
            const count = state.clients.filter(c => c.stage_id === s.id).length;
            if (count === 0) return null;
            const isActive = activeStage === s.id;
            return (
              <TouchableOpacity
                key={s.id}
                onPress={() => setActiveStage(s.id)}
                style={[styles.stageChip, isActive && { borderColor: s.color + '99', backgroundColor: s.color + '18' }]}
              >
                <View style={[styles.stageDot, { backgroundColor: s.color }]} />
                <Typography variant="caption" style={{ color: isActive ? s.color : Theme.colors.text_muted, fontWeight: '700' }}>
                  {s.label} ({count})
                </Typography>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── LIST ── */}
      <FlatList
        data={filtered}
        keyExtractor={c => c.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const stage = stageMap[item.stage_id] ?? { color: Theme.colors.text_muted, label: item.stage_id };
          return (
            <GlowCard glowColor={stage.color} style={styles.clientCard} padding={0} variant="subtle">
              <View style={[styles.stageAccent, { backgroundColor: stage.color }]} />
              <View style={styles.clientInner}>
                <View style={styles.clientTop}>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }} onPress={() => openClientDetails(item)} activeOpacity={0.8}>
                    <Avatar initials={item.initials} color={stage.color} />
                    <View style={{ flex: 1 }}>
                      <Typography variant="h3" color="primary">{item.name}</Typography>
                      {item.phone && (
                        <View style={styles.infoRow}>
                          <Ionicons name="call-outline" size={11} color={Theme.colors.text_muted} />
                          <Typography variant="small" color="muted">{item.phone}</Typography>
                        </View>
                      )}
                      {item.referred_by && (
                        <View style={styles.infoRow}>
                          <Ionicons name="arrow-redo-outline" size={11} color={Theme.colors.text_muted} />
                          <Typography variant="small" color="muted">Ref: {item.referred_by}</Typography>
                        </View>
                      )}
                      {item.notes && (
                        <View style={styles.infoRow}>
                          <Ionicons name="document-text-outline" size={11} color={Theme.colors.accent} />
                          <Typography variant="small" style={{ color: Theme.colors.accent }}>Con notas</Typography>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openStageChange(item)} activeOpacity={0.8} style={{ paddingLeft: 8 }}>
                    <Badge label={stage.label} color={stage.color} size="sm" />
                  </TouchableOpacity>
                </View>

                {item.total_sales > 0 && (
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Typography variant="small" color="muted">Ventas</Typography>
                      <Typography variant="label" style={{ color: Theme.colors.secondary, fontWeight: '700' }}>
                        ${item.display_sales}
                      </Typography>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Typography variant="small" color="muted">Ganancia</Typography>
                      <Typography variant="label" style={{ color: Theme.colors.primary, fontWeight: '700' }}>
                        ${item.display_profit}
                      </Typography>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Typography variant="small" color="muted">Margen</Typography>
                      <Typography variant="label" style={{ color: Theme.colors.accent, fontWeight: '700' }}>
                        {item.total_sales > 0 ? ((item.total_profit / item.total_sales) * 100).toFixed(1) : 0}%
                      </Typography>
                    </View>
                  </View>
                )}
              </View>
            </GlowCard>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={48} color={Theme.colors.text_muted} />
            <Typography variant="body" color="muted" style={{ marginTop: 12 }}>Sin clientes</Typography>
          </View>
        }
        ListFooterComponent={<View style={{ height: 110 }} />}
      />

      {/* ── FAB ── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="person-add" size={22} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Theme.colors.bg_deep },
  topSection: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Theme.colors.bg_card,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11,
    borderWidth: 1, borderColor: Theme.colors.border, marginBottom: 12,
  },
  searchInput: { flex: 1, color: Theme.colors.text_primary, fontSize: 14 },

  totalsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  totalCard: { flex: 1 },
  totalLabel: { textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2, fontWeight: '700' },

  stageFilters: { flexDirection: 'row', gap: 8, paddingBottom: 4 },
  stageChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 999, borderWidth: 1, borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.bg_card,
  },
  stageChipActiveAll: { borderColor: Theme.colors.primary + '99', backgroundColor: Theme.colors.primary + '18' },
  stageChipSm: {
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 999, borderWidth: 1, borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.bg_card,
  },
  stageDot: { width: 6, height: 6, borderRadius: 3 },
  stageRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 13, paddingHorizontal: 14,
    borderRadius: 12, marginBottom: 6,
    borderWidth: 1, borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.bg_card,
  },

  list: { paddingHorizontal: 16, paddingTop: 8 },
  clientCard: { marginBottom: 10, flexDirection: 'row', overflow: 'hidden', borderRadius: 16 },
  stageAccent: { width: 4 },
  clientInner: { flex: 1, padding: 14 },
  clientTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  statsRow: {
    flexDirection: 'row', marginTop: 12, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: Theme.colors.divider,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: Theme.colors.divider, marginVertical: 4 },

  empty: { alignItems: 'center', paddingTop: 60 },

  fab: {
    position: 'absolute', bottom: 88, right: 20,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7, shadowRadius: 16, elevation: 14,
  },

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#00000088' },
  modalSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Theme.colors.bg_surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40,
    borderWidth: 1, borderColor: Theme.colors.border,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Theme.colors.border, alignSelf: 'center', marginBottom: 20,
  },
  modalTitle: { marginBottom: 20 },
  formGroup: { marginBottom: 16 },
  formLabel: { textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '700', marginBottom: 6 },
  input: {
    backgroundColor: Theme.colors.bg_input,
    borderRadius: 10, borderWidth: 1, borderColor: Theme.colors.border,
    color: Theme.colors.text_primary, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14,
  },
});
