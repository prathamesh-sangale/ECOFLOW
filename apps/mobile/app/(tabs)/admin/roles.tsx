import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useAuth } from '../../../src/store/AuthContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Role } from '@ecoflow/shared-types';
import { api } from '../../../src/store/AuthContext';

export default function AdminRolesScreen() {
  const colorScheme = useColorScheme();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await api.get('/roles');
      setRoles(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Role }) => (
    <View style={[styles.card, { backgroundColor: Colors[colorScheme].background, borderColor: Colors[colorScheme].tint + '40' }]}>
      <Text style={[styles.roleName, { color: Colors[colorScheme].text }]}>{item.role_name}</Text>
      <Text style={[styles.description, { color: Colors[colorScheme].tabIconDefault }]}>{item.description || 'No description'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
      ) : (
        <FlatList
          data={roles}
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
  roleName: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  description: { fontSize: 14 }
});
