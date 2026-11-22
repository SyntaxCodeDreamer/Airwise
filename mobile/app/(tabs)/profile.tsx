import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert
} from 'react-native';

export default function ProfileScreen() {
  const [hasElderly, setHasElderly] = useState(true);
  const [hasChildren, setHasChildren] = useState(false);
  const [hasPregnant, setHasPregnant] = useState(false);
  const [hasAsthma, setHasAsthma] = useState(true);
  const [hasPurifier, setHasPurifier] = useState(false);
  const [commuteMode, setCommuteMode] = useState('Metro');
  const [indoorSmokeSources, setIndoorSmokeSources] = useState(['Incense']);

  const toggleSource = (src: string) => {
    if (indoorSmokeSources.includes(src)) {
      setIndoorSmokeSources(indoorSmokeSources.filter(s => s !== src));
    } else {
      setIndoorSmokeSources([...indoorSmokeSources, src]);
    }
  };

  const handleSave = () => {
    Alert.alert('Health Profile Updated', 'Your family health context and vulnerability settings have been saved in MongoDB.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.tag}>👤 Personalized Health Context</Text>
        <Text style={styles.title}>Family Health Profile</Text>
        <Text style={styles.subtitle}>
          Tailor 48-hour AI smog alerts, walk safety times, and precautions to your family's exact vulnerability.
        </Text>
      </View>

      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>
        <View>
          <Text style={styles.userName}>Aarav Sharma</Text>
          <Text style={styles.userRole}>New Delhi • Citizen Profile</Text>
        </View>
      </View>

      {/* Vulnerable Family Members */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Vulnerable Family Members</Text>
        
        <View style={styles.switchRow}>
          <View style={styles.switchTextGroup}>
            <Text style={styles.switchLabel}>Elderly Members (60+ years)</Text>
            <Text style={styles.switchSub}>High sensitivity to PM2.5 lung penetration & cardiac stress</Text>
          </View>
          <Switch 
            value={hasElderly} 
            onValueChange={setHasElderly}
            thumbColor={hasElderly ? '#10b981' : '#64748b'}
            trackColor={{ false: '#334155', true: '#064e3b' }}
          />
        </View>

        <View style={styles.switchRow}>
          <View style={styles.switchTextGroup}>
            <Text style={styles.switchLabel}>Young Children & Infants (&lt;5 years)</Text>
            <Text style={styles.switchSub}>Higher breathing rate; strictly avoid playground smog</Text>
          </View>
          <Switch 
            value={hasChildren} 
            onValueChange={setHasChildren}
            thumbColor={hasChildren ? '#10b981' : '#64748b'}
            trackColor={{ false: '#334155', true: '#064e3b' }}
          />
        </View>

        <View style={styles.switchRow}>
          <View style={styles.switchTextGroup}>
            <Text style={styles.switchLabel}>Pregnant / Expectant Family Member</Text>
            <Text style={styles.switchSub}>Protects placental barrier & systemic maternal vascular oxygenation</Text>
          </View>
          <Switch 
            value={hasPregnant} 
            onValueChange={setHasPregnant}
            thumbColor={hasPregnant ? '#10b981' : '#64748b'}
            trackColor={{ false: '#334155', true: '#064e3b' }}
          />
        </View>
      </View>

      {/* Respiratory Conditions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Respiratory Conditions & Equipment</Text>
        
        <View style={styles.switchRow}>
          <View style={styles.switchTextGroup}>
            <Text style={styles.switchLabel}>Asthma / Chronic Bronchitis</Text>
            <Text style={styles.switchSub}>Triggers acute bronchospasm during winter inversions</Text>
          </View>
          <Switch 
            value={hasAsthma} 
            onValueChange={setHasAsthma}
            thumbColor={hasAsthma ? '#10b981' : '#64748b'}
            trackColor={{ false: '#334155', true: '#064e3b' }}
          />
        </View>

        <View style={styles.switchRow}>
          <View style={styles.switchTextGroup}>
            <Text style={styles.switchLabel}>Equipped with Indoor HEPA Air Purifier</Text>
            <Text style={styles.switchSub}>Enables AI to calculate exact room air change rate</Text>
          </View>
          <Switch 
            value={hasPurifier} 
            onValueChange={setHasPurifier}
            thumbColor={hasPurifier ? '#10b981' : '#64748b'}
            trackColor={{ false: '#334155', true: '#064e3b' }}
          />
        </View>
      </View>

      {/* Commuting Habit Selector */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Primary Commuting Habit</Text>
        <View style={styles.commuteGrid}>
          {['Metro', 'Bus', 'Personal Car', 'Two-Wheeler'].map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.commutePill, commuteMode === m && styles.commutePillActive]}
              onPress={() => setCommuteMode(m)}
            >
              <Text style={[styles.commutePillText, commuteMode === m && styles.commutePillTextActive]}>
                {m === 'Metro' ? '🚇 Metro (Clean)' : m === 'Bus' ? '🚌 CNG Bus' : m === 'Personal Car' ? '🚗 Car' : '🛵 2-Wheeler'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Indoor Smoke Triggers */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Indoor Pollution / Smoke Sources</Text>
        <Text style={styles.subHint}>Select combustion sources used in your household:</Text>
        <View style={styles.commuteGrid}>
          {['Incense', 'Mosquito Coils', 'Gas Cooking', 'Scented Candles'].map((src) => {
            const active = indoorSmokeSources.includes(src);
            return (
              <TouchableOpacity
                key={src}
                style={[styles.commutePill, active && styles.smokePillActive]}
                onPress={() => toggleSource(src)}
              >
                <Text style={[styles.commutePillText, active && styles.smokePillTextActive]}>
                  {src} {active ? '⚠️ Present' : '+ None'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>💾 Update Health Context in MongoDB</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1120' },
  contentContainer: { padding: 20, paddingTop: 50, paddingBottom: 50 },
  header: { marginBottom: 16 },
  tag: { color: '#10b981', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  title: { fontSize: 26, fontWeight: '900', color: '#ffffff', marginTop: 4 },
  subtitle: { fontSize: 13, color: '#94a3b8', marginTop: 4, lineHeight: 18 },
  userCard: { backgroundColor: '#1e293b', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18, borderWidth: 1, borderColor: '#334155' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontWeight: '900', color: '#0f172a' },
  userName: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  userRole: { color: '#10b981', fontSize: 12, fontWeight: '500' },
  card: { backgroundColor: '#1e293b', borderRadius: 20, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  cardTitle: { color: '#e2e8f0', fontSize: 14, fontWeight: 'bold', marginBottom: 12 },
  subHint: { color: '#94a3b8', fontSize: 11, marginBottom: 10 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#0f172a' },
  switchTextGroup: { flex: 1, paddingRight: 10 },
  switchLabel: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  switchSub: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  commuteGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  commutePill: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155' },
  commutePillActive: { backgroundColor: '#064e3b', borderColor: '#10b981' },
  commutePillText: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  commutePillTextActive: { color: '#34d399' },
  smokePillActive: { backgroundColor: '#78350f', borderColor: '#f59e0b' },
  smokePillTextActive: { color: '#fde68a' },
  saveBtn: { backgroundColor: '#10b981', padding: 14, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#0f172a', fontWeight: 'bold', fontSize: 14 }
});
