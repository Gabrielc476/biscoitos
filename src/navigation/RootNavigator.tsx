// src/navigation/RootNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { MainTabs } from './MainTabs';
import { PaymentOptionsScreen } from '@/screens/checkout/PaymentOptionsScreen';
import { CartDetailsScreen } from '@/screens/checkout/CartDetailsScreen';
// [FIX] Removida a importação do PixDisplayScreen

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator>
      {/* 1. As Abas Principais (PDV e Admin) */}
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      
      {/* 2. O Grupo de Modais (Checkout) */}
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
        }}
      >
        <Stack.Screen
          name="PaymentOptions"
          component={PaymentOptionsScreen}
          options={{ title: 'Confirmar Pagamento' }} // [FIX] Título atualizado
        />
        <Stack.Screen 
    name="CartDetails" 
    component={CartDetailsScreen} // Vamos criar este arquivo já já
    options={{ title: 'Revisar Pedido' }} 
  />
        
        {/* [FIX] A tela de PIX foi removida daqui */}
        
      </Stack.Group>
    </Stack.Navigator>
  );
};