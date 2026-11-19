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
  const [hasAsthma, setHasAsthma] = useState(true);
  const [hasCardiovascular, setHasCardiovascular] = useState(false);
  const [commuteByPublicTransit, setCommuteByPublicTransit] = useState(true);

  const handleSave = () => {
    Alert.alert('Profile Saved', 'Your vulnerability profile has been updated. AI recommendations will now prioritize these health factors.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.tag}>👤 Personalized Guard</Text>
        <Text style={styles.title}>Family Health Profile</Text>
        <Text style={styles.subtitle}>
          Tailor AI smog alerts and precautions to your family's vulnerability.
        </Text>
      </View>

      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>
        <View>
          <Text style={styles.userName}>AirWise Active User</Text>
          <Text style={styles.userRole}>Family Health Guardian</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Vulnerable Family Members</Text>
        
        <View style={styles.switchRow}>
          <View style={styles.switchTextGroup}>
            <Text style={styles.switchLabel}>Elderly Members (65+ years)</Text>
            <Text style={styles.switchSub}>High sensitivity to PM2.5 lung penetration</Text>
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
            <Text style={styles.switchLabel}>Young Children / Infants</Text>
            <Text style={styles.switchSub}>Higher breathing rate; avoid playground smog</Text>
          </View>
          <Switch 
            value={hasChildren} 
            onValueChange={setHasChildren}
            thumbColor={hasChildren ? '#10b981' : '#64748b'}
            trackColor={{ false: '#334155', true: '#064e3b' }}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Underlying Respiratory Conditions</Text>
        
        <View style={styles.switchRow}>
          <View style={styles.switchTextGroup}>
            <Text style={styles.switchLabel}>Asthma / Chronic Bronchitis</Text>
            <Text style={styles.switchSub}>Triggers severe bronchospasm during winter inversions</Text>
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
            <Text style={styles.switchLabel}>Cardiovascular Vulnerability</Text>
            <Text style={styles.switchSub}>Hypertension or heart condition</Text>
          </View>
          <Switch 
            value={hasCardiovascular} 
            onValueChange={setHasCardiovascular}
            thumbColor={hasCardiovascular ? '#10b981' : '#64748b'}
            trackColor={{ false: '#334155', true: '#064e3b' }}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>💾 Update Health Profile</Text>
      </TouchableOpacity>
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
  userCard: { backgroundColor: '#1e293b', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18, borderWidth: 1, borderColor: '#334155' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontWeight: '900', color: '#0f172a' },
  userName: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  userRole: { color: '#10b981', fontSize: 12, fontWeight: '500' },
  card: { backgroundColor: '#1e293b', borderRadius: 20, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  cardTitle: { color: '#e2e8f0', fontSize: 14, fontWeight: 'bold', marginBottom: 12 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#0f172a' },
  switchTextGroup: { flex: 1, paddingRight: 10 },
  switchLabel: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  switchSub: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  saveBtn: { backgroundColor: '#10b981', padding: 14, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#0f172a', fontWeight: 'bold', fontSize: 14 }
});
