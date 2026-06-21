import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/store/AuthContext';
import { SymbolView } from 'expo-symbols';

export default function PendingScreen() {
  const { user, logout } = useAuth();
  const [checking, setChecking] = React.useState(false);

  const handleRefresh = async () => {
    setChecking(true);
    // Mimic checking by doing a small timeout or logout/re-login flow
    setTimeout(() => {
      setChecking(false);
      alert('Your account is still pending admin review. We will notify you once approved.');
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <SymbolView name="clock.fill" size={64} tintColor="#F59E0B" />
        </View>
        <Text style={styles.title}>Account Pending Approval</Text>
        <Text style={styles.subtitle}>
          Hi {user?.full_name || 'there'}, your account is currently pending activation by a system administrator.
        </Text>
        <Text style={styles.infoText}>
          We will review your registration details shortly. Please check back later or contact your system administrator.
        </Text>

        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={handleRefresh}
          disabled={checking}
        >
          {checking ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <SymbolView name="arrow.clockwise" size={18} tintColor="white" />
              <Text style={styles.refreshText}>Check Status</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
          <SymbolView name="rectangle.portrait.and.arrow.right.fill" size={18} tintColor="#EF4444" />
          <Text style={styles.logoutText}>Return to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 32,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    height: 52,
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    marginBottom: 12,
  },
  refreshText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
