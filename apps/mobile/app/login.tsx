import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth, api } from '../src/store/AuthContext';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      await login(res.data.accessToken, res.data.refreshToken, res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMockLogin = async (mockEmail: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email: mockEmail, password: 'Password123!' });
      await login(res.data.accessToken, res.data.refreshToken, res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Mock login failed. Is backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometric = () => {
    // Biometric Placeholder
    alert('Biometric login would trigger here.');
  };

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoIconBg}>
          <SymbolView name="leaf.fill" size={32} tintColor="#005c55" />
        </View>
        <Text style={styles.title}>ECOFlow</Text>
      </View>
      <Text style={styles.subtitle}>Mastering Precision in Furniture Engineering</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#8e9a97"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#8e9a97"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Secure Login</Text>
        )}
      </TouchableOpacity>

      <View style={styles.mockContainer}>
        <View style={styles.infoBanner}>
          <SymbolView name="info.circle" size={16} tintColor="#005c55" />
          <Text style={styles.infoText}>Development Mode: Quick role login</Text>
        </View>
        
        <TouchableOpacity style={[styles.mockBtn, { borderColor: '#005c5530', backgroundColor: '#005c5508' }]} onPress={() => handleMockLogin('admin@ecoflow.com')} disabled={loading}>
          <View style={[styles.mockIconContainer, { backgroundColor: '#005c5515' }]}>
            <SymbolView name="shield.fill" size={20} tintColor="#005c55" />
          </View>
          <View style={styles.mockTextContainer}>
            <Text style={[styles.mockRole, { color: '#005c55' }]}>Admin</Text>
            <Text style={styles.mockDesc}>System Configuration & Audit</Text>
          </View>
          <SymbolView name="chevron.right" size={16} tintColor="#005c55" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.mockBtn, { borderColor: '#4e626030', backgroundColor: '#4e626008' }]} onPress={() => handleMockLogin('engineer1@ecoflow.com')} disabled={loading}>
          <View style={[styles.mockIconContainer, { backgroundColor: '#4e626015' }]}>
            <SymbolView name="hammer.fill" size={20} tintColor="#4e6260" />
          </View>
          <View style={styles.mockTextContainer}>
            <Text style={[styles.mockRole, { color: '#4e6260' }]}>Engineer</Text>
            <Text style={styles.mockDesc}>ECO Creation & BOMs</Text>
          </View>
          <SymbolView name="chevron.right" size={16} tintColor="#4e6260" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.mockBtn, { borderColor: '#7f402530', backgroundColor: '#7f402508' }]} onPress={() => handleMockLogin('approver@ecoflow.com')} disabled={loading}>
          <View style={[styles.mockIconContainer, { backgroundColor: '#7f402515' }]}>
            <SymbolView name="checkmark.seal.fill" size={20} tintColor="#7f4025" />
          </View>
          <View style={styles.mockTextContainer}>
            <Text style={[styles.mockRole, { color: '#7f4025' }]}>Approver</Text>
            <Text style={styles.mockDesc}>Review & Approval Queue</Text>
          </View>
          <SymbolView name="chevron.right" size={16} tintColor="#7f4025" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.mockBtn, { borderColor: '#10B98130', backgroundColor: '#10B98108' }]} onPress={() => handleMockLogin('production@ecoflow.com')} disabled={loading}>
          <View style={[styles.mockIconContainer, { backgroundColor: '#10B98115' }]}>
            <SymbolView name="gearshape.2.fill" size={20} tintColor="#10B981" />
          </View>
          <View style={styles.mockTextContainer}>
            <Text style={[styles.mockRole, { color: '#10B981' }]}>Production</Text>
            <Text style={styles.mockDesc}>Manufacturing Releases</Text>
          </View>
          <SymbolView name="chevron.right" size={16} tintColor="#10B981" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: '#f7faf8' },
  container: { padding: 24, paddingVertical: 48, justifyContent: 'center', backgroundColor: '#f7faf8' },
  logoContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 },
  logoIconBg: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#005c5515', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: '#005c55', textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#4e6260', textAlign: 'center', marginBottom: 36, fontWeight: '500', paddingHorizontal: 16 },
  inputContainer: { marginBottom: 24, gap: 14 },
  input: { height: 54, borderWidth: 1, borderColor: '#bdc9c6', borderRadius: 14, paddingHorizontal: 16, backgroundColor: '#FFFFFF', fontSize: 16, color: '#181c1c' },
  button: { height: 54, backgroundColor: '#005c55', borderRadius: 14, justifyContent: 'center', alignItems: 'center', shadowColor: '#005c55', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 4 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  error: { color: '#ba1a1a', marginBottom: 24, textAlign: 'center', backgroundColor: '#ffdad6', padding: 12, borderRadius: 10, overflow: 'hidden', fontWeight: '600' },
  mockContainer: { marginTop: 24, paddingTop: 24, borderTopWidth: 1, borderTopColor: '#bdc9c6', gap: 12 },
  infoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#005c5508', padding: 12, borderRadius: 10, gap: 8, marginBottom: 8 },
  infoText: { fontSize: 12, color: '#005c55', fontWeight: '600' },
  mockBtn: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, borderWidth: 1, gap: 14 },
  mockIconContainer: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  mockTextContainer: { flex: 1 },
  mockRole: { fontSize: 15, fontWeight: '700' },
  mockDesc: { fontSize: 12, color: '#4e6260', marginTop: 2 }
});
