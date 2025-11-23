// src/components/design/AppText.tsx
import React from 'react';
import { TextProps } from 'react-native';
// [FIX] Importamos o 'DefaultTheme' que já definimos no 'styled.d.ts'
import styled, { DefaultTheme } from 'styled-components/native';

type TextType = 'heading' | 'body' | 'label' | 'accent';
type FontWeight = 'regular' | 'bold';

interface CustomTextProps extends TextProps {
  type?: TextType;
  weight?: FontWeight;
  color?: string; // Permite sobrescrever a cor
}

// [FIX] Definimos um tipo para as props + theme
type StyledProps = CustomTextProps & { theme: DefaultTheme };

const getFontFamily = (type: TextType, weight: FontWeight, themeFonts: any) => {
  if (type === 'heading') {
    return themeFonts.heading; // Kalam_700Bold
  }
  // (Poderíamos expandir para Nunito_700Bold etc. no futuro)
  return themeFonts.body; // Nunito_400Regular
};

const StyledText = styled.Text<CustomTextProps>`
  /* [FIX] Adicionamos o tipo 'StyledProps' */
  color: ${(props: StyledProps) => props.color || props.theme.colors.chocolate};

  /* [FIX] Adicionamos o tipo 'StyledProps' */
  font-family: ${(props: StyledProps) =>
    getFontFamily(
      props.type || 'body',
      props.weight || 'regular',
      props.theme.fonts,
    )};

  /* [FIX] Adicionamos o tipo 'StyledProps' */
  font-size: ${(props: StyledProps) => {
    switch (props.type) {
      case 'heading':
        return '32px';
      case 'label':
        return '14px';
      case 'accent':
        return '16px';
      default:
        return '16px'; // body
    }
  }};

  /* Ajuste de cor para tipos específicos */
  /* [FIX] Adicionamos o tipo 'StyledProps' */
  ${(props: StyledProps) =>
    props.type === 'label' && `color: ${props.theme.colors.mutedBrown};`}
  /* [FIX] Adicionamos o tipo 'StyledProps' */
  ${(props: StyledProps) =>
    props.type === 'accent' && `color: ${props.theme.colors.jamAccent};`}
`;

/**
 * Componente de Texto Padrão.
 * Use: <AppText type="heading">...</AppText>
 * Use: <AppText>...</AppText> (padrão é 'body')
 */
export const AppText = (props: CustomTextProps) => {
  return <StyledText {...props}>{props.children}</StyledText>;
};