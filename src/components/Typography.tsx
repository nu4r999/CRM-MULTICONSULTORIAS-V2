import { Text, TextStyle, StyleSheet } from 'react-native';
import { Theme } from '../constants/Theme';

type Variant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label' | 'small';
type ColorKey = 'primary' | 'secondary' | 'muted' | 'accent' | 'danger' | 'warning' | 'success';

interface TypographyProps {
  variant?: Variant;
  color?: ColorKey | string;
  children: React.ReactNode;
  style?: TextStyle | TextStyle[] | any;
  numberOfLines?: number;
}

const colorMap: Record<ColorKey, string> = {
  primary:   Theme.colors.text_primary,
  secondary: Theme.colors.text_secondary,
  muted:     Theme.colors.text_muted,
  accent:    Theme.colors.accent,
  danger:    Theme.colors.danger,
  warning:   Theme.colors.warning,
  success:   Theme.colors.primary,
};

export function Typography({ variant = 'body', color = 'primary', children, style, numberOfLines }: TypographyProps) {
  const resolvedColor = colorMap[color as ColorKey] ?? color;
  return (
    <Text
      style={[styles[variant], { color: resolvedColor }, style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  h1:      { fontSize: 28, fontWeight: '700', letterSpacing: -0.5, lineHeight: 34 },
  h2:      { fontSize: 22, fontWeight: '700', letterSpacing: -0.3, lineHeight: 28 },
  h3:      { fontSize: 17, fontWeight: '600', lineHeight: 23 },
  body:    { fontSize: 15, fontWeight: '400', lineHeight: 22 },
  caption: { fontSize: 11, fontWeight: '500', lineHeight: 15 },
  label:   { fontSize: 13, fontWeight: '600', lineHeight: 18 },
  small:   { fontSize: 11, fontWeight: '400', lineHeight: 14 },
});
