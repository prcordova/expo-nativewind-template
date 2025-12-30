import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '../components/Header';
import { COLORS } from '../theme/colors';
import Ionicons from '@expo/vector-icons/Ionicons';

type SearchStackParamList = {
  SearchHome: undefined;
  SearchUsers: undefined;
  SearchShops: undefined;
};

type SearchHomeScreenNavigationProp = NativeStackNavigationProp<
  SearchStackParamList,
  'SearchHome'
>;

       export function SearchHomeScreen() {
         const navigation = useNavigation<any>();
         const [isRefreshing, setIsRefreshing] = useState(false);

         return (
           <View style={styles.container}>
             <Header 
               onLogoPress={() => {
                 const parent = navigation.getParent();
                 if (parent) {
                   parent.navigate('FeedTab' as never);
                 } else {
                   navigation.navigate('FeedTab' as never);
                 }
               }}
             />

      <View style={styles.content}>
        <Text style={styles.title}>O que você está procurando?</Text>
        <Text style={styles.subtitle}>
          Escolha uma opção abaixo para começar sua busca
        </Text>

        <View style={styles.optionsContainer}>
          {/* Opção Buscar Pessoas */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => navigation.navigate('SearchUsers')}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="people" size={48} color={COLORS.secondary.main} />
            </View>
            <Text style={styles.optionTitle}>Buscar Pessoas</Text>
            <Text style={styles.optionDescription}>
              Encontre e conecte-se com outros usuários
            </Text>
            <View style={styles.optionArrow}>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={COLORS.text.tertiary}
              />
            </View>
          </TouchableOpacity>

          {/* Opção Buscar Lojas */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => navigation.navigate('SearchShops')}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="storefront"
                size={48}
                color={COLORS.primary.main}
              />
            </View>
            <Text style={styles.optionTitle}>Buscar Lojas</Text>
            <Text style={styles.optionDescription}>
              Explore produtos e serviços incríveis
            </Text>
            <View style={styles.optionArrow}>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={COLORS.text.tertiary}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.default,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: COLORS.background.paper,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  optionArrow: {
    position: 'absolute',
    top: 24,
    right: 24,
  },
});

