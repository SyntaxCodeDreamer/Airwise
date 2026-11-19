import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  TextInput
} from 'react-native';
import { mobileAqiApi } from '../../services/api';

export default function CommuteScreen() {
  const [distance, setDistance] = useState(15);
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState<any>(null);

  const fetchComparison = async (dist: number) => {
    setLoading(true);
    try {
      const data = await mobileAqiApi.compareCommute(dist);
      setComparison(data);
    } catch (e) {
      console.log('Commute compare error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison(distance);
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.tag}>🌱 Sustainable Mobility</Text>
        <Text style={styles.title}>Commute & CO2</Text>
        <Text style={styles.subtitle}>
          Compare travel emissions & smog exposure across transit modes.
        </Text>
      </View>

      {/* Distance Selector Card */}
      <View style={styles.card}>
        <Text style={styles.label}>ESTIMATED TRAVEL DISTANCE</Text>
        <Text style={styles.distanceValue}>{distance} km (One Way)</Text>

        <View style={styles.buttonRow}>
          {[5, 10, 15, 25, 40].map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.distBtn, distance === d && styles.distBtnActive]}
              onPress={() => {
                setDistance(d);
                fetchComparison(d);
              }}
            >
              <Text style={[styles.distBtnText, distance === d && styles.distBtnTextActive]}>
                {d} km
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Modes Grid */}
      {loading ? (
        <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 30 }} />
      ) : (
        <View style={styles.modesList}>
          {comparison?.modes?.map((item: any, idx: number) => {
            const isMetro = item.mode.includes('Metro');
            return (
              <View 
                key={idx} 
                style={[
                  styles.modeCard,
                  isMetro && styles.modeCardRecommended
                ]}
              >
                <View style={styles.modeHeader}>
                  <Text style={styles.modeIdx}>MODE {idx + 1}</Text>
                  {isMetro && (
                    <View style={styles.recommendedBadge}>
                      <Text style={styles.recommendedText}>★ RECOMMENDED</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.modeName}>{item.mode}</Text>

                <View style={styles.statRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Carbon Emitted</Text>
                    <Text style={[styles.statValue, { color: item.co2_emitted_kg === 0 ? '#10b981' : '#f87171' }]}>
                      {item.co2_emitted_kg} kg
                    </Text>
                  </View>

                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>CO2 Saved vs Car</Text>
                    <Text style={[styles.statValue, { color: '#34d399' }]}>
                      {item.co2_saved_kg} kg
                    </Text>
                  </View>
                </View>

                <View style={styles.exposureBox}>
                  <Text style={styles.exposureLabel}>Smog Exposure: <Text style={styles.exposureValue}>{item.smog_exposure}</Text></Text>
                  <Text style={styles.recText}>{item.recommendation}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1120' },
  contentContainer: { padding: 20, paddingTop: 50, paddingBottom: 40 },
  header: { marginBottom: 16 },
  tag: { color: '#10b981', fontSize: 11, fontWeight: '700', marginBottom: 4, textTransform: 'uppercase' },
  title: { fontSize: 26, fontWeight: '900', color: '#ffffff' },
  subtitle: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
  card: { backgroundColor: '#1e293b', borderRadius: 20, padding: 18, marginBottom: 18 },
  label: { fontSize: 11, fontWeight: '700', color: '#94a3b8', letterSpacing: 0.5 },
  distanceValue: { fontSize: 22, fontWeight: '900', color: '#ffffff', marginVertical: 8 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  distBtn: { 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 12, 
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155'
  },
  distBtnActive: { backgroundColor: '#10b981', borderColor: '#10b981' },
  distBtnText: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  distBtnTextActive: { color: '#0f172a' },
  modesList: { gap: 14 },
  modeCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155'
  },
  modeCardRecommended: {
    borderColor: '#10b981',
    backgroundColor: '#0f2922'
  },
  modeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  modeIdx: { color: '#64748b', fontSize: 11, fontWeight: '800' },
  recommendedBadge: { backgroundColor: '#10b981', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  recommendedText: { color: '#0f172a', fontSize: 10, fontWeight: '900' },
  modeName: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  statBox: { width: '48%', backgroundColor: '#0b1120', padding: 10, borderRadius: 12 },
  statLabel: { color: '#94a3b8', fontSize: 10, fontWeight: '600' },
  statValue: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  exposureBox: { backgroundColor: '#0b1120', padding: 10, borderRadius: 12 },
  exposureLabel: { color: '#94a3b8', fontSize: 11, fontWeight: '600' },
  exposureValue: { color: '#f8fafc', fontWeight: 'bold' },
  recText: { color: '#38bdf8', fontSize: 11, marginTop: 4, fontStyle: 'italic' }
});
