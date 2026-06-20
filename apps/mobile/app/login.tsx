import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useAuth, api } from '../src/store/AuthContext';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email, password });
      await login(res.data.accessToken, res.data.refreshToken, res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ECOFlow</Text>
      <Text style={styles.subtitle}>Welcome Back</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Secure Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/request-access')}>
        <Text style={styles.link}>Request Access</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#f7faf8' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#005c55', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#3e4947', textAlign: 'center', marginBottom: 32 },
  input: { height: 48, borderWidth: 1, borderColor: '#bdc9c6', borderRadius: 8, paddingHorizontal: 16, marginBottom: 16, backgroundColor: '#f1f4f3' },
  button: { height: 48, backgroundColor: '#005c55', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  error: { color: '#ba1a1a', marginBottom: 16, textAlign: 'center' },
  link: { color: '#005c55', textAlign: 'center', marginTop: 24, fontWeight: 'bold' }
});
