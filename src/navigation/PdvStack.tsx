// src/navigation/PdvStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PdvStackParamList } from './types';
import { PdvCatalogScreen } from '@/screens/pdv/PdvCatalogScreen';

const Stack = createNativeStackNavigator<PdvStackParamList>();

export const PdvStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Vamos customizar o header depois
      }}
    >
      <Stack.Screen name="PdvCatalog" component={PdvCatalogScreen} />
    </Stack.Navigator>
  );
};