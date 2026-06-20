import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { api } from '../../../src/store/AuthContext';
import { SymbolView } from 'expo-symbols';
import { format } from 'date-fns';

export default function BOMDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [showActions, setShowActions] = useState(false);

  const { data: bom, isLoading, error } = useQuery({
    queryKey: ['bom', id],
    queryFn: async () => {
      const res = await api.get(`/boms/${id}`);
      return res.data;
    }
  });

  if (isLoading) return <View style={styles.centered}><ActivityIndicator size="large" color="#4F46E5" /></View>;
  if (error || !bom) return <View style={styles.centered}><Text style={styles.errorText}>Failed to load BOM</Text></View>;

  const totalCost = bom.components?.reduce((sum: number, c: any) => sum + (c.unit_cost * c.quantity), 0) || 0;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <View style={styles.headerIconContainer}>
            <SymbolView name="list.bullet.rectangle.portrait.fill" size={32} tintColor="#6366F1" />
          </View>
          <Text style={styles.title}>{bom.bom_number}</Text>
          <Text style={styles.subtitle}>Version {bom.version}</Text>
          <View style={[styles.statusBadge, bom.status === 'Active' ? styles.statusActive : styles.statusDraft]}>
            <Text style={[styles.statusText, bom.status === 'Active' ? styles.statusTextActive : styles.statusTextDraft]}>
              {bom.status}
            </Text>
          </View>
        </View>

        <View style={styles.costWidget}>
          <View style={styles.costIcon}>
            <SymbolView name="dollarsign.circle.fill" size={24} tintColor="#10B981" />
          </View>
          <View style={styles.costTextContainer}>
            <Text style={styles.costLabel}>Total Estimated Cost</Text>
            <Text style={styles.costValue}>${totalCost.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Components ({bom.components?.length || 0})</Text>
        </View>
        
        <View style={styles.sectionContent}>
          {bom.components?.map((component: any) => (
            <View key={component.id} style={styles.componentCard}>
              <View style={styles.componentHeader}>
                <Text style={styles.componentName}>{component.part_name}</Text>
                <Text style={styles.componentCost}>${(component.unit_cost * component.quantity).toFixed(2)}</Text>
              </View>
              <View style={styles.componentBody}>
                <Text style={styles.componentSubText}>Part Number: {component.part_number}</Text>
                <View style={styles.componentPills}>
                  <View style={styles.pill}><Text style={styles.pillText}>Qty: {component.quantity}</Text></View>
                  <View style={styles.pill}><Text style={styles.pillText}>Cost: ${Number(component.unit_cost).toFixed(2)}</Text></View>
                </View>
              </View>
            </View>
          ))}
          {!bom.components?.length && <Text style={styles.emptyText}>No components defined.</Text>}
        </View>

      </ScrollView>

      {/* Sticky Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => setShowActions(true)}>
          <SymbolView name="ellipsis.circle.fill" size={20} tintColor="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Actions</Text>
        </TouchableOpacity>
      </View>

      {/* Action Bottom Sheet */}
      <Modal visible={showActions} transparent animationType="slide" onRequestClose={() => setShowActions(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowActions(false)}>
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>BOM Actions</Text>
              <TouchableOpacity onPress={() => setShowActions(false)}>
                <SymbolView name="xmark.circle.fill" size={24} tintColor="#94A3B8" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <SymbolView name="pencil" size={24} tintColor="#4F46E5" />
              <Text style={styles.actionText}>Edit BOM Components</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <SymbolView name="doc.on.doc" size={24} tintColor="#10B981" />
              <Text style={styles.actionText}>Duplicate BOM</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <SymbolView name="exclamationmark.triangle" size={24} tintColor="#F59E0B" />
              <Text style={styles.actionText}>Initiate ECO</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#EF4444', fontSize: 16 },
  content: { padding: 16, paddingBottom: 100 },
  headerCard: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: 16 },
  headerIconContainer: { width: 64, height: 64, backgroundColor: '#EEF2FF', borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: '#1E293B', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#64748B', marginTop: 4, marginBottom: 12 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusActive: { backgroundColor: '#D1FAE5' },
  statusDraft: { backgroundColor: '#F1F5F9' },
  statusText: { fontSize: 14, fontWeight: 'bold' },
  statusTextActive: { color: '#059669' },
  statusTextDraft: { color: '#475569' },
  
  costWidget: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', padding: 20, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#D1FAE5' },
  costIcon: { width: 48, height: 48, backgroundColor: '#D1FAE5', borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  costTextContainer: { flex: 1 },
  costLabel: { fontSize: 13, fontWeight: '600', color: '#059669', textTransform: 'uppercase', marginBottom: 4 },
  costValue: { fontSize: 28, fontWeight: '800', color: '#065F46' },

  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  sectionContent: { gap: 12 },
  
  componentCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  componentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  componentName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', flex: 1, marginRight: 16 },
  componentCost: { fontSize: 16, fontWeight: '800', color: '#10B981' },
  componentBody: { gap: 8 },
  componentSubText: { fontSize: 13, color: '#64748B' },
  componentPills: { flexDirection: 'row', gap: 8, marginTop: 4 },
  pill: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  pillText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  
  emptyText: { color: '#94A3B8', fontStyle: 'italic', paddingVertical: 8, textAlign: 'center' },
  
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 8 },
  primaryButton: { flexDirection: 'row', backgroundColor: '#4F46E5', height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 8 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 48 },
  bottomSheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  bottomSheetTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B' },
  actionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', gap: 16 },
  actionText: { fontSize: 16, fontWeight: '600', color: '#1E293B' }
});
