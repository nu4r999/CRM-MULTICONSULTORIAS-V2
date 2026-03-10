import { View, StyleSheet, ViewStyle } from 'react-native';
import { Theme } from '../constants/Theme';
import { Typography } from './Typography';

interface ProgressBarProps {
  percentage: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
  style?: ViewStyle;
}

export function ProgressBar({ percentage, color = Theme.colors.primary, height = 8, showLabel, label, style }: ProgressBarProps) {
  const pct = Math.min(Math.max(percentage, 0), 100);

  return (
    <View style={style}>
      {(showLabel || label) && (
        <View style={styles.labelRow}>
          {label && <Typography variant="caption" color="secondary">{label}</Typography>}
          {showLabel && <Typography variant="caption" style={{ color, fontWeight: '700' }}>{Math.round(pct)}%</Typography>}
        </View>
      )}
      <View style={[styles.track, { height, borderRadius: height / 2 }]}>
        <View
          style={{
            width: `${pct}%`,
            height,
            borderRadius: height / 2,
            backgroundColor: color,
            shadowColor: color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 6,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  track: { backgroundColor: Theme.colors.border, width: '100%', overflow: 'hidden' },
});
