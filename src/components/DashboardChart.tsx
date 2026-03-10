import { View, StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../constants/Theme';
import { Typography } from './Typography';

interface BarChartProps {
  title: string;
  labels: string[];
  data: number[];
  color: string;
  displayValues?: string[];
}

const CHART_HEIGHT = 120;

export function DashboardChart({ title, labels, data, color, displayValues }: BarChartProps) {
  const max = Math.max(...data, 1);

  return (
    <View style={styles.wrapper}>
      {title ? <Typography variant="label" color="secondary" style={styles.title}>{title}</Typography> : null}
      <View style={styles.chartArea}>
        {data.map((val, i) => {
          const barHeight = Math.max((val / max) * CHART_HEIGHT, val > 0 ? 6 : 2);
          return (
            <View key={i} style={styles.barCol}>
              {val > 0 && (
                <Typography variant="small" style={[styles.barLabel, { color }]}>
                  {displayValues?.[i] ?? `${val.toFixed(0)}M`}
                </Typography>
              )}
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: val > 0 ? color : Theme.colors.divider,
                      shadowColor: val > 0 ? color : 'transparent',
                      shadowOpacity: val > 0 ? 0.4 : 0,
                      shadowRadius: 6,
                      shadowOffset: { width: 0, height: 0 },
                    },
                  ]}
                />
              </View>
              <Typography variant="small" color="muted" style={styles.xLabel}>{labels[i]}</Typography>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {},
  title: { marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.8 },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: CHART_HEIGHT + 36,
    gap: 4,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: CHART_HEIGHT + 36,
  },
  barLabel: { fontSize: 8, fontWeight: '700', marginBottom: 2, textAlign: 'center' },
  barTrack: { width: '100%', height: CHART_HEIGHT, justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 4 },
  xLabel: { marginTop: 4, textAlign: 'center', fontSize: 9 },
});
