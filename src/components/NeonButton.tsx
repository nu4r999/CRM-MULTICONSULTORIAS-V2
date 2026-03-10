import { TouchableOpacity, Text, View, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { Theme } from '../constants/Theme';

interface NeonButtonProps {
  label: string;
  onPress: () => void;
  color?: string;
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function NeonButton({
  label,
  onPress,
  color = Theme.colors.primary,
  variant = 'filled',
  size = 'md',
  icon,
  loading,
  disabled,
  style,
  fullWidth,
}: NeonButtonProps) {
  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 12, borderRadius: 8 },
    md: { paddingVertical: 12, paddingHorizontal: 24, fontSize: 14, borderRadius: 12 },
    lg: { paddingVertical: 16, paddingHorizontal: 32, fontSize: 16, borderRadius: 14 },
  }[size];

  const variantStyles = {
    filled: {
      backgroundColor: color,
      borderColor: color,
      textColor: '#000',
    },
    outlined: {
      backgroundColor: color + '15',
      borderColor: color + '88',
      textColor: color,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: color,
    },
  }[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        styles.base,
        {
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          borderRadius: sizeStyles.borderRadius,
          backgroundColor: variantStyles.backgroundColor,
          borderColor: variantStyles.borderColor,
          shadowColor: color,
          opacity: disabled ? 0.4 : 1,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyles.textColor} />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={[styles.label, { color: variantStyles.textColor, fontSize: sizeStyles.fontSize }]}>
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  fullWidth: { width: '100%' },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: {},
  label: { fontWeight: '700', letterSpacing: 0.5 },
});
