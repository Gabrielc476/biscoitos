// src/navigation/AdminStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminStackParamList } from './types';
import { AdminHistoryScreen } from '@/screens/admin/AdminHistoryScreen';
import { AdminProductListScreen } from '@/screens/admin/AdminProductListScreen';
// [NOVO] Importaremos a tela que vamos criar
import { AdminCreateProductScreen } from '@/screens/admin/AdminCreateProductScreen';

const Stack = createNativeStackNavigator<AdminStackParamList>();

export const AdminStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminHistory" component={AdminHistoryScreen} />
      <Stack.Screen name="AdminProductList" component={AdminProductListScreen} />
      {/* [NOVO] Registrando a tela */}
      <Stack.Screen name="AdminCreateProduct" component={AdminCreateProductScreen} />
    </Stack.Navigator>
  );
};