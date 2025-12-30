import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FeedScreen } from '../screens/FeedScreen';
import { FriendsScreen } from '../screens/FriendsScreen';
import { ProfileStackNavigator } from './ProfileStackNavigator';
import { SearchStackNavigator } from './SearchStackNavigator';
import { MessagesStackNavigator } from './MessagesStackNavigator';
import { UserProfileScreen } from '../screens/UserProfileScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../theme/colors';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.secondary.main, // #B63385 - Rosa Melter (ativo)
        tabBarInactiveTintColor: COLORS.text.tertiary, // #6b7280 - Cinza (inativo)
        tabBarStyle: {
          backgroundColor: COLORS.background.paper, // #ffffff
          borderTopWidth: 1,
          borderTopColor: COLORS.border.light, // #f1f5f9
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom || 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="FeedTab"
        component={FeedScreen}
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
             <Tab.Screen
               name="SearchStack"
               component={SearchStackNavigator}
               options={{
                 tabBarLabel: 'Buscar',
                 tabBarIcon: ({ color, size }) => (
                   <Ionicons name="search" size={size} color={color} />
                 ),
               }}
             />
             <Tab.Screen
               name="FriendsTab"
               component={FriendsScreen}
               options={{
                 tabBarLabel: 'Amigos',
                 tabBarIcon: ({ color, size }) => (
                   <Ionicons name="people" size={size} color={color} />
                 ),
               }}
             />
             <Tab.Screen
               name="MessagesStack"
        component={MessagesStackNavigator}
        options={{
          tabBarLabel: 'Mensagens',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{
          tabBarItemStyle: { display: 'none' },
        }}
      />
    </Tab.Navigator>
  );
}

