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

  const handleSwitchAccount = () => {
    Alert.alert(
      "Switch Account",
      "You will be logged out to switch accounts. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Switch", style: "default", onPress: () => logout() }
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
            <View style={styles.iconBox}><SymbolView name="envelope.fill" size={20} tintColor="#4e6260" /></View>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Email</Text>
              <Text style={styles.rowValue}>{user?.email || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.iconBox}><SymbolView name="building.2.fill" size={20} tintColor="#4e6260" /></View>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Department</Text>
              <Text style={styles.rowValue}>Engineering</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow} onPress={handlePasswordChange}>
            <View style={[styles.iconBox, { backgroundColor: '#005c5515' }]}><SymbolView name="lock.fill" size={20} tintColor="#005c55" /></View>
            <Text style={styles.actionText}>Change Password</Text>
            <SymbolView name="chevron.right" size={20} tintColor="#bdc9c6" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionRow}>
            <View style={[styles.iconBox, { backgroundColor: '#10B98115' }]}><SymbolView name="faceid" size={20} tintColor="#10B981" /></View>
            <Text style={styles.actionText}>Enable Biometric Login</Text>
            <SymbolView name="chevron.right" size={20} tintColor="#bdc9c6" />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
          <TouchableOpacity style={[styles.logoutButton, { flex: 1, backgroundColor: '#4e626015' }]} onPress={handleSwitchAccount}>
            <SymbolView name="person.2.fill" size={20} tintColor="#4e6260" />
            <Text style={[styles.logoutText, { color: '#4e6260' }]}>Switch</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.logoutButton, { flex: 1 }]} onPress={handleLogout}>
            <SymbolView name="rectangle.portrait.and.arrow.right.fill" size={20} tintColor="#EF4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7faf8' },
  content: { padding: 16 },
  headerCard: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 20, alignItems: 'center', shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#005c55', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF' },
  name: { fontSize: 22, fontWeight: '800', color: '#181c1c' },
  role: { fontSize: 15, color: '#4e6260', marginTop: 4, fontWeight: '500' },
  
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#181c1c', marginBottom: 12, marginLeft: 4 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1, marginBottom: 24 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f1f4f3', justifyContent: 'center', alignItems: 'center' },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: 12, color: '#4e6260', marginBottom: 2 },
  rowValue: { fontSize: 15, fontWeight: '600', color: '#181c1c' },
  divider: { height: 1, backgroundColor: '#f1f4f3', marginVertical: 16 },
  
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  actionText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#181c1c' },
  
  logoutButton: { flexDirection: 'row', backgroundColor: '#FEF2F2', padding: 16, borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 8 },
  logoutText: { color: '#EF4444', fontSize: 15, fontWeight: 'bold' }
});
