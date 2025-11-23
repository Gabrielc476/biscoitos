// src/components/design/PageContainer.tsx
import React from 'react';
import { SafeAreaView, ViewProps } from 'react-native';
// [FIX] Importe o DefaultTheme
import styled, { DefaultTheme } from 'styled-components/native';

// [FIX] Defina um tipo para as props com tema
type ThemeProps = { theme: DefaultTheme };

// Usamos 'SafeAreaView' para evitar o notch
const StyledSafeArea = styled(SafeAreaView)`
  flex: 1;
  /* [FIX] Adicione o tipo ThemeProps */
  background-color: ${(props: ThemeProps) => props.theme.colors.parchment};
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