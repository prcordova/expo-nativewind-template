import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackButton } from '../components/BackButton';
import { MenuCard } from '../components/MenuCard';
import { COLORS } from '../theme/colors';

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const settingsOptions = [
    { id: 'links', title: 'Links', icon: '🔗', screen: 'LinksSettings' },
    { id: 'appearance', title: 'Aparência', icon: '🎨', screen: 'AppearanceSettings' },
    { id: 'wallet', title: 'Carteira', icon: '💰', screen: 'WalletSettings' },
    { id: 'preferences', title: 'Preferências', icon: '⚙️', screen: 'PreferencesSettings' },
    { id: 'security', title: 'Segurança', icon: '🔒', screen: 'SecuritySettings' },
    { id: 'privacity', title: 'Privacidade', icon: '👁️', screen: 'PrivacitySettings' },
    { id: 'analytics', title: 'Análises', icon: '📊', screen: 'AnalyticsSettings' },
    { id: 'promotions', title: 'Promoções', icon: '🎁', screen: 'PromotionsSettings' },
  ];

  const handleOptionPress = (screen: string) => {
    navigation.navigate(screen as never);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Grid de Opções */}
        <View style={styles.menuGrid}>
          {settingsOptions.map((option) => (
            <MenuCard
              key={option.id}
              title={option.title}
              icon={option.icon}
              onPress={() => handleOptionPress(option.screen)}
            />
          ))}
        </View>
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
  scrollContent: {
    padding: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -8,
  },
});

