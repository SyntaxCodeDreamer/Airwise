import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { mobileAqiApi } from '../../services/api';

export default function AIAdvisorScreen() {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<any>(null);

  const fetchAdvice = async (selectedLang: 'en' | 'hi') => {
    setLoading(true);
    try {
      const data = await mobileAqiApi.getAIAdvice(382, selectedLang);
      setAdvice(data);
    } catch (e) {
      console.log('Error fetching AI advice:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice(lang);
  }, [lang]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Gemini AI Advisor</Text>
        <Text style={styles.subtitle}>Family Environmental Health Protection</Text>
      </View>

      {/* Language Switcher */}
      <View style={styles.langRow}>
        <TouchableOpacity 
          style={[styles.langBtn, lang === 'en' && styles.langBtnActive]} 
          onPress={() => setLang('en')}
        >
          <Text style={[styles.langText, lang === 'en' && styles.langTextActive]}>English</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.langBtn, lang === 'hi' && styles.langBtnActive]} 
          onPress={() => setLang('hi')}
        >
          <Text style={[styles.langText, lang === 'hi' && styles.langTextActive]}>हिंदी (Hindi)</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 40 }} />
      ) : (
        <View style={styles.card}>
          <Text style={styles.summaryTitle}>Current Threat Assessment</Text>
          <Text style={styles.summaryText}>{advice?.simple_summary}</Text>

          <View style={styles.protocolBox}>
            <Text style={styles.protocolHeader}>Actionable Protocol:</Text>
            {advice?.immediate_actions?.map((act: string, idx: number) => (
              <Text key={idx} style={styles.actionItem}>• {act}</Text>
            ))}
          </View>

          {/* Indoor Air Quality Hacks */}
          <View style={[styles.protocolBox, { backgroundColor: '#062828', borderColor: '#10b98133', borderWidth: 1 }]}>
            <Text style={[styles.protocolHeader, { color: '#34d399' }]}>🌿 Indoor Air Quality Hacks:</Text>
            {advice?.indoor_tips?.map((tip: string, idx: number) => (
              <Text key={idx} style={styles.actionItem}>• {tip}</Text>
            ))}
          </View>

          <View style={styles.familyNotice}>
            <Text style={styles.familyHeader}>👨‍👩‍👧 Family Alert:</Text>
            <Text style={styles.familyText}>{advice?.vulnerable_guidance}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1120' },
  contentContainer: { padding: 20, paddingTop: 50, paddingBottom: 40 },
  header: { marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '900', color: '#ffffff' },
  subtitle: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
  langRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  langBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#1e293b' },
  langBtnActive: { backgroundColor: '#10b981' },
  langText: { color: '#94a3b8', fontSize: 13, fontWeight: 'bold' },
  langTextActive: { color: '#0f172a' },
  card: { backgroundColor: '#1e293b', borderRadius: 20, padding: 20 },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc', marginBottom: 8 },
  summaryText: { fontSize: 13, color: '#cbd5e1', lineHeight: 20 },
  protocolBox: { marginTop: 14, backgroundColor: '#0f172a', padding: 14, borderRadius: 14 },
  protocolHeader: { fontSize: 12, fontWeight: 'bold', color: '#10b981', marginBottom: 6 },
  actionItem: { fontSize: 12, color: '#e2e8f0', marginVertical: 3, lineHeight: 18 },
  familyNotice: { marginTop: 14, backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)', borderWidth: 1, padding: 14, borderRadius: 14 },
  familyHeader: { color: '#fbbf24', fontSize: 12, fontWeight: 'bold' },
  familyText: { color: '#fde68a', fontSize: 12, marginTop: 4, lineHeight: 18 }
});
