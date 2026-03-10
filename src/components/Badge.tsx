import { View, StyleSheet, ViewStyle } from 'react-native';
import { Theme } from '../constants/Theme';
import { Typography } from './Typography';

interface BadgeProps {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function Badge({ label, color = Theme.colors.primary, size = 'md', style }: BadgeProps) {
  return (
    <View style={[
      styles.base,
      size === 'sm' ? styles.sm : styles.md,
      { backgroundColor: color + '22', borderColor: color + '55' },
      style,
    ]}>
      <Typography
        variant="small"
        style={{ color, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4, fontSize: size === 'sm' ? 9 : 10 }}
      >
        {label}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 999, borderWidth: 1, alignSelf: 'flex-start' },
  sm: { paddingHorizontal: 7, paddingVertical: 2 },
  md: { paddingHorizontal: 10, paddingVertical: 4 },
});
