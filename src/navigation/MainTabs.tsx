// src/navigation/MainTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabsParamList } from './types';
import { PdvStack } from './PdvStack';
import { AdminStack } from './AdminStack';
import { useTheme } from 'styled-components/native';

// (Precisaremos de ícones, por enquanto usaremos texto)
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator<MainTabsParamList>();

export const MainTabs = () => {
  const theme = useTheme(); // Pega o tema (cores, fontes)

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Os headers estão nas Stacks internas

        // --- Estilo "Scrapbook" para as Abas ---
        tabBarActiveTintColor: theme.colors.chocolate, // Cor da tinta
        tabBarInactiveTintColor: theme.colors.mutedBrown,

        tabBarStyle: {
          backgroundColor: theme.colors.parchment, // Fundo de papel
          borderTopColor: theme.colors.mutedBrown, // Divisória
          borderTopWidth: 0.5,
        },

        tabBarLabelStyle: {
          fontFamily: theme.fonts.body, // Fonte do caderno
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Pdv"
        component={PdvStack}
        options={{
          title: 'PDV',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pricetag-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Admin"
        component={AdminStack}
        options={{
          title: 'Admin',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};