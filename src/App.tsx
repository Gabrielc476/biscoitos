// src/App.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components/native';

import { theme, fonts } from '@/constants/theme';
import { useFonts } from 'expo-font';
import { Kalam_700Bold } from '@expo-google-fonts/kalam';
import { Nunito_400Regular } from '@expo-google-fonts/nunito';

// [MUDANÇA] Importe o seu navegador principal
import { RootNavigator } from '@/navigation/RootNavigator'; 

const queryClient = new QueryClient();

export default function App() {
  let [fontsLoaded] = useFonts({
    Kalam_700Bold,
    Nunito_400Regular,
  });

  if (!fontsLoaded) {
    return null; // Segura o app enquanto as fontes carregam
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <StatusBar style="dark" backgroundColor={theme.colors.parchment} />
          
          {/* [MUDANÇA] Renderiza o navegador em vez do texto */}
          <RootNavigator /> 

        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}