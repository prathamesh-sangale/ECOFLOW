import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
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

  const handleBiometric = () => {
    // Biometric Placeholder
    alert('Biometric login would trigger here.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <SymbolView name="leaf.fill" size={48} tintColor="#10B981" />
        <Text style={styles.title}>ECOFlow</Text>
      </View>
      <Text style={styles.subtitle}>Welcome Back</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#94A3B8"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#94A3B8"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Secure Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.biometricButton} onPress={handleBiometric}>
        <SymbolView name="faceid" size={24} tintColor="#4F46E5" />
        <Text style={styles.biometricText}>Login with Face ID</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/request-access')}>
        <Text style={styles.link}>Request Access / Help</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#F8FAFC' },
  logoContainer: { alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 32, fontWeight: '800', color: '#1E293B', textAlign: 'center', marginTop: 12 },
  subtitle: { fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 40, fontWeight: '500' },
  inputContainer: { marginBottom: 24, gap: 16 },
  input: { height: 52, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 16, backgroundColor: '#FFFFFF', fontSize: 16, color: '#1E293B' },
  button: { height: 52, backgroundColor: '#4F46E5', borderRadius: 12, justifyContent: 'center', alignItems: 'center', shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  biometricButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52, marginTop: 16, backgroundColor: '#EEF2FF', borderRadius: 12 },
  biometricText: { color: '#4F46E5', fontWeight: 'bold', fontSize: 16 },
  error: { color: '#EF4444', marginBottom: 24, textAlign: 'center', backgroundColor: '#FEF2F2', padding: 12, borderRadius: 8, overflow: 'hidden' },
  link: { color: '#64748B', textAlign: 'center', marginTop: 32, fontWeight: '600' }
});
