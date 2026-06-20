import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { api } from '../../../src/store/AuthContext';
import { SymbolView } from 'expo-symbols';
import { format } from 'date-fns';

export default function ECODetailsScreen() {
  const { id } = useLocalSearchParams();
  const [showActions, setShowActions] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'comments'>('details');

  const { data: eco, isLoading, error } = useQuery({
    queryKey: ['eco', id],
    queryFn: async () => {
      const res = await api.get(`/ecos/${id}`);
      return res.data;
    }
  });

  if (isLoading) return <View style={styles.centered}><ActivityIndicator size="large" color="#4F46E5" /></View>;
  if (error || !eco) return <View style={styles.centered}><Text style={styles.errorText}>Failed to load ECO</Text></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{eco.eco_number}</Text>
        <Text style={styles.subtitle}>{eco.title}</Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, activeTab === 'details' && styles.activeTab]} onPress={() => setActiveTab('details')}>
            <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'timeline' && styles.activeTab]} onPress={() => setActiveTab('timeline')}>
            <Text style={[styles.tabText, activeTab === 'timeline' && styles.activeTabText]}>Timeline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'comments' && styles.activeTab]} onPress={() => setActiveTab('comments')}>
            <Text style={[styles.tabText, activeTab === 'comments' && styles.activeTabText]}>Comments</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'details' && (
          <View style={styles.card}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{eco.description || 'No description provided.'}</Text>
            
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Status</Text>
                <Text style={styles.value}>{eco.status}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Priority</Text>
                <Text style={styles.value}>{eco.priority}</Text>
              </View>
            </View>
            
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Submitted By</Text>
                <Text style={styles.value}>{eco.submitter?.full_name || 'System'}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Product</Text>
                <Text style={styles.value}>{eco.product?.product_name || 'N/A'}</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'timeline' && (
          <View style={styles.timelineCard}>
            {eco.approvals?.map((app: any, idx: number) => (
              <View key={app.id} style={styles.timelineItem}>
                <View style={styles.timelineLine} />
                <View style={[styles.timelineDot, app.decision === 'Approved' ? styles.bgGreen : app.decision === 'Rejected' ? styles.bgRed : styles.bgOrange]} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>{app.decision} by {app.reviewer?.full_name}</Text>
                  <Text style={styles.timelineDate}>{app.reviewed_at ? format(new Date(app.reviewed_at), 'MMM d, yyyy HH:mm') : 'Pending'}</Text>
                  {app.comments && <Text style={styles.timelineComment}>{app.comments}</Text>}
                </View>
              </View>
            ))}
            {!eco.approvals?.length && <Text style={styles.emptyText}>No timeline activity recorded.</Text>}
          </View>
        )}

        {activeTab === 'comments' && (
          <View style={styles.card}>
            {eco.comments?.map((comment: any) => (
              <View key={comment.id} style={styles.commentItem}>
                <View style={styles.commentAvatar}>
                  <Text style={styles.avatarText}>{comment.user?.full_name?.charAt(0) || 'U'}</Text>
                </View>
                <View style={styles.commentBody}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>{comment.user?.full_name || 'Unknown'}</Text>
                    <Text style={styles.commentDate}>{format(new Date(comment.created_at), 'MMM d, HH:mm')}</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.content}</Text>
                </View>
              </View>
            ))}
            {!eco.comments?.length && <Text style={styles.emptyText}>No comments yet.</Text>}
          </View>
        )}
      </ScrollView>

      {/* Sticky Action Button */}
      {eco.status === 'Draft' && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => setShowActions(true)}>
            <SymbolView name="paperplane.fill" size={20} tintColor="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Submit ECO</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Action Bottom Sheet */}
      <Modal visible={showActions} transparent animationType="slide" onRequestClose={() => setShowActions(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowActions(false)}>
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Submit for Review?</Text>
              <TouchableOpacity onPress={() => setShowActions(false)}>
                <SymbolView name="xmark.circle.fill" size={24} tintColor="#94A3B8" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>This will lock the ECO from further edits and send it to the designated approver.</Text>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>Confirm Submission</Text>
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
  header: { backgroundColor: '#FFFFFF', paddingTop: 24, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  title: { fontSize: 24, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#64748B', marginBottom: 20 },
  tabContainer: { flexDirection: 'row' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#4F46E5' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  activeTabText: { color: '#4F46E5' },
  content: { padding: 16, paddingBottom: 100 },
  
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  label: { fontSize: 12, fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 },
  value: { fontSize: 15, color: '#1E293B', marginBottom: 16, lineHeight: 22 },
  row: { flexDirection: 'row', gap: 16 },
  col: { flex: 1 },
  
  timelineCard: { padding: 16 },
  timelineItem: { flexDirection: 'row', marginBottom: 24, position: 'relative' },
  timelineLine: { position: 'absolute', left: 7, top: 20, bottom: -24, width: 2, backgroundColor: '#E2E8F0' },
  timelineDot: { width: 16, height: 16, borderRadius: 8, marginTop: 4, marginRight: 16 },
  timelineContent: { flex: 1 },
  timelineTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  timelineDate: { fontSize: 13, color: '#64748B', marginTop: 2 },
  timelineComment: { fontSize: 14, color: '#475569', marginTop: 8, backgroundColor: '#F1F5F9', padding: 12, borderRadius: 8 },
  
  bgGreen: { backgroundColor: '#10B981' },
  bgRed: { backgroundColor: '#EF4444' },
  bgOrange: { backgroundColor: '#F59E0B' },

  commentItem: { flexDirection: 'row', marginBottom: 16 },
  commentAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 16, fontWeight: 'bold', color: '#4F46E5' },
  commentBody: { flex: 1, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  commentAuthor: { fontSize: 14, fontWeight: 'bold', color: '#1E293B' },
  commentDate: { fontSize: 12, color: '#64748B' },
  commentText: { fontSize: 14, color: '#475569', lineHeight: 20 },
  
  emptyText: { color: '#94A3B8', fontStyle: 'italic', textAlign: 'center' },
  
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 8 },
  primaryButton: { flexDirection: 'row', backgroundColor: '#4F46E5', height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 8 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 48 },
  bottomSheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  bottomSheetTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B' },
  modalText: { fontSize: 15, color: '#64748B', marginBottom: 24, lineHeight: 22 },
  actionButton: { backgroundColor: '#4F46E5', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  actionText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' }
});
