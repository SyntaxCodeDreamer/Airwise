import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Linking,
  Alert
} from 'react-native';

export default function PlannerScreen() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Morning Commute (Metro / Rail Recommended)', time: '08:30 AM', completed: true, window: 'Safe in Metro' },
    { id: 2, title: 'Indoor Work / Study with HEPA Purifier', time: '10:00 AM - 01:00 PM', completed: true, window: 'Sealed Indoor' },
    { id: 3, title: 'Home Ventilation & Grocery Errands', time: '01:30 PM - 03:00 PM', completed: false, window: 'Cleanest Midday Window' },
    { id: 4, title: 'Evening School Pickup (N95 Mask Needed)', time: '04:30 PM', completed: false, window: 'Smog Inversion Rising' },
    { id: 5, title: 'Night Family Indoor Relaxation (Purifier Medium)', time: '08:00 PM', completed: false, window: 'Severe Night Inversion' }
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleShareWhatsApp = () => {
    const msg = `📢 *AirWise AI 48-Hour Smog & Clean Air Advisory for Our Society*\n📍 Location: New Delhi\n⚠️ Current AQI: 382 (Very Poor / High Health Alert)\n\n☀️ *Cleanest Outdoor Window:* 1:00 PM – 3:30 PM (Midday Solar Dispersion - Safest for walks & errands)\n🚫 *Dirtiest Hazard Windows:* 6:00 AM – 8:30 AM & 8:00 PM – 11:00 PM (Heavy ground temperature inversion)\n\n🛡️ *Society Guidelines:*\n• Avoid morning jogs/walks; seniors and children should remain in filtered indoors\n• Strictly prevent leaf/garbage burning in society compound\n• Carpool or take Metro to cut local vehicular particulate emissions\n\nStay safe and breathe clean with AirWise AI!`;
    const url = `whatsapp://send?text=${encodeURIComponent(msg)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('WhatsApp Share', 'Advisory copied to clipboard. Share directly with your society group!');
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.tag}>📅 48-Hour Smog Routine</Text>
        <Text style={styles.title}>AI Daily Planner</Text>
        <Text style={styles.subtitle}>
          Hour-by-hour 48-hour plan identifying cleanest and dirtiest windows for family outdoor activity.
        </Text>
      </View>

      {/* Cleanest vs Dirtiest Window Highlight */}
      <View style={styles.windowGrid}>
        <View style={styles.cleanWindowCard}>
          <Text style={styles.cleanTag}>☀️ CLEANEST TIME WINDOW (48H)</Text>
          <Text style={styles.cleanTime}>01:00 PM – 03:30 PM</Text>
          <Text style={styles.cleanDesc}>
            Thermal inversion disperses midday. Best slot for dog walking, errands, and brief home airing.
          </Text>
        </View>

        <View style={styles.dirtyWindowCard}>
          <Text style={styles.dirtyTag}>🚫 DIRTIEST / HAZARD WINDOW</Text>
          <Text style={styles.dirtyTime}>06:00 AM – 08:30 AM & 8 – 11 PM</Text>
          <Text style={styles.dirtyDesc}>
            Cold air layer traps toxic vehicular & biomass smoke. Zero outdoor jogging or cardio.
          </Text>
        </View>
      </View>

      {/* WhatsApp Society Broadcast Button */}
      <TouchableOpacity style={styles.whatsappBtn} onPress={handleShareWhatsApp}>
        <Text style={styles.whatsappBtnText}>💬 Share 48-Hour Plan with Society on WhatsApp</Text>
      </TouchableOpacity>

      {/* Task Checklist */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>Hour-by-Hour Actionable Schedule</Text>
        
        {tasks.map((task) => (
          <TouchableOpacity 
            key={task.id} 
            style={[styles.taskItem, task.completed && styles.taskCompleted]}
            onPress={() => toggleTask(task.id)}
          >
            <View style={[styles.checkbox, task.completed && styles.checkboxChecked]}>
              {task.completed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                {task.title}
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.taskTime}>⏰ {task.time}</Text>
                <Text style={styles.taskWindow}>• {task.window}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* 48-Hour Outlook Breakdown */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>48-Hour Timeline Forecast</Text>
        <View style={styles.timelineBox}>
          <Text style={styles.timelineDay}>Day 1 (Next 24h)</Text>
          <Text style={styles.timelineText}>• Peak Inversion: 430 AQI (07:30 AM)</Text>
          <Text style={styles.timelineText}>• Best Dispersal: 245 AQI (02:00 PM)</Text>
          <Text style={styles.timelineText}>• Night Re-accumulation: 390 AQI (09:00 PM)</Text>
        </View>
        <View style={[styles.timelineBox, { marginTop: 10 }]}>
          <Text style={styles.timelineDay}>Day 2 (24h - 48h)</Text>
          <Text style={styles.timelineText}>• Morning Smog: 415 AQI (08:00 AM)</Text>
          <Text style={styles.timelineText}>• Afternoon Window: 260 AQI (02:30 PM)</Text>
          <Text style={styles.timelineText}>• Commute: Sealed AC Metro coach recommended</Text>
        </View>
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
  windowGrid: { gap: 12, marginBottom: 16 },
  cleanWindowCard: { backgroundColor: '#064e3b40', borderColor: '#10b98160', borderWidth: 1, borderRadius: 20, padding: 16 },
  cleanTag: { color: '#34d399', fontSize: 10, fontWeight: 'bold' },
  cleanTime: { color: '#ffffff', fontSize: 18, fontWeight: '900', marginVertical: 4 },
  cleanDesc: { color: '#a7f3d0', fontSize: 12, lineHeight: 17 },
  dirtyWindowCard: { backgroundColor: '#7f1d1d40', borderColor: '#ef444460', borderWidth: 1, borderRadius: 20, padding: 16 },
  dirtyTag: { color: '#f87171', fontSize: 10, fontWeight: 'bold' },
  dirtyTime: { color: '#ffffff', fontSize: 18, fontWeight: '900', marginVertical: 4 },
  dirtyDesc: { color: '#fecaca', fontSize: 12, lineHeight: 17 },
  whatsappBtn: { backgroundColor: '#10b981', padding: 14, borderRadius: 16, alignItems: 'center', marginBottom: 16 },
  whatsappBtnText: { color: '#0f172a', fontWeight: 'bold', fontSize: 13 },
  card: { backgroundColor: '#1e293b', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#334155', marginBottom: 16 },
  cardHeader: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', marginBottom: 14 },
  taskItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#0f172a' },
  taskCompleted: { opacity: 0.6 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#64748b', alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#10b981', borderColor: '#10b981' },
  checkmark: { color: '#0f172a', fontWeight: 'bold', fontSize: 12 },
  taskTitle: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  taskTitleCompleted: { textDecorationLine: 'line-through', color: '#94a3b8' },
  metaRow: { flexDirection: 'row', gap: 8, marginTop: 3 },
  taskTime: { color: '#38bdf8', fontSize: 11 },
  taskWindow: { color: '#10b981', fontSize: 11, fontWeight: '500' },
  timelineBox: { backgroundColor: '#0f172a', padding: 12, borderRadius: 14 },
  timelineDay: { color: '#38bdf8', fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  timelineText: { color: '#cbd5e1', fontSize: 11, lineHeight: 17 }
});
