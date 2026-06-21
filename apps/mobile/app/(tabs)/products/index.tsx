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
        <View style={styles.iconBg}>
          <SymbolView name="cube.box.fill" size={20} tintColor="#005c55" />
        </View>
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
        <SymbolView name="magnifyingglass" size={18} tintColor="#8e9a97" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#8e9a97"
        />
      </View>

      {status === 'pending' ? (
        <View style={styles.centered}><ActivityIndicator size="large" color="#005c55" /></View>
      ) : status === 'error' ? (
        <View style={styles.centered}><Text style={styles.errorText}>Error fetching products: {(error as any).message}</Text></View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isFetching && !isFetchingNextPage} onRefresh={refetch} tintColor="#005c55" />
          }
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <SymbolView name="tray.fill" size={48} tintColor="#8e9a97" />
              <Text style={styles.emptyText}>No products found.</Text>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator style={{ margin: 16 }} color="#005c55" /> : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7faf8' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#ba1a1a', fontSize: 16, fontWeight: '600' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', margin: 16, paddingHorizontal: 16, borderRadius: 14, height: 50, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2, borderWidth: 1, borderColor: '#bdc9c6' },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: '#181c1c' },
  listContent: { paddingHorizontal: 16, paddingBottom: 24, gap: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1, borderWidth: 1, borderColor: '#bdc9c6' },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconBg: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#005c5515', justifyContent: 'center', alignItems: 'center' },
  cardTitleContainer: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#181c1c' },
  cardSubtitle: { fontSize: 13, color: '#4e6260', marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusActive: { backgroundColor: '#d1e7e4' },
  statusDraft: { backgroundColor: '#f1f4f3' },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  statusTextActive: { color: '#005c55' },
  statusTextDraft: { color: '#4e6260' },
  cardBody: { marginTop: 12 },
  cardDesc: { fontSize: 14, color: '#4e6260', lineHeight: 20 },
  emptyContainer: { alignItems: 'center', marginTop: 64, gap: 12 },
  emptyText: { fontSize: 16, color: '#8e9a97', fontWeight: '500' }
});
