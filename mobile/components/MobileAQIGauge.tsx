import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AQIGaugeProps {
  aqi: number;
  category: string;
  color: string;
  primaryPollutant: string;
}

export const MobileAQIGauge: React.FC<AQIGaugeProps> = ({
  aqi,
  category,
  color,
  primaryPollutant
}) => {
  return (
    <View style={[styles.container, { borderColor: `${color}40` }]}>
      <Text style={styles.badgeLabel}>INDIAN NATIONAL AQI (CPCB)</Text>
      <Text style={[styles.aqiNumber, { color }]}>{aqi || '--'}</Text>
      <View style={[styles.categoryBadge, { backgroundColor: `${color}25` }]}>
        <Text style={[styles.categoryText, { color }]}>{category?.toUpperCase()}</Text>
      </View>
      <View style={styles.divider} />
      <Text style={styles.dominantText}>
        Dominant Pollutant: <Text style={styles.boldText}>{primaryPollutant}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    marginVertical: 12,
  },
  badgeLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  aqiNumber: {
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: -1,
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#334155',
    marginVertical: 16,
  },
  dominantText: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#f8fafc',
  },
});

