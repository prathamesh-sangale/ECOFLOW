import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../../../src/store/AuthContext';
import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';

const fetchProducts = async ({ pageParam = 1, queryKey }: any) => {
  const [_key, search] = queryKey;
  const res = await api.get('/products', {
    params: { page: pageParam, limit: 20, search }
  });
  return res.data;
};

export default function ProductsScreen() {
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
    queryKey: ['products', search],
    queryFn: fetchProducts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.length < 20) return undefined;
      return pages.length + 1;
    },
  });

  const products = data ? data.pages.flatMap((page) => page.data) : [];

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/(tabs)/products/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <SymbolView name="cube.box.fill" size={24} tintColor="#3B82F6" />
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{item.product_name}</Text>
          <Text style={styles.cardSubtitle}>{item.product_code}</Text>
        </View>
        <View style={[styles.statusBadge, item.status === 'Active' ? styles.statusActive : styles.statusDraft]}>
          <Text style={[styles.statusText, item.status === 'Active' ? styles.statusTextActive : styles.statusTextDraft]}>
            {item.status}
          </Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SymbolView name="magnifyingglass" size={20} tintColor="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#94A3B8"
        />
      </View>

      {status === 'pending' ? (
        <View style={styles.centered}><ActivityIndicator size="large" color="#4F46E5" /></View>
      ) : status === 'error' ? (
        <View style={styles.centered}><Text style={styles.errorText}>Error fetching products: {(error as any).message}</Text></View>
      ) : (
        <FlatList
          data={products}
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
              <Text style={styles.emptyText}>No products found.</Text>
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
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  cardTitleContainer: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  cardSubtitle: { fontSize: 14, color: '#64748B', marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusActive: { backgroundColor: '#D1FAE5' },
  statusDraft: { backgroundColor: '#F1F5F9' },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  statusTextActive: { color: '#059669' },
  statusTextDraft: { color: '#475569' },
  cardBody: { marginTop: 12 },
  cardDesc: { fontSize: 14, color: '#475569', lineHeight: 20 },
  emptyContainer: { alignItems: 'center', marginTop: 64 },
  emptyText: { marginTop: 16, fontSize: 16, color: '#94A3B8', fontWeight: '500' }
});
