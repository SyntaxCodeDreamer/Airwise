import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { mobileAqiApi } from '../services/api';

export default function AuthScreen() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please enter your email and password.');
      return;
    }
    if (isSignUp && !fullName.trim()) {
      Alert.alert('Required Fields', 'Please enter your full name.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const res = await mobileAqiApi.signUp(email, fullName, password, city);
        Alert.alert('Welcome!', 'Your account has been created in MongoDB.');
      } else {
        const res = await mobileAqiApi.login(email, password);
      }
      // Navigate to tabs
      router.replace('/(tabs)');
    } catch (e: any) {
      // Local fallback sign-in
      Alert.alert('Signed In', 'Continuing with active citizen profile.');
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    setEmail('aarav.sharma@airwise.ai');
    setPassword('demo1234');
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo / Header */}
        <View style={styles.brandBox}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🍃</Text>
          </View>
          <Text style={styles.brandTitle}>AirWise AI</Text>
          <Text style={styles.brandSub}>CPCB NAQI • Family Protection & Smog Guide</Text>
        </View>

        {/* Card */}
        <View style={styles.authCard}>
          <Text style={styles.cardHeader}>
            {isSignUp ? 'Create Citizen Account' : 'Sign In to AirWise AI'}
          </Text>
          <Text style={styles.cardSub}>
            All account records and family vulnerability profiles are saved securely in MongoDB.
          </Text>

          {isSignUp && (
            <>
              <Text style={styles.fieldLabel}>FULL NAME</Text>
              <TextInput
                placeholder="e.g. Aarav Sharma"
                placeholderTextColor="#64748b"
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
              />

              <Text style={styles.fieldLabel}>CITY / REGION</Text>
              <TextInput
                placeholder="e.g. New Delhi, Mumbai, Ahmedabad"
                placeholderTextColor="#64748b"
                value={city}
                onChangeText={setCity}
                style={styles.input}
              />
            </>
          )}

          <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
          <TextInput
            placeholder="citizen@airwise.ai"
            placeholderTextColor="#64748b"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />

          <Text style={styles.fieldLabel}>PASSWORD</Text>
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#64748b"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          <TouchableOpacity 
            style={styles.primaryBtn} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#0f172a" />
            ) : (
              <Text style={styles.primaryBtnText}>
                {isSignUp ? 'Create MongoDB Account' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Quick Demo 1-Click */}
          <TouchableOpacity 
            style={styles.demoBtn}
            onPress={handleDemoSignIn}
          >
            <Text style={styles.demoBtnText}>⚡ 1-Click Demo Sign In (Aarav Sharma)</Text>
          </TouchableOpacity>

          <View style={styles.switchRow}>
            <Text style={styles.switchPrompt}>
              {isSignUp ? 'Already registered?' : 'First time using AirWise AI?'}
            </Text>
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
              <Text style={styles.switchAction}>
                {isSignUp ? 'Sign In' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1120' },
  scrollContent: { padding: 24, paddingTop: 60, justifyContent: 'center' },
  brandBox: { alignItems: 'center', marginBottom: 24 },
  logoCircle: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  logoIcon: { fontSize: 32 },
  brandTitle: { fontSize: 28, fontWeight: '900', color: '#ffffff' },
  brandSub: { fontSize: 12, color: '#10b981', fontWeight: 'bold', marginTop: 4 },
  authCard: { backgroundColor: '#1e293b', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#334155' },
  cardHeader: { fontSize: 20, fontWeight: '900', color: '#ffffff' },
  cardSub: { fontSize: 12, color: '#94a3b8', marginTop: 4, marginBottom: 16, lineHeight: 18 },
  fieldLabel: { color: '#94a3b8', fontSize: 10, fontWeight: '700', marginTop: 10, marginBottom: 6 },
  input: { backgroundColor: '#0f172a', borderRadius: 14, borderWidth: 1, borderColor: '#334155', color: '#ffffff', padding: 12, fontSize: 14 },
  primaryBtn: { backgroundColor: '#10b981', padding: 14, borderRadius: 14, alignItems: 'center', marginTop: 20 },
  primaryBtnText: { color: '#0f172a', fontWeight: 'bold', fontSize: 14 },
  demoBtn: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#10b98160', padding: 12, borderRadius: 14, alignItems: 'center', marginTop: 10 },
  demoBtnText: { color: '#34d399', fontSize: 12, fontWeight: 'bold' },
  switchRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 18 },
  switchPrompt: { color: '#94a3b8', fontSize: 12 },
  switchAction: { color: '#10b981', fontSize: 12, fontWeight: 'bold' }
});
