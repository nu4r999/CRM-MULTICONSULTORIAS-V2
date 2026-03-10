import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { Theme } from '../../src/constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../src/components/Typography';

type TabConfig = {
  name: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
  color: string;
  badge?: number;
};

const TABS: TabConfig[] = [
  { name: 'dashboard',  title: 'Inicio',     icon: 'grid-outline',       iconFocused: 'grid',             color: Theme.colors.primary },
  { name: 'clients',    title: 'Clientes',   icon: 'people-outline',     iconFocused: 'people',           color: Theme.colors.secondary },
  { name: 'calendar',   title: 'Calendario', icon: 'calendar-outline',   iconFocused: 'calendar',         color: Theme.colors.accent, badge: 5 },
  { name: 'goals',      title: 'Metas',      icon: 'trophy-outline',     iconFocused: 'trophy',           color: Theme.colors.purple },
  { name: 'analytics',  title: 'Analítica',  icon: 'stats-chart-outline',iconFocused: 'stats-chart',      color: Theme.colors.secondary },
  { name: 'tools',      title: 'Herram.',    icon: 'construct-outline',  iconFocused: 'construct',        color: Theme.colors.accent },
  { name: 'activity',   title: 'Actividad',  icon: 'time-outline',       iconFocused: 'time',             color: Theme.colors.primary, badge: 3 },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: Theme.colors.bg_surface,
          borderBottomColor: Theme.colors.border,
          borderBottomWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: Theme.colors.text_primary,
          fontWeight: '700',
          fontSize: 16,
          letterSpacing: 0.5,
        },
        headerTintColor: Theme.colors.text_primary,
        headerLeft: () => (
          <View style={styles.headerBrand}>
            <View style={styles.headerLogo}>
              <Typography style={{ color: Theme.colors.primary, fontWeight: '900', fontSize: 11 }}>MC</Typography>
            </View>
          </View>
        ),
        tabBarStyle: {
          backgroundColor: Theme.colors.bg_surface,
          borderTopColor: Theme.colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 26 : 8,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: Theme.colors.text_muted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', letterSpacing: 0.3 },
      }}
    >
      {TABS.map(tab => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            headerTitle: `MULTICONSULTORIAS · ${tab.title.toUpperCase()}`,
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconWrap}>
                {focused && <View style={[styles.iconGlow, { backgroundColor: tab.color + '22' }]} />}
                <Ionicons
                  name={focused ? tab.iconFocused : tab.icon}
                  size={22}
                  color={focused ? tab.color : color}
                />
                {tab.badge && (
                  <View style={styles.badge}>
                    <Typography style={{ color: '#000', fontSize: 8, fontWeight: '800' }}>{tab.badge}</Typography>
                  </View>
                )}
              </View>
            ),
          }}
        />
      ))}
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerBrand: { paddingLeft: 16 },
  headerLogo: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: Theme.colors.primary + '22',
    borderWidth: 1, borderColor: Theme.colors.primary + '66',
    alignItems: 'center', justifyContent: 'center',
  },
  iconWrap: { alignItems: 'center', justifyContent: 'center', width: 34, height: 34 },
  iconGlow: { position: 'absolute', width: 34, height: 34, borderRadius: 10 },
  badge: {
    position: 'absolute', top: -2, right: -2,
    backgroundColor: Theme.colors.danger,
    minWidth: 14, height: 14, borderRadius: 7,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2,
  },
});
