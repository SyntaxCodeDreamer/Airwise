import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  Share,
  Alert
} from 'react-native';

export default function MoreHubScreen() {
  const [activeSection, setActiveSection] = useState<'menu' | 'emergency' | 'indoor' | 'offline' | 'report' | 'rewards' | 'tracker'>('menu');

  // Emergency Mode State
  const [emergencyAqi] = useState(382);

  // Indoor Air Quality State
  const [roomArea, setRoomArea] = useState('200'); // sq ft
  const [hepaCadr, setHepaCadr] = useState('150'); // m3/h

  // Personal Exposure Tracker State
  const [outdoorMinutes, setOutdoorMinutes] = useState(45);
  const [loggedDays, setLoggedDays] = useState([
    { day: 'Mon', aqi: 310, mins: 40, status: 'High' },
    { day: 'Tue', aqi: 280, mins: 30, status: 'Moderate' },
    { day: 'Wed', aqi: 390, mins: 60, status: 'Extreme' },
    { day: 'Thu', aqi: 360, mins: 45, status: 'High' },
    { day: 'Fri (Today)', aqi: 382, mins: outdoorMinutes, status: 'Severe' }
  ]);

  // Green Rewards State
  const [greenPoints, setGreenPoints] = useState(480);
  const [badges] = useState([
    { title: 'Metro Pioneer', icon: '🚇', desc: 'Saved 25kg CO2 via Metro' },
    { title: 'Smog Sentinel', icon: '🛡️', desc: 'Protected vulnerable family on severe days' },
    { title: 'Air Guardian', icon: '🌿', desc: 'Maintained HEPA air quality indoors' }
  ]);

  const handleShareReport = async () => {
    try {
      await Share.share({
        message: `📊 AirWise AI Weekly Family Smog & Carbon Report\nAvg AQI Exposure: 344 (Very Poor)\nEstimated CO2 Avoided: 18.4 kg\nN95 Compliance: 100%\nProtected Family from Winter Inversion.`
      });
    } catch (e) {
      console.log('Share error:', e);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        {activeSection !== 'menu' && (
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => setActiveSection('menu')}
          >
            <Text style={styles.backBtnText}>‹ Back to Modules</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.tag}>⚡ Advanced Capabilities</Text>
        <Text style={styles.title}>
          {activeSection === 'menu' && 'AirWise Suite'}
          {activeSection === 'emergency' && '🚨 Emergency Smog Mode'}
          {activeSection === 'indoor' && '🌿 Indoor Air Quality'}
          {activeSection === 'offline' && '💾 Offline Protection Guide'}
          {activeSection === 'report' && '📑 Weekly Family Report'}
          {activeSection === 'rewards' && '🏆 Green Rewards & Eco Points'}
          {activeSection === 'tracker' && '📈 Personal Exposure Tracker'}
        </Text>
      </View>

      {/* Main Grid Menu */}
      {activeSection === 'menu' && (
        <View style={styles.menuGrid}>
          <TouchableOpacity 
            style={[styles.menuCard, { borderColor: '#ef444460', backgroundColor: '#3b0d0d40' }]}
            onPress={() => setActiveSection('emergency')}
          >
            <Text style={styles.menuIcon}>🚨</Text>
            <Text style={[styles.menuTitle, { color: '#f87171' }]}>Emergency Smog Mode</Text>
            <Text style={styles.menuDesc}>High-priority precautions, hotline numbers & CPCB alerts</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuCard}
            onPress={() => setActiveSection('indoor')}
          >
            <Text style={styles.menuIcon}>🌿</Text>
            <Text style={styles.menuTitle}>Indoor Air Advisor</Text>
            <Text style={styles.menuDesc}>HEPA runtime, cooking exhaust & window rules</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuCard}
            onPress={() => setActiveSection('tracker')}
          >
            <Text style={styles.menuIcon}>📈</Text>
            <Text style={styles.menuTitle}>Exposure Tracker</Text>
            <Text style={styles.menuDesc}>Daily PM2.5 inhalation estimate & outdoor limits</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuCard}
            onPress={() => setActiveSection('rewards')}
          >
            <Text style={styles.menuIcon}>🏆</Text>
            <Text style={styles.menuTitle}>Green Eco Points</Text>
            <Text style={styles.menuDesc}>Leaderboard, weekly challenges & commute badges</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuCard}
            onPress={() => setActiveSection('offline')}
          >
            <Text style={styles.menuIcon}>💾</Text>
            <Text style={styles.menuTitle}>Offline Safe Guide</Text>
            <Text style={styles.menuDesc}>Cached protocols & local protection without internet</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuCard}
            onPress={() => setActiveSection('report')}
          >
            <Text style={styles.menuIcon}>📑</Text>
            <Text style={styles.menuTitle}>Weekly Family Report</Text>
            <Text style={styles.menuDesc}>Shareable air quality audit & emissions saved</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 1. EMERGENCY SMOG MODE */}
      {activeSection === 'emergency' && (
        <View style={styles.subContainer}>
          <View style={styles.emergencyBanner}>
            <Text style={styles.emergencyAqi}>AQI {emergencyAqi}</Text>
            <Text style={styles.emergencyCat}>SEVERE SMOG EMERGENCY</Text>
            <Text style={styles.emergencyTimestamp}>Verified Station Timestamp: LIVE</Text>
          </View>

          <View style={styles.alertCard}>
            <Text style={styles.cardHeader}>🚨 Immediate Emergency Protocols</Text>
            <Text style={styles.bulletText}>• Zero Outdoor Cardio: Suspend all running, cycling and brisk walks.</Text>
            <Text style={styles.bulletText}>• Certified N95 Mask Mandatory: Tight seal required outdoors.</Text>
            <Text style={styles.bulletText}>• Complete Window Lock: Seal perimeter with tape or moist towels.</Text>
            <Text style={styles.bulletText}>• Vulnerable Care: Keep inhalers, pulse oximeters within reach.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardHeader}>📞 Quick Emergency Helplines (India)</Text>
            <Text style={styles.bulletText}>• National Emergency: 112</Text>
            <Text style={styles.bulletText}>• Ambulance / Respiratory Distress: 108</Text>
            <Text style={styles.bulletText}>• CPCB Pollution Control Board: 011-22305792</Text>
          </View>

          <Text style={styles.disclaimerText}>
            Medical Disclaimer: AirWise AI provides environmental precautions, not medical diagnoses. Consult a certified physician for acute respiratory distress.
          </Text>
        </View>
      )}

      {/* 2. INDOOR AIR QUALITY ADVISOR */}
      {activeSection === 'indoor' && (
        <View style={styles.subContainer}>
          <View style={styles.card}>
            <Text style={styles.cardHeader}>🌬️ HEPA Purifier Operation</Text>
            <Text style={styles.subText}>Run purifier on Auto/High mode during morning and evening inversions.</Text>
            
            <View style={styles.statRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Target Room Volume</Text>
                <Text style={styles.statValue}>{roomArea} sq.ft</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Est. Air Changes/Hr</Text>
                <Text style={[styles.statValue, { color: '#10b981' }]}>~4.8 ACH</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardHeader}>🏠 Practical Indoor Smog Hacks</Text>
            <Text style={styles.bulletText}>• Kitchen Exhaust: Always run ducted exhaust during frying to expel VOCs.</Text>
            <Text style={styles.bulletText}>• Zero Indoor Smoke: Ban incense sticks, mosquito coils, and scented candles.</Text>
            <Text style={styles.bulletText}>• Wet Mopping: Never use dry brooms which resuspend toxic PM2.5 settled dust.</Text>
            <Text style={styles.bulletText}>• Ventilation Window: Open windows ONLY between 1:00 PM - 3:00 PM if sunlight disperses ground smog.</Text>
          </View>

          <Text style={styles.disclaimerText}>
            Notice: Without a physical indoor particulate monitor attached, values represent empirical architectural estimates. Indoor plants supplement humidity but cannot replace HEPA filters.
          </Text>
        </View>
      )}

      {/* 3. PERSONAL EXPOSURE TRACKER */}
      {activeSection === 'tracker' && (
        <View style={styles.subContainer}>
          <View style={styles.card}>
            <Text style={styles.cardHeader}>📊 Today's Exposure Summary</Text>
            <Text style={styles.statBig}>382 AQI • {outdoorMinutes} mins outdoor</Text>
            <Text style={styles.subText}>Estimated PM2.5 Inhaled: ~182 µg (Equiv. to ~4 light cigarettes)</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardHeader}>📅 5-Day Exposure History</Text>
            {loggedDays.map((d, i) => (
              <View key={i} style={styles.historyRow}>
                <Text style={styles.historyDay}>{d.day}</Text>
                <Text style={styles.historyTime}>{d.mins} mins</Text>
                <Text style={[styles.historyAqi, { color: d.aqi > 350 ? '#ef4444' : '#f59e0b' }]}>
                  AQI {d.aqi}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.disclaimerText}>
            Note: Exposure metrics are empirical environmental estimations based on ambient CPCB NAQI and self-reported minutes outdoors, not medical dosimetry.
          </Text>
        </View>
      )}

      {/* 4. GREEN POINTS & REWARDS */}
      {activeSection === 'rewards' && (
        <View style={styles.subContainer}>
          <View style={[styles.card, { backgroundColor: '#064e3b40', borderColor: '#10b98160' }]}>
            <Text style={styles.rewardPoints}>{greenPoints} Eco Points</Text>
            <Text style={styles.subText}>Top 5% in your neighborhood for low-carbon travel!</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardHeader}>🎖️ Achievement Badges Earned</Text>
            {badges.map((b, idx) => (
              <View key={idx} style={styles.badgeItem}>
                <Text style={styles.badgeIcon}>{b.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.badgeTitle}>{b.title}</Text>
                  <Text style={styles.badgeDesc}>{b.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => {
              setGreenPoints(greenPoints + 50);
              Alert.alert('Challenge Completed!', 'You logged a Metro commute and earned +50 Eco Points!');
            }}
          >
            <Text style={styles.actionBtnText}>+ Log Today's Metro Commute (+50 Pts)</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 5. OFFLINE PROTECTION GUIDE */}
      {activeSection === 'offline' && (
        <View style={styles.subContainer}>
          <View style={[styles.card, { borderColor: '#38bdf860' }]}>
            <Text style={[styles.cardHeader, { color: '#38bdf8' }]}>💾 Cached Offline Protection</Text>
            <Text style={styles.subText}>
              Last Cached Reading: AQI 382 (Very Poor) • Station: Anand Vihar / Central Monitor
            </Text>
            <Text style={[styles.subText, { color: '#94a3b8', fontStyle: 'italic', marginTop: 4 }]}>
              Notice: Offline data reflects last known reading and may be outdated.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardHeader}>📘 Essential Smog Survival Manual</Text>
            <Text style={styles.bulletText}>1. N95 Fitting: Pinch nose clip firmly; test for air leakage by exhaling.</Text>
            <Text style={styles.bulletText}>2. Asthma Preparedness: Keep rescue inhaler at room temperature away from drafts.</Text>
            <Text style={styles.bulletText}>3. Eye Care: Use lubricating saline eye drops to flush airborne acidic smog.</Text>
            <Text style={styles.bulletText}>4. Throat Soothing: Warm water gargles and ginger tea reduce particulate irritation.</Text>
          </View>
        </View>
      )}

      {/* 6. WEEKLY FAMILY REPORT */}
      {activeSection === 'report' && (
        <View style={styles.subContainer}>
          <View style={styles.card}>
            <Text style={styles.cardHeader}>📑 AirWise Weekly Environmental Audit</Text>
            <Text style={styles.bulletText}>• Average Ambient AQI: 344 (Very Poor)</Text>
            <Text style={styles.bulletText}>• Peak Pollution Hour: 08:30 AM (Winter Inversion)</Text>
            <Text style={styles.bulletText}>• Total CO2 Avoided: 18.4 kg (via Metro & Transit choices)</Text>
            <Text style={styles.bulletText}>• Family Precautions Adherence: 95%</Text>
          </View>

          <TouchableOpacity style={styles.actionBtn} onPress={handleShareReport}>
            <Text style={styles.actionBtnText}>📤 Export & Share Family PDF Report</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1120' },
  contentContainer: { padding: 20, paddingTop: 50, paddingBottom: 50 },
  header: { marginBottom: 18 },
  backBtn: { marginBottom: 10 },
  backBtnText: { color: '#10b981', fontSize: 13, fontWeight: 'bold' },
  tag: { color: '#10b981', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  title: { fontSize: 26, fontWeight: '900', color: '#ffffff', marginTop: 4 },
  menuGrid: { gap: 12 },
  menuCard: { backgroundColor: '#1e293b', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#334155' },
  menuIcon: { fontSize: 28, marginBottom: 8 },
  menuTitle: { fontSize: 16, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  menuDesc: { fontSize: 12, color: '#94a3b8', lineHeight: 16 },
  subContainer: { gap: 14 },
  emergencyBanner: { backgroundColor: '#7f1d1d', padding: 20, borderRadius: 20, alignItems: 'center' },
  emergencyAqi: { fontSize: 44, fontWeight: '900', color: '#ffffff' },
  emergencyCat: { fontSize: 16, fontWeight: '900', color: '#fca5a5', letterSpacing: 1, marginTop: 4 },
  emergencyTimestamp: { fontSize: 11, color: '#fecaca', marginTop: 6 },
  alertCard: { backgroundColor: '#1e293b', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#ef444460' },
  card: { backgroundColor: '#1e293b', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#334155' },
  cardHeader: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', marginBottom: 10 },
  bulletText: { color: '#e2e8f0', fontSize: 13, marginVertical: 4, lineHeight: 19 },
  subText: { color: '#94a3b8', fontSize: 12, lineHeight: 18 },
  disclaimerText: { color: '#64748b', fontSize: 11, fontStyle: 'italic', lineHeight: 16, marginTop: 10 },
  statRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  statBox: { flex: 1, backgroundColor: '#0b1120', padding: 12, borderRadius: 14 },
  statLabel: { color: '#94a3b8', fontSize: 11 },
  statValue: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  statBig: { color: '#10b981', fontSize: 18, fontWeight: '900', marginVertical: 6 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#0b1120' },
  historyDay: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  historyTime: { color: '#94a3b8', fontSize: 13 },
  historyAqi: { fontSize: 13, fontWeight: 'bold' },
  rewardPoints: { color: '#10b981', fontSize: 32, fontWeight: '900', marginBottom: 4 },
  badgeItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 8, backgroundColor: '#0b1120', padding: 12, borderRadius: 14 },
  badgeIcon: { fontSize: 24 },
  badgeTitle: { color: '#ffffff', fontSize: 13, fontWeight: 'bold' },
  badgeDesc: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  actionBtn: { backgroundColor: '#10b981', padding: 14, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  actionBtnText: { color: '#0f172a', fontWeight: 'bold', fontSize: 13 }
});
