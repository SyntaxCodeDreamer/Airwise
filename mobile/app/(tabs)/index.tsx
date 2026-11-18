import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  RefreshControl, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import * as Location from 'expo-location';
import { mobileAqiApi } from '../../services/api';
import { MobileAQIGauge } from '../../components/MobileAQIGauge';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [aqiData, setAqiData] = useState<any>(null);
  const [locationName, setLocationName] = useState('New Delhi (Default)');

  const fetchAQI = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let lat = 28.6508;
      let lon = 77.3152;
      
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        lat = loc.coords.latitude;
        lon = loc.coords.longitude;
        setLocationName(`${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`);
      }
      
      const data = await mobileAqiApi.getCurrentAQI(lat, lon);
      setAqiData(data);
    } catch (e) {
      console.log('Location or AQI error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAQI();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAQI();
  };

  const aqiInfo = aqiData?.aqi_data || {};
  const pollutants = aqiInfo.sub_indices || {};

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>AirWise AI</Text>
        <Text style={styles.subtitle}>📍 {locationName}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 40 }} />
      ) : (
        <>
          <MobileAQIGauge 
            aqi={aqiInfo.aqi}
            category={aqiInfo.category}
            color={aqiInfo.color}
            primaryPollutant={aqiInfo.primary_pollutant}
          />

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Pollutant Concentration Breakdown</Text>
            
            <View style={styles.grid}>
              <View style={styles.pollutantItem}>
                <Text style={styles.pollutantLabel}>PM 2.5</Text>
                <Text style={styles.pollutantValue}>{pollutants.pm25?.concentration ?? '--'} µg/m³</Text>
              </View>
              <View style={styles.pollutantItem}>
                <Text style={styles.pollutantLabel}>PM 10</Text>
                <Text style={styles.pollutantValue}>{pollutants.pm10?.concentration ?? '--'} µg/m³</Text>
              </View>
              <View style={styles.pollutantItem}>
                <Text style={styles.pollutantLabel}>NO2</Text>
                <Text style={styles.pollutantValue}>{pollutants.no2?.concentration ?? '--'} µg/m³</Text>
              </View>
              <View style={styles.pollutantItem}>
                <Text style={styles.pollutantLabel}>CO</Text>
                <Text style={styles.pollutantValue}>{pollutants.co?.concentration ?? '--'} mg/m³</Text>
              </View>
            </View>
          </View>

          <View style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>⚠️ CPCB National Health Advisory</Text>
            <Text style={styles.noticeDesc}>{aqiInfo.health_impact || 'Prolonged exposure triggers respiratory illness.'}</Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1120',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 50,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 13,
    color: '#10b981',
    fontWeight: '600',
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  pollutantItem: {
    width: '48%',
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  pollutantLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  pollutantValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginTop: 4,
  },
  noticeCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginTop: 10,
  },
  noticeTitle: {
    color: '#f87171',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noticeDesc: {
    color: '#cbd5e1',
    fontSize: 12,
    marginTop: 6,
    lineHeight: 18,
  },
});

