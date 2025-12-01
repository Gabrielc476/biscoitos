// src/components/design/PageContainer.tsx
import React from 'react';
import { ViewProps, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled, { DefaultTheme } from 'styled-components/native';

type ThemeProps = { theme: DefaultTheme };

// Usamos 'SafeAreaView' para evitar o notch
const StyledSafeArea = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props: ThemeProps) => props.theme.colors.parchment};
  padding-top: ${Platform.OS === 'android' ? StatusBar.currentHeight : 0}px;
`;

// O 'View' interno nos dá controle sobre o padding
const InnerView = styled.View`
  flex: 1;
  padding: 16px;
`;

interface PageContainerProps extends ViewProps {
  children: React.ReactNode;
}

/**
 * Componente base para todas as telas.
 * Aplica o fundo 'parchment' e o 'SafeAreaView'.
 */
export const PageContainer = ({ children, ...props }: PageContainerProps) => {
  return (
    <StyledSafeArea>
      <InnerView {...props}>{children}</InnerView>
    </StyledSafeArea>
  );
};