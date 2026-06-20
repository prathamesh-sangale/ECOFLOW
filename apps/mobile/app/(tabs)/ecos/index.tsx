import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../../../src/store/AuthContext';
import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import { format } from 'date-fns';

const fetchECOs = async ({ pageParam = 1, queryKey }: any) => {
  const [_key, search] = queryKey;
  const res = await api.get('/ecos', {
    params: { page: pageParam, limit: 20, search }
  });
  return res.data;
};

export default function ECOsScreen() {
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
    queryKey: ['ecos', search],
    queryFn: fetchECOs,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.length < 20) return undefined;
      return pages.length + 1;
    },
  });

  const ecos = data ? data.pages.flatMap((page) => page.data) : [];

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/(tabs)/ecos/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <SymbolView name="arrow.triangle.2.circlepath.doc.on.clipboard" size={20} tintColor="#F59E0B" />
        </View>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{item.eco_number}</Text>
          <Text style={styles.cardSubtitle} numberOfLines={1}>{item.title}</Text>
        </View>
      </View>
      
      <View style={styles.cardBody}>
        <View style={styles.badgeRow}>
          <View style={[styles.priorityBadge, item.priority === 'Critical' ? styles.bgRed : item.priority === 'High' ? styles.bgOrange : styles.bgSlate]}>
            <Text style={[styles.priorityText, item.priority === 'Critical' ? styles.textRed : item.priority === 'High' ? styles.textOrange : styles.textSlate]}>
              {item.priority}
            </Text>
          </View>
          <View style={[styles.statusBadge, item.status === 'Approved' ? styles.bgGreen : item.status === 'Rejected' ? styles.bgRed : item.status === 'Draft' ? styles.bgSlate : styles.bgBlue]}>
            <Text style={[styles.statusText, item.status === 'Approved' ? styles.textGreen : item.status === 'Rejected' ? styles.textRed : item.status === 'Draft' ? styles.textSlate : styles.textBlue]}>
              {item.status}
            </Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <SymbolView name="calendar" size={14} tintColor="#94A3B8" />
          <Text style={styles.infoText}>{format(new Date(item.created_at), 'MMM d, yyyy')}</Text>
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
          placeholder="Search ECOs..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#94A3B8"
        />
      </View>

      {status === 'pending' ? (
        <View style={styles.centered}><ActivityIndicator size="large" color="#4F46E5" /></View>
      ) : status === 'error' ? (
        <View style={styles.centered}><Text style={styles.errorText}>Error fetching ECOs: {(error as any).message}</Text></View>
      ) : (
        <FlatList
          data={ecos}
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
              <SymbolView name="tray.fill" size={48} tintColor="#CBD5E1" />
              <Text style={styles.emptyText}>No ECOs found.</Text>
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
  iconContainer: { width: 40, height: 40, backgroundColor: '#FEF3C7', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardTitleContainer: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  cardSubtitle: { fontSize: 14, color: '#64748B', marginTop: 2, fontWeight: '500' },
  cardBody: { marginTop: 16, gap: 12 },
  badgeRow: { flexDirection: 'row', gap: 8 },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  priorityText: { fontSize: 12, fontWeight: 'bold' },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: 13, color: '#475569' },
  emptyContainer: { alignItems: 'center', marginTop: 64 },
  emptyText: { marginTop: 16, fontSize: 16, color: '#94A3B8', fontWeight: '500' },
  
  bgRed: { backgroundColor: '#FEE2E2' },
  textRed: { color: '#B91C1C' },
  bgOrange: { backgroundColor: '#FFEDD5' },
  textOrange: { color: '#C2410C' },
  bgGreen: { backgroundColor: '#D1FAE5' },
  textGreen: { color: '#047857' },
  bgSlate: { backgroundColor: '#F1F5F9' },
  textSlate: { color: '#475569' },
  bgBlue: { backgroundColor: '#DBEAFE' },
  textBlue: { color: '#1D4ED8' }
});
