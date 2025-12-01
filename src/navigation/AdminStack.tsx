// src/navigation/AdminStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminStackParamList } from './types';
import { AdminHistoryScreen } from '@/screens/admin/AdminHistoryScreen';
import { AdminProductListScreen } from '@/screens/admin/AdminProductListScreen';
import { AdminCreateProductScreen } from '@/screens/admin/AdminCreateProductScreen';
import { AdminOrdersScreen } from '@/screens/admin/AdminOrdersScreen';
import { AdminCreateOrderScreen } from '@/screens/admin/AdminCreateOrderScreen';

const Stack = createNativeStackNavigator<AdminStackParamList>();

export const AdminStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminHistory" component={AdminHistoryScreen} />
      <Stack.Screen name="AdminProductList" component={AdminProductListScreen} />
      <Stack.Screen name="AdminCreateProduct" component={AdminCreateProductScreen} />

      {/* Telas de Encomendas */}
      <Stack.Screen name="AdminOrders" component={AdminOrdersScreen} />
      <Stack.Screen name="AdminCreateOrder" component={AdminCreateOrderScreen} />
    </Stack.Navigator>
  );
};