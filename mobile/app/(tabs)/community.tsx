import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { mobileAqiApi } from '../../services/api';

export default function CommunityScreen() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [incidentType, setIncidentType] = useState('GARBAGE_BURNING');
  const [landmark, setLandmark] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const data = await mobileAqiApi.getReports();
      setReports(data || []);
    } catch (e) {
      console.log('Error loading reports:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Required', 'Please describe the pollution incident.');
      return;
    }
    setSubmitting(true);
    try {
      await mobileAqiApi.submitReport({
        incident_type: incidentType,
        landmark: landmark || 'Current Location Area',
        description
      });
      setDescription('');
      setLandmark('');
      setShowForm(false);
      Alert.alert('Success', 'Incident alert broadcasted to community map.');
      loadIncidents();
    } catch (e) {
      Alert.alert('Error', 'Could not submit alert.');
    } finally {
      setSubmitting(false);
    }
  };

  const types = [
    { key: 'GARBAGE_BURNING', label: '🔥 Garbage Burning' },
    { key: 'CROP_BURNING', label: '🌾 Stubble Burning' },
    { key: 'CONSTRUCTION_DUST', label: '🏗️ Construction Dust' },
    { key: 'VEHICULAR_EMISSION', label: '🚗 Heavy Smoke' }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.tag}>👥 Citizen Action</Text>
        <Text style={styles.title}>Community Watch</Text>
        <Text style={styles.subtitle}>
          Real-time crowdsourced reports of illegal burning & smog hotspots.
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.toggleBtn}
        onPress={() => setShowForm(!showForm)}
      >
        <Text style={styles.toggleBtnText}>
          {showForm ? '✕ Close Incident Form' : '🚨 Report Local Pollution Incident'}
        </Text>
      </TouchableOpacity>

      {/* Incident Submission Box */}
      {showForm && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Report Pollution Activity</Text>
          
          <Text style={styles.inputLabel}>INCIDENT TYPE</Text>
          <View style={styles.typeRow}>
            {types.map(t => (
              <TouchableOpacity
                key={t.key}
                style={[styles.typePill, incidentType === t.key && styles.typePillActive]}
                onPress={() => setIncidentType(t.key)}
              >
                <Text style={[styles.typePillText, incidentType === t.key && styles.typePillTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.inputLabel}>LANDMARK / STREET</Text>
          <TextInput
            placeholder="e.g. Near Metro Pillar 142 or Ring Road Bypass"
            placeholderTextColor="#64748b"
            value={landmark}
            onChangeText={setLandmark}
            style={styles.input}
          />

          <Text style={styles.inputLabel}>DESCRIPTION</Text>
          <TextInput
            placeholder="Describe smoke color, burning materials, respiratory hazard..."
            placeholderTextColor="#64748b"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={[styles.input, { height: 75, textAlignVertical: 'top' }]}
          />

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.submitBtnText}>
              {submitting ? 'Submitting...' : '📢 Broadcast Alert'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Incident Feed */}
      <View style={styles.feedSection}>
        <Text style={styles.feedTitle}>Recent Community Incidents ({reports.length})</Text>

        {loading ? (
          <ActivityIndicator size="small" color="#10b981" style={{ marginTop: 20 }} />
        ) : (
          reports.map((item, idx) => (
            <View key={idx} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={styles.reportBadge}>
                  <Text style={styles.reportBadgeText}>{item.incident_type.replace('_', ' ')}</Text>
                </View>
                <Text style={styles.reportTime}>{item.timestamp || 'Just now'}</Text>
              </View>

              <Text style={styles.reportDesc}>{item.description}</Text>
              <Text style={styles.reportLocation}>📍 {item.landmark}</Text>

              <View style={styles.reportFooter}>
                <Text style={styles.upvoteText}>👍 {item.upvotes ?? 3} citizens verified</Text>
              </View>
            </View>
          ))
        )}
      </View>
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
  toggleBtn: { backgroundColor: '#10b981', padding: 14, borderRadius: 16, alignItems: 'center', marginBottom: 18 },
  toggleBtnText: { color: '#0f172a', fontWeight: 'bold', fontSize: 13 },
  formCard: { backgroundColor: '#1e293b', padding: 18, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: '#334155' },
  formTitle: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', marginBottom: 12 },
  inputLabel: { color: '#94a3b8', fontSize: 10, fontWeight: '700', marginTop: 10, marginBottom: 6 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  typePill: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155' },
  typePillActive: { backgroundColor: '#10b981', borderColor: '#10b981' },
  typePillText: { color: '#94a3b8', fontSize: 11, fontWeight: '600' },
  typePillTextActive: { color: '#0f172a', fontWeight: 'bold' },
  input: { backgroundColor: '#0f172a', borderRadius: 12, borderWidth: 1, borderColor: '#334155', color: '#ffffff', padding: 12, fontSize: 13 },
  submitBtn: { backgroundColor: '#10b981', padding: 12, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  submitBtnText: { color: '#0f172a', fontWeight: 'bold', fontSize: 13 },
  feedSection: { marginTop: 10 },
  feedTitle: { color: '#e2e8f0', fontSize: 15, fontWeight: 'bold', marginBottom: 12 },
  reportCard: { backgroundColor: '#1e293b', padding: 16, borderRadius: 18, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  reportBadge: { backgroundColor: 'rgba(239, 68, 68, 0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  reportBadgeText: { color: '#f87171', fontSize: 10, fontWeight: 'bold' },
  reportTime: { color: '#64748b', fontSize: 11 },
  reportDesc: { color: '#f8fafc', fontSize: 13, lineHeight: 18, marginBottom: 8 },
  reportLocation: { color: '#38bdf8', fontSize: 12, fontWeight: '500', marginBottom: 10 },
  reportFooter: { borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 8 },
  upvoteText: { color: '#94a3b8', fontSize: 11 }
});
