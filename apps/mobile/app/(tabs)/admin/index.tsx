import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { User, Role } from '@ecoflow/shared-types';
import { api } from '../../../src/store/AuthContext';
import { SymbolView } from 'expo-symbols';

export default function AdminScreen() {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme].tint;
  const textColor = Colors[colorScheme].text;
  const bgColor = Colors[colorScheme].background;
  const subTextColor = Colors[colorScheme].tabIconDefault;

  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const res = await api.get('/users');
        setUsers(res.data);
      } else {
        const res = await api.get('/roles');
        setRoles(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={[styles.card, { backgroundColor: bgColor, borderColor: tintColor + '20' }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.avatarCircle, { backgroundColor: tintColor + '15' }]}>
          <Text style={[styles.avatarText, { color: tintColor }]}>
            {item.full_name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={[styles.name, { color: textColor }]}>{item.full_name}</Text>
          <Text style={[styles.email, { color: subTextColor }]}>{item.email}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.cardFooter}>
        <View style={[styles.roleBadge, { backgroundColor: tintColor + '10' }]}>
          <SymbolView name="person.fill" size={12} tintColor={tintColor} />
          <Text style={[styles.roleText, { color: tintColor }]}>{item.role?.role_name || 'No Role'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'ACTIVE' ? '#10B98115' : '#EF444415' }]}>
          <View style={[styles.statusDot, { backgroundColor: item.status === 'ACTIVE' ? '#10B981' : '#EF4444' }]} />
          <Text style={[styles.statusText, { color: item.status === 'ACTIVE' ? '#10B981' : '#EF4444' }]}>{item.status}</Text>
        </View>
      </View>
    </View>
  );

  const renderRoleItem = ({ item }: { item: Role }) => (
    <View style={[styles.card, { backgroundColor: bgColor, borderColor: tintColor + '20' }]}>
      <View style={styles.roleCardContent}>
        <View style={[styles.iconContainer, { backgroundColor: tintColor + '15' }]}>
          <SymbolView name="shield.fill" size={20} tintColor={tintColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.roleName, { color: textColor }]}>{item.role_name}</Text>
          <Text style={[styles.description, { color: subTextColor }]}>{item.description || 'No description provided'}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'User Administration' }} />
      
      {/* Premium Segmented Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'users' && { backgroundColor: tintColor }]}
          onPress={() => setActiveTab('users')}
        >
          <SymbolView name="person.2.fill" size={16} tintColor={activeTab === 'users' ? '#FFFFFF' : subTextColor} />
          <Text style={[styles.tabText, { color: activeTab === 'users' ? '#FFFFFF' : subTextColor }]}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'roles' && { backgroundColor: tintColor }]}
          onPress={() => setActiveTab('roles')}
        >
          <SymbolView name="shield.fill" size={16} tintColor={activeTab === 'roles' ? '#FFFFFF' : subTextColor} />
          <Text style={[styles.tabText, { color: activeTab === 'roles' ? '#FFFFFF' : subTextColor }]}>Roles</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={tintColor} />
        </View>
      ) : (
        <FlatList
          data={(activeTab === 'users' ? users : roles) as any[]}
          keyExtractor={(item: any) => item.id}
          renderItem={activeTab === 'users' ? (renderUserItem as any) : (renderRoleItem as any)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <SymbolView name="square.dashed" size={48} tintColor={subTextColor} />
              <Text style={[styles.emptyText, { color: subTextColor }]}>No records found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  tabText: { fontSize: 14, fontWeight: 'bold' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingBottom: 20 },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 16, fontWeight: 'bold' },
  cardHeaderText: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  email: { fontSize: 13, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  roleBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 6 },
  roleText: { fontSize: 12, fontWeight: 'bold' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' },
  
  roleCardContent: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconContainer: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  roleName: { fontSize: 16, fontWeight: 'bold' },
  description: { fontSize: 13, marginTop: 4, lineHeight: 18 },
  
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 15, fontWeight: '500' },
});
