import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import * as Network from 'expo-network';
import { SymbolView } from 'expo-symbols';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function OfflineIndicator() {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const checkNetwork = async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        setIsConnected(state.isConnected ?? null);
      } catch {
        setIsConnected(true); // default to true if error
      }
    };

    checkNetwork();
    
    // Simplistic polling since expo-network doesn't have an event listener in the same way NetInfo does
    const interval = setInterval(checkNetwork, 5000);
    return () => clearInterval(interval);
  }, []);

  if (isConnected !== false) return null;

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? insets.top : 0 }]}>
      <View style={styles.banner}>
        <SymbolView name="wifi.slash" size={16} tintColor="#FFFFFF" />
        <Text style={styles.text}>No Internet Connection - Showing Cached Data</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 999 },
  banner: { backgroundColor: '#EF4444', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 8, gap: 8 },
  text: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' }
});
