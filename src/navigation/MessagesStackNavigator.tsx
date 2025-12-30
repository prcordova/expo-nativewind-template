import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MessagesScreen } from '../screens/MessagesScreen';
import { ChatScreen } from '../screens/ChatScreen';

export type MessagesStackParamList = {
  MessagesList: undefined;
  Chat: {
    userId: string;
    username: string;
    avatar?: string;
  };
};

const Stack = createNativeStackNavigator<MessagesStackParamList>();

export function MessagesStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MessagesList" component={MessagesScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}

