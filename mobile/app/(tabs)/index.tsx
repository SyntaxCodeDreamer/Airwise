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
  const [locationName, setLocationName] = useState('Anand Vihar, New Delhi');

  const fetchAQI = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let lat = 28.6508;
      let lon = 77.3152;
      
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        lat = loc.coords.latitude;
        lon = loc.coords.longitude;
        try {
          const rev = await mobileAqiApi.reverseGeocode(lat, lon);
          if (rev && rev.name) {
            setLocationName(rev.name);
          } else {
            setLocationName(`${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`);
          }
        } catch {
          setLocationName(`${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`);
        }
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
  const hourly = aqiData?.hourly_forecast || [
    { time: '06:00', aqi: 395, color: '#E60000', category: 'Very Poor' },
    { time: '09:00', aqi: 420, color: '#7E0023', category: 'Severe' },
    { time: '12:00', aqi: 280, color: '#FF7E00', category: 'Poor' },
    { time: '15:00', aqi: 240, color: '#FF7E00', category: 'Poor' },
    { time: '18:00', aqi: 340, color: '#E60000', category: 'Very Poor' },
    { time: '21:00', aqi: 375, color: '#E60000', category: 'Very Poor' }
  ];
  const daily = aqiData?.daily_forecast || [
    { day: 'Today', aqi: 382, color: '#E60000', category: 'Very Poor' },
    { day: 'Fri', aqi: 360, color: '#E60000', category: 'Very Poor' },
    { day: 'Sat', aqi: 290, color: '#FF7E00', category: 'Poor' },
    { day: 'Sun', aqi: 240, color: '#FF7E00', category: 'Poor' },
    { day: 'Mon', aqi: 270, color: '#FF7E00', category: 'Poor' }
  ];

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />}
    >
      {/* Top Header & Data Freshness Indicator */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <View style={styles.freshnessBadge}>
            <Text style={styles.freshnessDot}>●</Text>
            <Text style={styles.freshnessText}>
              {aqiData?.freshness_status === 'LIVE' ? 'LIVE CONTINUOUS MONITOR' : 'ESTIMATED REGIONAL BASELINE'}
            </Text>
          </View>
          <Text style={styles.timestampText}>
            Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        <Text style={styles.title}>AirWise AI</Text>
        <Text style={styles.subtitle}>📍 {locationName}</Text>
        <Text style={styles.stationMeta}>Station: {aqiData?.station_name || 'CPCB Continuous Ambient Station'}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 40 }} />
      ) : (
        <>
          {/* Main AQI Gauge */}
          <MobileAQIGauge 
            aqi={aqiInfo.aqi || 382}
            category={aqiInfo.category || 'Very Poor'}
            color={aqiInfo.color || '#E60000'}
            primaryPollutant={aqiInfo.primary_pollutant || 'PM2.5'}
          />

          {/* 24-Hour Hourly Forecast Timeline */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>24-Hour Hourly Pollution Forecast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyScroll}>
              {hourly.map((h: any, i: number) => (
                <View key={i} style={styles.hourlyItem}>
                  <Text style={styles.hourlyTime}>{h.time}</Text>
                  <View style={[styles.hourlyBar, { backgroundColor: h.color || '#E60000' }]}>
                    <Text style={styles.hourlyAqiText}>{h.aqi}</Text>
                  </View>
                  <Text style={styles.hourlyCat}>{h.category?.split(' ')[0]}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* 6 Pollutant Concentration Breakdown */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Pollutant Concentration Breakdown</Text>
            
            <View style={styles.grid}>
              <View style={styles.pollutantItem}>
                <Text style={styles.pollutantLabel}>PM 2.5</Text>
                <Text style={styles.pollutantValue}>{pollutants.pm25?.concentration ?? 242.0} µg/m³</Text>
              </View>
              <View style={styles.pollutantItem}>
                <Text style={styles.pollutantLabel}>PM 10</Text>
                <Text style={styles.pollutantValue}>{pollutants.pm10?.concentration ?? 380.0} µg/m³</Text>
              </View>
              <View style={styles.pollutantItem}>
                <Text style={styles.pollutantLabel}>NO2</Text>
                <Text style={styles.pollutantValue}>{pollutants.no2?.concentration ?? 68.4} µg/m³</Text>
              </View>
              <View style={styles.pollutantItem}>
                <Text style={styles.pollutantLabel}>SO2</Text>
                <Text style={styles.pollutantValue}>{pollutants.so2?.concentration ?? 24.1} µg/m³</Text>
              </View>
              <View style={styles.pollutantItem}>
                <Text style={styles.pollutantLabel}>CO</Text>
                <Text style={styles.pollutantValue}>{pollutants.co?.concentration ?? 2.1} mg/m³</Text>
              </View>
              <View style={styles.pollutantItem}>
                <Text style={styles.pollutantLabel}>Ozone (O3)</Text>
                <Text style={styles.pollutantValue}>{pollutants.o3?.concentration ?? 45.0} µg/m³</Text>
              </View>
            </View>
          </View>

          {/* 7-Day Multi-Day Forecast */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>7-Day Regional Smog Trend</Text>
            {daily.map((d: any, idx: number) => (
              <View key={idx} style={styles.dailyRow}>
                <Text style={styles.dailyDay}>{d.day}</Text>
                <Text style={[styles.dailyCat, { color: d.color || '#E60000' }]}>{d.category}</Text>
                <View style={[styles.dailyBadge, { backgroundColor: `${d.color || '#E60000'}25`, borderColor: d.color || '#E60000' }]}>
                  <Text style={[styles.dailyAqi, { color: d.color || '#E60000' }]}>AQI {d.aqi}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Quick Actions / Tips */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Smog Defense Quick Hacks</Text>
            <Text style={styles.tipsItem}>• Seal exterior door gaps with draft stoppers to block PM2.5</Text>
            <Text style={styles.tipsItem}>• Avoid running unvented gas heaters or incense indoors</Text>
            <Text style={styles.tipsItem}>• Use wet mopping instead of dry broom sweeping to avoid dust resuspension</Text>
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
    paddingBottom: 50,
  },
  header: {
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  freshnessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#064e3b40',
    borderColor: '#10b981',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8
  },
  freshnessDot: {
    color: '#10b981',
    fontSize: 8
  },
  freshnessText: {
    color: '#34d399',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  timestampText: {
    color: '#64748b',
    fontSize: 10
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
    marginTop: 2,
  },
  stationMeta: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2
  },
  sectionCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#334155'
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  hourlyScroll: {
    paddingVertical: 4
  },
  hourlyItem: {
    alignItems: 'center',
    marginRight: 14,
    width: 54
  },
  hourlyTime: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6
  },
  hourlyBar: {
    width: 44,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  hourlyAqiText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold'
  },
  hourlyCat: {
    color: '#cbd5e1',
    fontSize: 10,
    marginTop: 4
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  pollutantItem: {
    width: '31%',
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
  },
  pollutantLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '700',
  },
  pollutantValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginTop: 4,
  },
  dailyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#0f172a'
  },
  dailyDay: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    width: 80
  },
  dailyCat: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  dailyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1
  },
  dailyAqi: {
    fontSize: 11,
    fontWeight: 'bold'
  },
  tipsCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155'
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#38bdf8',
    marginBottom: 8
  },
  tipsItem: {
    color: '#cbd5e1',
    fontSize: 12,
    lineHeight: 18,
    marginVertical: 2
  },
  noticeCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginTop: 4,
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
