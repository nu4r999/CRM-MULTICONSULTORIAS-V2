import { View, StyleSheet, ViewStyle } from 'react-native';
import { Theme } from '../constants/Theme';
import { Typography } from './Typography';
import { Card } from './Card';
import { Ionicons } from '@expo/vector-icons';

interface KpiWidgetProps {
  label: string;
  displayValue: string;
  isCurrency?: boolean;
  trend?: { display: string; is_positive: boolean | null; direction: string };
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  fullWidth?: boolean;
}

export function KpiWidget({ label, displayValue, trend, iconName, iconColor, fullWidth }: KpiWidgetProps) {
  const trendColor = trend?.is_positive === null
    ? Theme.colors.text_muted
    : trend?.is_positive ? Theme.colors.primary : Theme.colors.danger;

  return (
    <Card style={[styles.container, fullWidth ? styles.fullWidth : {}] as ViewStyle[]} padding="medium">
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: iconColor + '22' }]}>
          <Ionicons name={iconName} size={18} color={iconColor} />
        </View>
        <Typography variant="caption" color="muted" style={styles.label}>{label}</Typography>
      </View>
      <Typography variant="h2" style={[styles.value, { color: iconColor }]}>{displayValue}</Typography>
      {trend && (
        <View style={styles.trendRow}>
          {trend.is_positive !== null && (
            <Ionicons
              name={trend.direction === 'up' ? 'trending-up' : 'trending-down'}
              size={12}
              color={trendColor}
            />
          )}
          <Typography variant="small" style={{ color: trendColor, marginLeft: 2, fontWeight: '700' }}>
            {trend.display} vs mes ant.
          </Typography>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minWidth: '45%', margin: 6 },
  fullWidth: { minWidth: '100%', margin: 6 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  iconWrap: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  label: { textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '700', flex: 1 },
  value: { fontSize: 24, fontWeight: '800', marginBottom: 6 },
  trendRow: { flexDirection: 'row', alignItems: 'center' },
});
