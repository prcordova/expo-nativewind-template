import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton } from '../../components/BackButton';
import { COLORS } from '../../theme/colors';

export function LinksSettingsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BackButton title="Configurações" />
        <Text style={styles.headerTitle}>Links</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.placeholderText}>
          🔗 Gerenciamento de Links
        </Text>
        <Text style={styles.placeholderSubtext}>
          Em breve você poderá adicionar e gerenciar seus links personalizados
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.default,
  },
  header: {
    backgroundColor: COLORS.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.secondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    textAlign: 'center',
  },
});

