import { View, StyleSheet, ViewStyle } from 'react-native';
import { Theme } from '../constants/Theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  padding?: 'small' | 'medium' | 'large' | 'none';
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ children, style, padding = 'medium', variant = 'default' }: CardProps) {
  return (
    <View style={[
      styles.base,
      styles[`padding_${padding}` as keyof typeof styles] as any,
      variant === 'elevated' && styles.elevated,
      variant === 'outlined' && styles.outlined,
      style,
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Theme.colors.bg_card,
    borderRadius: Theme.borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 5,
  },
  padding_none:   { padding: 0 },
  padding_small:  { padding: 10 },
  padding_medium: { padding: 16 },
  padding_large:  { padding: 24 },
  elevated: {
    backgroundColor: Theme.colors.bg_surface,
    shadowOpacity: 0.5,
    shadowRadius: 32,
    elevation: 10,
  },
  outlined: { borderWidth: 1, borderColor: Theme.colors.border },
});
