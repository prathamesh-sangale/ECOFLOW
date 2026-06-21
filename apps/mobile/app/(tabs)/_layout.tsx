import { SymbolView } from 'expo-symbols';
import { Link, Tabs } from 'expo-router';
import { Platform, Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useAuth } from '@/src/store/AuthContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  
  const role = user?.role?.role_name || '';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Overview',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'chart.pie.fill', android: 'analytics', web: 'analytics' }} tintColor={color} size={28} />
          ),
          headerRight: () => (
            <Link href="/(tabs)/notifications" asChild>
              <Pressable style={{ marginRight: 15 }}>
                {({ pressed }) => (
                  <SymbolView
                    name={{ ios: 'bell.fill', android: 'notifications', web: 'notifications' }}
                    size={25}
                    tintColor={Colors[colorScheme].text}
                    style={{ opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          href: ['Engineer'].includes(role) ? '/(tabs)/products' : null,
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'square.stack.3d.up.fill', android: 'inventory_2', web: 'inventory_2' }} tintColor={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="boms"
        options={{
          title: 'BOMs',
          href: ['Engineer'].includes(role) ? '/(tabs)/boms' : null,
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'list.bullet.rectangle.portrait.fill', android: 'account_tree', web: 'account_tree' }} tintColor={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="ecos"
        options={{
          title: 'ECOs',
          href: ['Engineer'].includes(role) ? '/(tabs)/ecos' : null,
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'arrow.triangle.2.circlepath.doc.on.clipboard', android: 'published_with_changes', web: 'published_with_changes' }} tintColor={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="approvals"
        options={{
          title: 'Approvals',
          href: ['Approver'].includes(role) ? '/(tabs)/approvals' : null,
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' }} tintColor={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="versions"
        options={{
          title: 'Releases',
          href: ['Production Manager'].includes(role) ? '/(tabs)/versions' : null,
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'archivebox', android: 'conveyor_belt', web: 'conveyor_belt' }} tintColor={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Users',
          href: (['Admin'].includes(role) ? '/(tabs)/admin' : null) as any,
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'person.2.fill', android: 'group', web: 'group' }} tintColor={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          href: ['Admin'].includes(role) ? '/(tabs)/reports' : null,
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'doc.text.fill', android: 'assessment', web: 'assessment' }} tintColor={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="audit"
        options={{
          title: 'Audit',
          href: ['Admin'].includes(role) ? '/(tabs)/audit' : null,
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'shield.lefthalf.filled', android: 'security', web: 'security' }} tintColor={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' }} tintColor={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null, // Hide from tab bar, accessed via header button
        }}
      />
    </Tabs>
  );
}
