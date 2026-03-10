import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Theme } from '../constants/Theme';
import { Typography } from './Typography';

interface CircularProgressProps {
  size: number;
  progress: number; // 0-100
  color?: string;
  trackColor?: string;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  showPercent?: boolean;
}

export function CircularProgress({
  size,
  progress,
  color = Theme.colors.primary,
  trackColor = Theme.colors.border,
  strokeWidth = 6,
  label,
  sublabel,
  showPercent = true,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg
        width={size}
        height={size}
        style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}
      >
        {/* Track */}
        <Circle
          cx={cx} cy={cy} r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <Circle
          cx={cx} cy={cy} r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>

      {/* Center content */}
      <View style={{ alignItems: 'center' }}>
        {showPercent && (
          <Typography
            variant="h2"
            style={{ color, fontWeight: '800', fontSize: size * 0.22, lineHeight: size * 0.28 }}
          >
            {Math.round(clampedProgress)}%
          </Typography>
        )}
        {label && (
          <Typography variant="caption" color="secondary" style={{ textAlign: 'center', fontSize: size * 0.09 }}>
            {label}
          </Typography>
        )}
        {sublabel && (
          <Typography variant="small" color="muted" style={{ textAlign: 'center', fontSize: size * 0.08 }}>
            {sublabel}
          </Typography>
        )}
      </View>
    </View>
  );
}
