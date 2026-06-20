import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useAuth } from '../../../src/store/AuthContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { User } from '@ecoflow/shared-types';
import { api } from '../../../src/store/AuthContext';

export default function AdminUsersScreen() {
  const colorScheme = useColorScheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: User }) => (
    <View style={[styles.card, { backgroundColor: Colors[colorScheme].background, borderColor: Colors[colorScheme].tint + '40' }]}>
      <Text style={[styles.name, { color: Colors[colorScheme].text }]}>{item.full_name}</Text>
      <Text style={[styles.role, { color: Colors[colorScheme].tabIconDefault }]}>{item.role?.role_name || 'No Role'}</Text>
      <Text style={[styles.email, { color: Colors[colorScheme].tabIconDefault }]}>{item.email}</Text>
      <View style={[styles.statusBadge, { backgroundColor: item.status === 'ACTIVE' ? '#0f766e20' : '#ba1a1a20' }]}>
        <Text style={[styles.statusText, { color: item.status === 'ACTIVE' ? '#0f766e' : '#ba1a1a' }]}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  list: { paddingBottom: 20 },
  card: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  role: { fontSize: 14, marginBottom: 2 },
  email: { fontSize: 12, marginBottom: 8 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: 'bold' }
});
