import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal, Pressable, TextInput } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, router } from 'expo-router';
import { api } from '../../../src/store/AuthContext';
import { SymbolView } from 'expo-symbols';
import { format } from 'date-fns';

export default function ApprovalReviewScreen() {
  const { id } = useLocalSearchParams();
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [decision, setDecision] = useState<'Approve' | 'Reject' | 'Request Changes' | null>(null);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data: eco, isLoading, error } = useQuery({
    queryKey: ['eco', id],
    queryFn: async () => {
      const res = await api.get(`/ecos/${id}`);
      return res.data;
    }
  });

  if (isLoading) return <View style={styles.centered}><ActivityIndicator size="large" color="#4F46E5" /></View>;
  if (error || !eco) return <View style={styles.centered}><Text style={styles.errorText}>Failed to load ECO</Text></View>;

  const handleDecision = (type: 'Approve' | 'Reject' | 'Request Changes') => {
    setDecision(type);
    setShowActionSheet(true);
  };

  const submitDecision = async () => {
    if (!decision) return;
    setSubmitting(true);
    try {
      await api.post(`/approvals/${id}/review`, { decision, comments });
      setShowActionSheet(false);
      router.back();
    } catch (e) {
      console.error(e);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <Text style={styles.title}>{eco.eco_number}</Text>
          <Text style={styles.subtitle}>{eco.title}</Text>
          <View style={styles.badgeRow}>
            <View style={[styles.priorityBadge, eco.priority === 'Critical' ? styles.bgRed : eco.priority === 'High' ? styles.bgOrange : styles.bgSlate]}>
              <Text style={[styles.priorityText, eco.priority === 'Critical' ? styles.textRed : eco.priority === 'High' ? styles.textOrange : styles.textSlate]}>
                {eco.priority} Priority
              </Text>
            </View>
            <View style={[styles.statusBadge, styles.bgAmber]}>
              <Text style={[styles.statusText, styles.textAmber]}>Pending Review</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Change Request Details</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{eco.description}</Text>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Product</Text>
              <Text style={styles.value}>{eco.product?.product_name || 'N/A'}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Submitter</Text>
              <Text style={styles.value}>{eco.submitter?.full_name}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Impact Analysis</Text>
        <View style={styles.card}>
          <View style={styles.impactRow}>
            <SymbolView name="dollarsign.circle.fill" size={24} tintColor="#F59E0B" />
            <View style={styles.impactContent}>
              <Text style={styles.impactLabel}>Cost Impact</Text>
              <Text style={styles.impactValue}>Medium (+15% unit cost)</Text>
            </View>
          </View>
          <View style={styles.impactDivider} />
          <View style={styles.impactRow}>
            <SymbolView name="clock.fill" size={24} tintColor="#4F46E5" />
            <View style={styles.impactContent}>
              <Text style={styles.impactLabel}>Time Impact</Text>
              <Text style={styles.impactValue}>Low (+2 days lead time)</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Approval Actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.actionBtn, styles.btnReject]} onPress={() => handleDecision('Reject')}>
          <SymbolView name="xmark" size={20} tintColor="#EF4444" />
          <Text style={styles.btnTextReject}>Reject</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionBtn, styles.btnChanges]} onPress={() => handleDecision('Request Changes')}>
          <SymbolView name="arrow.triangle.2.circlepath" size={20} tintColor="#F59E0B" />
          <Text style={styles.btnTextChanges}>Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.btnApprove]} onPress={() => handleDecision('Approve')}>
          <SymbolView name="checkmark" size={20} tintColor="#FFFFFF" />
          <Text style={styles.btnTextApprove}>Approve</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet for Review Submission */}
      <Modal visible={showActionSheet} transparent animationType="slide" onRequestClose={() => setShowActionSheet(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowActionSheet(false)}>
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Confirm {decision}</Text>
              <TouchableOpacity onPress={() => setShowActionSheet(false)}>
                <SymbolView name="xmark.circle.fill" size={24} tintColor="#94A3B8" />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Review Comments (Required for Reject/Changes)</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter your rationale here..."
              multiline
              numberOfLines={4}
              value={comments}
              onChangeText={setComments}
              textAlignVertical="top"
            />
            <TouchableOpacity 
              style={[
                styles.submitDecisionBtn, 
                decision === 'Approve' ? styles.bgGreen : decision === 'Reject' ? styles.bgRed : styles.bgOrange
              ]}
              onPress={submitDecision}
              disabled={submitting || (['Reject', 'Request Changes'].includes(decision!) && !comments.trim())}
            >
              {submitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitDecisionText}>Confirm {decision}</Text>
              )}
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
  headerCard: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', color: '#1E293B' },
  subtitle: { fontSize: 16, color: '#64748B', marginTop: 4, marginBottom: 16 },
  badgeRow: { flexDirection: 'row', gap: 8 },
  priorityBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  priorityText: { fontSize: 13, fontWeight: 'bold' },
  statusText: { fontSize: 13, fontWeight: 'bold' },
  
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 12, marginLeft: 4 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1, marginBottom: 24 },
  label: { fontSize: 12, fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 },
  value: { fontSize: 15, color: '#1E293B', marginBottom: 16, lineHeight: 22 },
  row: { flexDirection: 'row', gap: 16 },
  col: { flex: 1 },

  impactRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  impactContent: { flex: 1 },
  impactLabel: { fontSize: 14, fontWeight: 'bold', color: '#1E293B' },
  impactValue: { fontSize: 14, color: '#64748B', marginTop: 2 },
  impactDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 8, flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 6, borderWidth: 1 },
  btnApprove: { backgroundColor: '#10B981', borderColor: '#10B981' },
  btnReject: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  btnChanges: { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' },
  btnTextApprove: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  btnTextReject: { color: '#EF4444', fontWeight: 'bold', fontSize: 15 },
  btnTextChanges: { color: '#F59E0B', fontWeight: 'bold', fontSize: 15 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 48 },
  bottomSheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  bottomSheetTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B' },
  textArea: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 16, height: 120, fontSize: 16, backgroundColor: '#F8FAFC', marginBottom: 24 },
  submitDecisionBtn: { height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  submitDecisionText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },

  bgGreen: { backgroundColor: '#10B981' },
  bgRed: { backgroundColor: '#EF4444' },
  bgOrange: { backgroundColor: '#F59E0B' },
  bgSlate: { backgroundColor: '#F1F5F9' },
  bgAmber: { backgroundColor: '#FEF3C7' },
  textRed: { color: '#B91C1C' },
  textOrange: { color: '#C2410C' },
  textSlate: { color: '#475569' },
  textAmber: { color: '#D97706' }
});
