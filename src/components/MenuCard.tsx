import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS } from '../theme/colors';

interface MenuCardProps {
  title: string;
  icon: string; // Emoji para simplicidade
  onPress: () => void;
  badgeCount?: number;
  variant?: 'default' | 'danger';
}

export function MenuCard({ 
  title, 
  icon, 
  onPress, 
  badgeCount, 
  variant = 'default' 
}: MenuCardProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.card,
        variant === 'danger' && styles.cardDanger
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
        {badgeCount !== undefined && badgeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {badgeCount > 99 ? '99+' : badgeCount}
            </Text>
          </View>
        )}
      </View>
      <Text 
        style={[
          styles.title,
          variant === 'danger' && styles.titleDanger
        ]} 
        numberOfLines={2}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 1, // Quadrado
    backgroundColor: COLORS.background.paper,
    borderRadius: 16,
    padding: 16,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  cardDanger: {
    borderColor: COLORS.states.error,
    borderWidth: 1.5,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  icon: {
    fontSize: 32,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: COLORS.states.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  titleDanger: {
    color: COLORS.states.error,
  },
});

