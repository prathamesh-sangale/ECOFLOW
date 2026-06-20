import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../../../src/store/AuthContext';
import { SymbolView } from 'expo-symbols';
import { format } from 'date-fns';

const fetchAuditLogs = async ({ pageParam = 1, queryKey }: any) => {
  const [_key, search] = queryKey;
  const res = await api.get('/audit', {
    params: { page: pageParam, limit: 20, search }
  });
  return res.data;
};

export default function AuditScreen() {
  const [search, setSearch] = useState('');
  
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['audit', search],
    queryFn: fetchAuditLogs,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.logs.length < 20) return undefined;
      return pages.length + 1;
    },
  });

  const logs = data ? data.pages.flatMap((page) => page.logs) : [];

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <SymbolView name="shield.lefthalf.filled" size={20} tintColor="#64748B" />
        </View>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{item.action}</Text>
          <Text style={styles.cardSubtitle}>{item.entity_type} #{item.entity_id}</Text>
        </View>
        <Text style={styles.timeText}>{format(new Date(item.created_at), 'MMM d, HH:mm')}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <SymbolView name="person.fill" size={14} tintColor="#94A3B8" />
          <Text style={styles.infoText}>By {item.user?.full_name || 'System'}</Text>
        </View>
        <Text style={styles.ipText}>{item.ip_address}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SymbolView name="magnifyingglass" size={20} tintColor="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search audit logs..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#94A3B8"
        />
      </View>

      {status === 'pending' ? (
        <View style={styles.centered}><ActivityIndicator size="large" color="#4F46E5" /></View>
      ) : status === 'error' ? (
        <View style={styles.centered}><Text style={styles.errorText}>Error fetching audit logs</Text></View>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isFetching && !isFetchingNextPage} onRefresh={refetch} tintColor="#4F46E5" />
          }
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <SymbolView name="shield" size={48} tintColor="#CBD5E1" />
              <Text style={styles.emptyText}>No audit logs found.</Text>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator style={{ margin: 16 }} color="#4F46E5" /> : null
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
  iconContainer: { width: 40, height: 40, backgroundColor: '#F1F5F9', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardTitleContainer: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  cardSubtitle: { fontSize: 13, color: '#64748B', marginTop: 2, fontWeight: '500' },
  timeText: { fontSize: 12, color: '#94A3B8' },
  cardBody: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { fontSize: 13, color: '#475569' },
  ipText: { fontSize: 12, color: '#94A3B8', fontFamily: 'SpaceMono' },
  emptyContainer: { alignItems: 'center', marginTop: 64 },
  emptyText: { marginTop: 16, fontSize: 16, color: '#94A3B8', fontWeight: '500' },
});
