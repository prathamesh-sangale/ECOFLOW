import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { api } from '../../../src/store/AuthContext';
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';

export default function ReportsScreen() {
  const [loadingReport, setLoadingReport] = useState<string | null>(null);

  const downloadReport = async (reportType: string) => {
    setLoadingReport(reportType);
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      // For mobile, the easiest way to download a CSV is to open the browser 
      // with the token in the URL or use expo-file-system. 
      // For this implementation, we will simulate the download or use a direct URL if backend supports token in query.
      // Since backend expects Bearer token, we will fetch the blob and save it using Expo FileSystem, 
      // but as a placeholder we will just alert success for now or use Linking if backend is public.
      
      const res = await api.get('/reports/generate', { params: { type: reportType } });
      alert(`Report generated successfully! (CSV Data length: ${res.data.length})`);
    } catch (e) {
      alert(`Failed to download ${reportType} report`);
    } finally {
      setLoadingReport(null);
    }
  };

  const reports = [
    { id: 'ecos', title: 'ECO Lifecycle Report', desc: 'Detailed list of all ECOs, statuses, and cycle times.', icon: 'arrow.triangle.2.circlepath.doc.on.clipboard', color: '#F59E0B' },
    { id: 'products', title: 'Product Inventory', desc: 'Current active products and their latest versions.', icon: 'cube.box.fill', color: '#3B82F6' },
    { id: 'boms', title: 'BOM Summary', desc: 'All Bill of Materials and component cost aggregates.', icon: 'list.bullet.rectangle.portrait.fill', color: '#6366F1' },
    { id: 'audit', title: 'Full Audit Trail', desc: 'Complete system activity log for compliance.', icon: 'shield.lefthalf.filled', color: '#64748B' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SymbolView name="doc.text.fill" size={48} tintColor="#10B981" />
          <Text style={styles.title}>Reports Center</Text>
          <Text style={styles.subtitle}>Generate and download CSV reports for external analysis.</Text>
        </View>

        <View style={styles.grid}>
          {reports.map((report) => (
            <TouchableOpacity 
              key={report.id} 
              style={styles.card} 
              activeOpacity={0.7}
              onPress={() => downloadReport(report.id)}
              disabled={loadingReport !== null}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: report.color + '20' }]}>
                  <SymbolView name={report.icon as any} size={24} tintColor={report.color} />
                </View>
                {loadingReport === report.id && <ActivityIndicator color={report.color} />}
              </View>
              <Text style={styles.cardTitle}>{report.title}</Text>
              <Text style={styles.cardDesc}>{report.desc}</Text>
              <View style={styles.downloadBtn}>
                <SymbolView name="arrow.down.circle.fill" size={16} tintColor="#64748B" />
                <Text style={styles.downloadText}>Download CSV</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16 },
  header: { alignItems: 'center', marginVertical: 32 },
  title: { fontSize: 28, fontWeight: '800', color: '#1E293B', marginTop: 16 },
  subtitle: { fontSize: 16, color: '#64748B', textAlign: 'center', marginTop: 8, paddingHorizontal: 24 },
  grid: { gap: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  iconContainer: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },
  cardDesc: { fontSize: 14, color: '#64748B', lineHeight: 20, marginBottom: 16 },
  downloadBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  downloadText: { fontSize: 13, fontWeight: '600', color: '#64748B' }
});
