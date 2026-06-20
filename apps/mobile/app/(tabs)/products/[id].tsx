import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Pressable } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, router } from 'expo-router';
import { api } from '../../../src/store/AuthContext';
import { SymbolView } from 'expo-symbols';
import { format } from 'date-fns';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [showActions, setShowActions] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('details');

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return res.data;
    }
  });

  if (isLoading) return <View style={styles.centered}><ActivityIndicator size="large" color="#4F46E5" /></View>;
  if (error || !product) return <View style={styles.centered}><Text style={styles.errorText}>Failed to load product</Text></View>;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <View style={styles.headerIconContainer}>
            <SymbolView name="cube.box.fill" size={32} tintColor="#3B82F6" />
          </View>
          <Text style={styles.title}>{product.product_name}</Text>
          <Text style={styles.subtitle}>{product.product_code}</Text>
          <View style={[styles.statusBadge, product.status === 'Active' ? styles.statusActive : styles.statusDraft]}>
            <Text style={[styles.statusText, product.status === 'Active' ? styles.statusTextActive : styles.statusTextDraft]}>
              {product.status}
            </Text>
          </View>
        </View>

        {/* Expandable Details Section */}
        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('details')} activeOpacity={0.7}>
          <Text style={styles.sectionTitle}>Product Details</Text>
          <SymbolView name={expandedSection === 'details' ? 'chevron.up' : 'chevron.down'} size={20} tintColor="#64748B" />
        </TouchableOpacity>
        
        {expandedSection === 'details' && (
          <View style={styles.sectionContent}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{product.description || 'No description provided.'}</Text>
            
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Category</Text>
                <Text style={styles.value}>{product.category?.name || 'Uncategorized'}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Created At</Text>
                <Text style={styles.value}>{format(new Date(product.created_at), 'MMM d, yyyy')}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Expandable BOM Section */}
        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('boms')} activeOpacity={0.7}>
          <Text style={styles.sectionTitle}>Bill of Materials ({product.boms?.length || 0})</Text>
          <SymbolView name={expandedSection === 'boms' ? 'chevron.up' : 'chevron.down'} size={20} tintColor="#64748B" />
        </TouchableOpacity>
        
        {expandedSection === 'boms' && (
          <View style={styles.sectionContent}>
            {product.boms?.map((bom: any) => (
              <TouchableOpacity key={bom.id} style={styles.itemCard} onPress={() => router.push(`/(tabs)/boms/${bom.id}`)}>
                <SymbolView name="list.bullet.rectangle.portrait.fill" size={20} tintColor="#6366F1" />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemTitle}>{bom.bom_number}</Text>
                  <Text style={styles.itemSub}>{bom.version}</Text>
                </View>
                <SymbolView name="chevron.right" size={20} tintColor="#CBD5E1" />
              </TouchableOpacity>
            ))}
            {!product.boms?.length && <Text style={styles.emptyText}>No BOMs attached.</Text>}
          </View>
        )}

        {/* Expandable ECO Section */}
        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('ecos')} activeOpacity={0.7}>
          <Text style={styles.sectionTitle}>Engineering Change Orders ({product.ecos?.length || 0})</Text>
          <SymbolView name={expandedSection === 'ecos' ? 'chevron.up' : 'chevron.down'} size={20} tintColor="#64748B" />
        </TouchableOpacity>
        
        {expandedSection === 'ecos' && (
          <View style={styles.sectionContent}>
            {product.ecos?.map((eco: any) => (
              <TouchableOpacity key={eco.id} style={styles.itemCard} onPress={() => router.push(`/(tabs)/ecos/${eco.id}`)}>
                <SymbolView name="arrow.triangle.2.circlepath.doc.on.clipboard" size={20} tintColor="#F59E0B" />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemTitle}>{eco.eco_number}</Text>
                  <Text style={styles.itemSub}>{eco.status}</Text>
                </View>
                <SymbolView name="chevron.right" size={20} tintColor="#CBD5E1" />
              </TouchableOpacity>
            ))}
            {!product.ecos?.length && <Text style={styles.emptyText}>No ECOs attached.</Text>}
          </View>
        )}
      </ScrollView>

      {/* Sticky Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => setShowActions(true)}>
          <SymbolView name="ellipsis.circle.fill" size={20} tintColor="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Actions</Text>
        </TouchableOpacity>
      </View>

      {/* Action Bottom Sheet (Modal Placeholder) */}
      <Modal visible={showActions} transparent animationType="slide" onRequestClose={() => setShowActions(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowActions(false)}>
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Product Actions</Text>
              <TouchableOpacity onPress={() => setShowActions(false)}>
                <SymbolView name="xmark.circle.fill" size={24} tintColor="#94A3B8" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <SymbolView name="pencil" size={24} tintColor="#4F46E5" />
              <Text style={styles.actionText}>Edit Product</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <SymbolView name="plus.circle" size={24} tintColor="#10B981" />
              <Text style={styles.actionText}>Create BOM</Text>
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
  headerCard: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: 24 },
  headerIconContainer: { width: 64, height: 64, backgroundColor: '#EFF6FF', borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: '#1E293B', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#64748B', marginTop: 4, marginBottom: 12 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusActive: { backgroundColor: '#D1FAE5' },
  statusDraft: { backgroundColor: '#F1F5F9' },
  statusText: { fontSize: 14, fontWeight: 'bold' },
  statusTextActive: { color: '#059669' },
  statusTextDraft: { color: '#475569' },
  
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginTop: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 2, elevation: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  sectionContent: { backgroundColor: '#FFFFFF', padding: 16, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, marginTop: -4, paddingTop: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 2, elevation: 1 },
  
  label: { fontSize: 12, fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 },
  value: { fontSize: 15, color: '#1E293B', marginBottom: 16, lineHeight: 22 },
  row: { flexDirection: 'row', gap: 16 },
  col: { flex: 1 },
  
  itemCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  itemDetails: { flex: 1, marginLeft: 12 },
  itemTitle: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  itemSub: { fontSize: 13, color: '#64748B', marginTop: 2 },
  emptyText: { color: '#94A3B8', fontStyle: 'italic', paddingVertical: 8 },
  
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
