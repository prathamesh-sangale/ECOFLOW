import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { api, useAuth } from '../../../src/store/AuthContext';
import { SymbolView } from 'expo-symbols';

export default function MobileDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role?.role_name) {
      fetchDashboard(user.role.role_name);
    }
  }, [user]);

  const fetchDashboard = async (roleName: string) => {
    try {
      let endpoint = '';
      if (roleName === 'Admin') endpoint = '/dashboard/admin';
      else if (roleName === 'Approver') endpoint = '/dashboard/approver';
      else if (roleName === 'Production Manager') endpoint = '/dashboard/production';
      else if (roleName === 'Engineer') endpoint = '/dashboard/engineer';

      if (endpoint) {
        const res = await api.get(endpoint);
        setData(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch mobile dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No dashboard configured for your role.</Text>
      </View>
    );
  }

  const roleName = user?.role?.role_name;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Overview' }} />
      
      <View style={styles.headerCard}>
        <SymbolView name="chart.pie.fill" size={40} tintColor="#4F46E5" />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Welcome back,</Text>
          <Text style={styles.headerSubtitle}>{user?.full_name}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Key Metrics</Text>
      <View style={styles.grid}>
        {roleName === 'Engineer' && (
          <>
            <MetricCard title="Products" value={data.totalProducts} icon="cube.box.fill" color="#3B82F6" />
            <MetricCard title="BOMs" value={data.totalBoms} icon="list.bullet.rectangle.portrait.fill" color="#6366F1" />
            <MetricCard title="Pending" value={data.pendingReviews} icon="clock.fill" color="#F59E0B" />
            <MetricCard title="Approved" value={data.approvedEcos} icon="checkmark.circle.fill" color="#10B981" />
          </>
        )}
        {roleName === 'Approver' && (
          <>
            <MetricCard title="Pending" value={data.pendingReviews} icon="clock.fill" color="#F59E0B" />
            <MetricCard title="Approved" value={data.approvalsThisMonth} icon="checkmark.circle.fill" color="#10B981" />
            <MetricCard title="High Priority" value={data.highPriorityRequests} icon="exclamationmark.triangle.fill" color="#EF4444" />
          </>
        )}
        {roleName === 'Production Manager' && (
          <>
            <MetricCard title="Active Versions" value={data.activeVersions} icon="layers.fill" color="#6366F1" />
            <MetricCard title="Recent Releases" value={data.recentReleases} icon="rocket.fill" color="#10B981" />
            <MetricCard title="Pending Releases" value={data.pendingReleases} icon="list.bullet.rectangle.portrait.fill" color="#F59E0B" />
          </>
        )}
        {roleName === 'Admin' && (
          <>
            <MetricCard title="Total Users" value={data.totalUsers} icon="person.3.fill" color="#3B82F6" />
            <MetricCard title="Active Users" value={data.activeUsers} icon="person.crop.circle.badge.checkmark" color="#10B981" />
            <MetricCard title="Total ECOs" value={data.totalEcos} icon="doc.text.fill" color="#6366F1" />
            <MetricCard title="Audit Events" value={data.totalAuditEvents} icon="shield.lefthalf.filled" color="#64748B" />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const MetricCard = ({ title, value, icon, color }: { title: string, value: number, icon: any, color: string }) => (
  <View style={styles.metricCard}>
    <SymbolView name={icon} size={28} tintColor={color} />
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricTitle}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  errorText: { color: '#64748B', fontSize: 16 },
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16 },
  headerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  headerTextContainer: { marginLeft: 16 },
  headerTitle: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  headerSubtitle: { fontSize: 22, fontWeight: 'bold', color: '#1E293B', marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricCard: { width: '48%', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  metricValue: { fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginTop: 12 },
  metricTitle: { fontSize: 13, color: '#64748B', marginTop: 4, fontWeight: '500' },
});
