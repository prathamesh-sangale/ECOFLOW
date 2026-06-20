import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../../src/store/AuthContext';
import { SymbolView } from 'expo-symbols';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: () => logout() }
      ]
    );
  };

  const handlePasswordChange = () => {
    alert("Navigate to Password Change Screen");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.full_name?.charAt(0) || 'U'}</Text>
          </View>
          <Text style={styles.name}>{user?.full_name || 'User'}</Text>
          <Text style={styles.role}>{user?.role?.role_name || 'No Role'}</Text>
        </View>

        <Text style={styles.sectionTitle}>Account Details</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconBox}><SymbolView name="envelope.fill" size={20} tintColor="#64748B" /></View>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Email</Text>
              <Text style={styles.rowValue}>{user?.email || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.iconBox}><SymbolView name="building.2.fill" size={20} tintColor="#64748B" /></View>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Department</Text>
              <Text style={styles.rowValue}>Engineering</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow} onPress={handlePasswordChange}>
            <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}><SymbolView name="lock.fill" size={20} tintColor="#4F46E5" /></View>
            <Text style={styles.actionText}>Change Password</Text>
            <SymbolView name="chevron.right" size={20} tintColor="#CBD5E1" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionRow}>
            <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}><SymbolView name="faceid" size={20} tintColor="#10B981" /></View>
            <Text style={styles.actionText}>Enable Biometric Login</Text>
            <SymbolView name="chevron.right" size={20} tintColor="#CBD5E1" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <SymbolView name="rectangle.portrait.and.arrow.right.fill" size={20} tintColor="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16 },
  headerCard: { backgroundColor: '#FFFFFF', padding: 32, borderRadius: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#4F46E5', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF' },
  name: { fontSize: 24, fontWeight: '800', color: '#1E293B' },
  role: { fontSize: 16, color: '#64748B', marginTop: 4, fontWeight: '500' },
  
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 12, marginLeft: 4 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1, marginBottom: 24 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: 12, color: '#64748B', marginBottom: 2 },
  rowValue: { fontSize: 16, fontWeight: '600', color: '#1E293B' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
  
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  actionText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#1E293B' },
  
  logoutButton: { flexDirection: 'row', backgroundColor: '#FEF2F2', padding: 16, borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 8 },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: 'bold' }
});
