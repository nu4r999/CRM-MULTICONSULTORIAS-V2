import { View, StyleSheet, ViewStyle } from 'react-native';
import { Theme } from '../constants/Theme';

interface GlowCardProps {
  children: React.ReactNode;
  glowColor?: string;
  style?: ViewStyle | ViewStyle[];
  padding?: number;
  intensity?: number;
  variant?: 'default' | 'strong' | 'subtle';
}

export function GlowCard({
  children,
  glowColor = Theme.colors.primary,
  style,
  padding = 16,
  intensity = 0.35,
  variant = 'default',
}: GlowCardProps) {
  const borderOpacity = variant === 'strong' ? 'aa' : variant === 'subtle' ? '22' : '44';
  const shadowOpacity = variant === 'strong' ? intensity + 0.2 : variant === 'subtle' ? 0.1 : intensity;

  return (
    <View
      style={[
        styles.base,
        {
          padding,
          borderColor: glowColor + borderOpacity,
          shadowColor: glowColor,
          shadowOpacity,
        },
        style,
      ]}
    >
      {/* Inner top accent line */}
      {variant === 'strong' && (
        <View style={[styles.topAccent, { backgroundColor: glowColor }]} />
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Theme.colors.bg_card,
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  topAccent: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    opacity: 0.7,
  },
});
