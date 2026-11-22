import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput 
} from 'react-native';

export default function MapScreen() {
  const [selectedStation, setSelectedStation] = useState('Anand Vihar, New Delhi');
  const [searchQuery, setSearchQuery] = useState('');

  const stations = [
    { name: 'Anand Vihar, New Delhi', aqi: 382, category: 'Very Poor', color: '#E60000', lat: 28.6508, lon: 77.3152, primary: 'PM2.5' },
    { name: 'Bandra Kurla, Mumbai', aqi: 174, category: 'Moderate', color: '#FF7E00', lat: 19.0657, lon: 72.8687, primary: 'PM10' },
    { name: 'Silk Board, Bengaluru', aqi: 122, category: 'Moderate', color: '#F1C40F', lat: 12.9176, lon: 77.6238, primary: 'PM2.5' },
    { name: 'Chandkheda, Ahmedabad', aqi: 240, category: 'Poor', color: '#FF7E00', lat: 23.1128, lon: 72.5830, primary: 'PM2.5' },
    { name: 'Talkatora, Lucknow', aqi: 365, category: 'Very Poor', color: '#E60000', lat: 26.8393, lon: 80.9022, primary: 'PM2.5' }
  ];

  const hotspots = [
    { type: '🌾 Stubble Burning', area: 'Outer Ring Road Bypass', severity: 'Severe', reports: 14 },
    { type: '🔥 Waste Combustion', area: 'Sector 14 Industrial Area', severity: 'High', reports: 8 },
    { type: '🏗️ Demolition Dust', area: 'Metro Flyover Expansion', severity: 'Moderate', reports: 5 }
  ];

  const filteredStations = stations.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.tag}>🗺️ Geospatial Monitoring</Text>
        <Text style={styles.title}>Pollution Map</Text>
        <Text style={styles.subtitle}>
          Nearby ambient air stations, verified hotspots & coarse citizen pins.
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search city, sector or monitoring station..."
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {/* Selected Station Card */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>Selected Continuous Station</Text>
        <Text style={styles.stationName}>{selectedStation}</Text>
        
        <View style={styles.stationBadge}>
          <Text style={styles.stationAqiText}>Live CPCB Monitored • Verified Data</Text>
        </View>

        <Text style={styles.privacyNotice}>
          🔒 Privacy Protection: Public community pins display coarse area boundaries. Exact user residential locations are never broadcasted.
        </Text>
      </View>

      {/* Monitoring Stations List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Regional Stations ({filteredStations.length})</Text>
        
        {filteredStations.map((st, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={[styles.stationItem, selectedStation === st.name && styles.stationItemActive]}
            onPress={() => setSelectedStation(st.name)}
          >
            <View>
              <Text style={styles.itemTitle}>{st.name}</Text>
              <Text style={styles.itemSub}>Dominant: {st.primary} • {st.lat.toFixed(2)}°N, {st.lon.toFixed(2)}°E</Text>
            </View>
            <View style={[styles.aqiPill, { backgroundColor: `${st.color}25`, borderColor: st.color }]}>
              <Text style={[styles.aqiText, { color: st.color }]}>{st.aqi}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Hotspots Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Smog Hotspots & Plumes</Text>
        {hotspots.map((h, i) => (
          <View key={i} style={styles.hotspotCard}>
            <View style={styles.hotspotHeader}>
              <Text style={styles.hotspotType}>{h.type}</Text>
              <Text style={styles.hotspotReports}>{h.reports} reports</Text>
            </View>
            <Text style={styles.hotspotArea}>📍 {h.area}</Text>
            <Text style={styles.hotspotAdvice}>Recommendation: Avoid outdoor exposure within 2 km radius.</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1120' },
  contentContainer: { padding: 20, paddingTop: 50, paddingBottom: 50 },
  header: { marginBottom: 16 },
  tag: { color: '#10b981', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  title: { fontSize: 26, fontWeight: '900', color: '#ffffff', marginTop: 4 },
  subtitle: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
  searchBox: { marginBottom: 16 },
  searchInput: { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 14, color: '#ffffff', padding: 12, fontSize: 13 },
  card: { backgroundColor: '#1e293b', borderRadius: 20, padding: 18, marginBottom: 18, borderWidth: 1, borderColor: '#334155' },
  cardHeader: { color: '#94a3b8', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  stationName: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginVertical: 6 },
  stationBadge: { backgroundColor: '#064e3b40', borderWidth: 1, borderColor: '#10b981', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginVertical: 4 },
  stationAqiText: { color: '#34d399', fontSize: 11, fontWeight: 'bold' },
  privacyNotice: { color: '#64748b', fontSize: 11, fontStyle: 'italic', marginTop: 10, lineHeight: 16 },
  section: { marginBottom: 18 },
  sectionTitle: { color: '#e2e8f0', fontSize: 15, fontWeight: 'bold', marginBottom: 10 },
  stationItem: { backgroundColor: '#1e293b', padding: 14, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
  stationItemActive: { borderColor: '#10b981', backgroundColor: '#0f2922' },
  itemTitle: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  itemSub: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  aqiPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1 },
  aqiText: { fontSize: 14, fontWeight: 'bold' },
  hotspotCard: { backgroundColor: '#1e293b', padding: 14, borderRadius: 16, marginBottom: 8, borderWidth: 1, borderColor: '#ef444440' },
  hotspotHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hotspotType: { color: '#f87171', fontSize: 12, fontWeight: 'bold' },
  hotspotReports: { color: '#94a3b8', fontSize: 10 },
  hotspotArea: { color: '#ffffff', fontSize: 13, fontWeight: 'bold', marginVertical: 4 },
  hotspotAdvice: { color: '#cbd5e1', fontSize: 11, lineHeight: 16 }
});
