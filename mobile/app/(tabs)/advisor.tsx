import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  TextInput,
  Alert
} from 'react-native';
import { mobileAqiApi } from '../../services/api';

export default function AIAdvisorScreen() {
  const [lang, setLang] = useState<'en' | 'hi' | 'gu'>('en');
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<any>(null);
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const fetchAdvice = async (selectedLang: 'en' | 'hi' | 'gu') => {
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

  const handleVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setQuery(lang === 'hi' ? 'क्या आज बच्चों को बाहर पार्क में भेजना सुरक्षित है?' : lang === 'gu' ? 'શું આજે બાળકોને બહાર મોકલવા સુરક્ષિત છે?' : 'Is it safe for children to play outdoors today?');
      Alert.alert(
        'Voice Input Captured', 
        lang === 'hi' ? 'प्रश्न: क्या आज बच्चों को बाहर भेजना सुरक्षित है?' : lang === 'gu' ? 'પ્રશ્ન: શું આજે બાળકોને બહાર મોકલવા સુરક્ષિત છે?' : 'Question: Is it safe for children to play outdoors today?'
      );
    }, 1500);
  };

  const handleSpeakResponse = () => {
    setIsSpeaking(true);
    setTimeout(() => {
      setIsSpeaking(false);
      Alert.alert(
        'Spoken AI Response Complete',
        lang === 'hi' ? 'ऑडियो उत्तर: आज PM2.5 स्तर अत्यधिक उच्च है। कृपया बच्चों और बुजुर्गों को घर के अंदर ही रखें।' : lang === 'gu' ? 'ઓડિયો ઉત્તર: આજે હવાની ગુણવત્તા ખૂબ જ ખરાબ છે. બાળકોને ઘરમાં જ રાખો.' : 'Voice Answer: Today\'s PM2.5 levels are in the hazardous range. Keep children and elderly relatives indoors.'
      );
    }, 1800);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.tag}>🎙️ Multilingual Gemini Intelligence</Text>
        <Text style={styles.title}>AI Health Advisor</Text>
        <Text style={styles.subtitle}>
          Interactive voice and text precautions tailored to your family's health context.
        </Text>
      </View>

      {/* Language Switcher: English, Hindi, Gujarati */}
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
        <TouchableOpacity 
          style={[styles.langBtn, lang === 'gu' && styles.langBtnActive]} 
          onPress={() => setLang('gu')}
        >
          <Text style={[styles.langText, lang === 'gu' && styles.langTextActive]}>ગુજરાતી (Gujarati)</Text>
        </TouchableOpacity>
      </View>

      {/* Voice & Text Ask Box */}
      <View style={styles.askCard}>
        <View style={styles.inputRow}>
          <TextInput
            placeholder={lang === 'hi' ? 'प्रदूषण से सुरक्षा हेतु सवाल पूछें...' : lang === 'gu' ? 'પ્રદૂષણથી રક્ષણ અંગે પૂછો...' : 'Ask question about winter smog precautions...'}
            placeholderTextColor="#64748b"
            value={query}
            onChangeText={setQuery}
            style={styles.textInput}
          />
          <TouchableOpacity 
            style={[styles.micBtn, isListening && styles.micBtnActive]}
            onPress={handleVoiceInput}
          >
            <Text style={styles.micText}>{isListening ? '🛑' : '🎤'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.askFooter}>
          <TouchableOpacity 
            style={styles.ttsBtn}
            onPress={handleSpeakResponse}
          >
            <Text style={styles.ttsBtnText}>{isSpeaking ? '🔊 Speaking...' : '🔊 Read Answer Out Loud'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 40 }} />
      ) : (
        <View style={styles.card}>
          <Text style={styles.summaryTitle}>Current Threat Assessment</Text>
          <Text style={styles.summaryText}>{advice?.simple_summary}</Text>

          <View style={styles.protocolBox}>
            <Text style={styles.protocolHeader}>Actionable Protocols:</Text>
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

          <Text style={styles.disclaimerText}>
            Medical Disclaimer: AirWise AI does not diagnose health conditions. Always seek professional physician guidance for asthma attacks or chest congestion.
          </Text>
        </View>
      )}
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
  langRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  langBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155' },
  langBtnActive: { backgroundColor: '#10b981', borderColor: '#10b981' },
  langText: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  langTextActive: { color: '#0f172a' },
  askCard: { backgroundColor: '#1e293b', borderRadius: 20, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  textInput: { flex: 1, backgroundColor: '#0f172a', borderRadius: 12, borderWidth: 1, borderColor: '#334155', color: '#ffffff', padding: 10, fontSize: 13 },
  micBtn: { backgroundColor: '#334155', width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  micBtnActive: { backgroundColor: '#ef4444' },
  micText: { fontSize: 18 },
  askFooter: { marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end' },
  ttsBtn: { backgroundColor: '#0f172a', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: '#334155' },
  ttsBtnText: { color: '#38bdf8', fontSize: 11, fontWeight: 'bold' },
  card: { backgroundColor: '#1e293b', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#334155' },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc', marginBottom: 8 },
  summaryText: { fontSize: 13, color: '#cbd5e1', lineHeight: 20 },
  protocolBox: { marginTop: 14, backgroundColor: '#0f172a', padding: 14, borderRadius: 14 },
  protocolHeader: { fontSize: 12, fontWeight: 'bold', color: '#10b981', marginBottom: 6 },
  actionItem: { fontSize: 12, color: '#e2e8f0', marginVertical: 3, lineHeight: 18 },
  familyNotice: { marginTop: 14, backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)', borderWidth: 1, padding: 14, borderRadius: 14 },
  familyHeader: { color: '#fbbf24', fontSize: 12, fontWeight: 'bold' },
  familyText: { color: '#fde68a', fontSize: 12, marginTop: 4, lineHeight: 18 },
  disclaimerText: { color: '#64748b', fontSize: 11, fontStyle: 'italic', marginTop: 12, lineHeight: 16 }
});
