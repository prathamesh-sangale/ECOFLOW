import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../src/store/AuthContext';
import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import { format } from 'date-fns';

export default function ReleasesScreen() {
  const [search, setSearch] = useState('');

  const { data: releases, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['releases'],
    queryFn: async () => {
      const res = await api.get('/releases');
      return res.data;
    }
  });

  const filteredReleases = releases?.filter((r: any) => 
    r.release_notes?.toLowerCase().includes(search.toLowerCase()) ||
    r.product?.product_name?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/(tabs)/versions/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <SymbolView name="archivebox.fill" size={20} tintColor="#4F46E5" />
        </View>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{item.product?.product_name}</Text>
          <Text style={styles.cardSubtitle}>v{item.version?.version_number}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Released</Text>
        </View>
      </View>
      
      <View style={styles.cardBody}>
        <Text style={styles.notesText} numberOfLines={2}>{item.release_notes || 'No release notes.'}</Text>
        <View style={styles.infoRow}>
          <SymbolView name="calendar" size={14} tintColor="#94A3B8" />
          <Text style={styles.infoText}>Released on {format(new Date(item.released_at), 'MMM d, yyyy')}</Text>
        </View>
        <View style={styles.infoRow}>
          <SymbolView name="person.fill" size={14} tintColor="#94A3B8" />
          <Text style={styles.infoText}>By {item.released_by?.full_name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SymbolView name="magnifyingglass" size={20} tintColor="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search releases..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#94A3B8"
        />
      </View>

      {isLoading ? (
        <View style={styles.centered}><ActivityIndicator size="large" color="#4F46E5" /></View>
      ) : error ? (
        <View style={styles.centered}><Text style={styles.errorText}>Error fetching releases</Text></View>
      ) : (
        <FlatList
          data={filteredReleases}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#4F46E5" />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <SymbolView name="archivebox" size={48} tintColor="#CBD5E1" />
              <Text style={styles.emptyText}>No releases found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#EF4444', fontSize: 16 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', margin: 16, paddingHorizontal: 16, borderRadius: 12, height: 48, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: '#1E293B' },
  listContent: { paddingHorizontal: 16, paddingBottom: 24, gap: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 40, height: 40, backgroundColor: '#EEF2FF', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardTitleContainer: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  cardSubtitle: { fontSize: 14, color: '#64748B', marginTop: 2, fontWeight: '500' },
  statusBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: '#1D4ED8', fontSize: 12, fontWeight: 'bold' },
  cardBody: { marginTop: 16, gap: 8 },
  notesText: { fontSize: 14, color: '#475569', lineHeight: 20, marginBottom: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: 13, color: '#64748B' },
  emptyContainer: { alignItems: 'center', marginTop: 64 },
  emptyText: { marginTop: 16, fontSize: 16, color: '#94A3B8', fontWeight: '500' },
});
