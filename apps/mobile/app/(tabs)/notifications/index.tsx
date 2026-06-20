import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { format, subDays, subHours } from 'date-fns';

const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'ECO Approved', message: 'ECO-2023-001 has been approved by Jane Smith.', type: 'success', read: false, date: subHours(new Date(), 2) },
  { id: '2', title: 'Review Required', message: 'You have a pending approval for ECO-2023-004.', type: 'warning', read: false, date: subHours(new Date(), 5) },
  { id: '3', title: 'New Release', message: 'Product Office Chair v1.2 has been released.', type: 'info', read: true, date: subDays(new Date(), 1) },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const renderItem = ({ item }: { item: typeof MOCK_NOTIFICATIONS[0] }) => (
    <TouchableOpacity style={[styles.card, !item.read && styles.unreadCard]} activeOpacity={0.7}>
      <View style={[styles.iconBox, item.type === 'success' ? styles.bgGreen : item.type === 'warning' ? styles.bgOrange : styles.bgBlue]}>
        <SymbolView 
          name={item.type === 'success' ? 'checkmark.circle.fill' : item.type === 'warning' ? 'exclamationmark.triangle.fill' : 'info.circle.fill'} 
          size={20} 
          tintColor={item.type === 'success' ? '#10B981' : item.type === 'warning' ? '#F59E0B' : '#3B82F6'} 
        />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.title, !item.read && styles.unreadText]}>{item.title}</Text>
          <Text style={styles.time}>{format(item.date, 'MMM d, HH:mm')}</Text>
        </View>
        <Text style={styles.message}>{item.message}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllRead}>
          <Text style={styles.headerAction}>Mark all as read</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
  headerAction: { fontSize: 14, fontWeight: '600', color: '#4F46E5' },
  list: { padding: 16, gap: 12 },
  card: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  unreadCard: { backgroundColor: '#F4F6FF' },
  iconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardContent: { flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: 16, fontWeight: '600', color: '#475569' },
  unreadText: { color: '#1E293B', fontWeight: 'bold' },
  time: { fontSize: 12, color: '#94A3B8' },
  message: { fontSize: 14, color: '#64748B', lineHeight: 20 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4F46E5', marginLeft: 8, alignSelf: 'center' },
  
  bgGreen: { backgroundColor: '#D1FAE5' },
  bgOrange: { backgroundColor: '#FEF3C7' },
  bgBlue: { backgroundColor: '#DBEAFE' },
});
