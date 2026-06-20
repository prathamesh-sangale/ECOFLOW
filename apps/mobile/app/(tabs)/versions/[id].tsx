import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { api } from '../../../src/store/AuthContext';
import { SymbolView } from 'expo-symbols';
import { format } from 'date-fns';

export default function ReleaseDetailsScreen() {
  const { id } = useLocalSearchParams();

  const { data: release, isLoading, error } = useQuery({
    queryKey: ['release', id],
    queryFn: async () => {
      const res = await api.get(`/releases`);
      const target = res.data.find((r: any) => r.id.toString() === id.toString());
      return target;
    }
  });

  if (isLoading) return <View style={styles.centered}><ActivityIndicator size="large" color="#4F46E5" /></View>;
  if (error || !release) return <View style={styles.centered}><Text style={styles.errorText}>Failed to load Release</Text></View>;

  const handleDownload = () => {
    alert('PDF Download initiated');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <View style={styles.headerIconContainer}>
            <SymbolView name="archivebox.fill" size={32} tintColor="#4F46E5" />
          </View>
          <Text style={styles.title}>{release.product?.product_name}</Text>
          <Text style={styles.subtitle}>Release v{release.version?.version_number}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Officially Released</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Release Information</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Released At</Text>
              <Text style={styles.value}>{format(new Date(release.released_at), 'MMM d, yyyy HH:mm')}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Released By</Text>
              <Text style={styles.value}>{release.released_by?.full_name}</Text>
            </View>
          </View>
          <Text style={styles.label}>Release Notes</Text>
          <Text style={styles.value}>{release.release_notes || 'No specific notes provided.'}</Text>
        </View>

        <Text style={styles.sectionTitle}>Associated Data</Text>
        <View style={styles.card}>
          <View style={styles.dataRow}>
            <SymbolView name="cube.box" size={20} tintColor="#3B82F6" />
            <View style={styles.dataContent}>
              <Text style={styles.dataLabel}>Product</Text>
              <Text style={styles.dataValue}>{release.product?.product_name} ({release.product?.product_code})</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.dataRow}>
            <SymbolView name="list.bullet.rectangle.portrait" size={20} tintColor="#6366F1" />
            <View style={styles.dataContent}>
              <Text style={styles.dataLabel}>BOM Snapshot</Text>
              <Text style={styles.dataValue}>v{release.version?.version_number}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.dataRow}>
            <SymbolView name="arrow.triangle.2.circlepath.doc.on.clipboard" size={20} tintColor="#F59E0B" />
            <View style={styles.dataContent}>
              <Text style={styles.dataLabel}>Driving ECO</Text>
              <Text style={styles.dataValue}>{release.eco?.eco_number || 'N/A'}</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Sticky Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleDownload}>
          <SymbolView name="arrow.down.doc.fill" size={20} tintColor="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Download Manufacturing Package</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#EF4444', fontSize: 16 },
  content: { padding: 16, paddingBottom: 100 },
  headerCard: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: 24 },
  headerIconContainer: { width: 64, height: 64, backgroundColor: '#EEF2FF', borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: '#1E293B', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#64748B', marginTop: 4, marginBottom: 12 },
  statusBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { color: '#1D4ED8', fontSize: 14, fontWeight: 'bold' },
  
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 12, marginLeft: 4 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1, marginBottom: 24 },
  label: { fontSize: 12, fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 },
  value: { fontSize: 15, color: '#1E293B', marginBottom: 16, lineHeight: 22 },
  row: { flexDirection: 'row', gap: 16 },
  col: { flex: 1 },

  dataRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  dataContent: { flex: 1 },
  dataLabel: { fontSize: 12, color: '#64748B', marginBottom: 2 },
  dataValue: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 8 },
  primaryButton: { flexDirection: 'row', backgroundColor: '#4F46E5', height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 8 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
