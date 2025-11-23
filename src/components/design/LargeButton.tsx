// src/components/design/LargeButton.tsx
import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from 'react-native';
// [FIX] Importe o DefaultTheme
import styled, { DefaultTheme } from 'styled-components/native';
import { AppText } from './AppText';

// [FIX] Renomeado para não conflitar
type ButtonThemeProps = { theme: DefaultTheme };

type ButtonVariant = 'primary' | 'secondary';

interface StyledButtonProps {
  variant: ButtonVariant;
}

// [FIX] Criado um tipo que combina as props de variante e o tema
type FullStyledProps = StyledButtonProps & ButtonThemeProps;

const ButtonWrapper = styled(TouchableOpacity)<StyledButtonProps>`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;

  /* Estilo "Etiqueta Kraft" Primária */
  /* [FIX] Adicionado o tipo 'FullStyledProps' */
  ${(props: FullStyledProps) =>
    props.variant === 'primary' &&
    `
    background-color: ${props.theme.colors.cookieGold};
    border: 2px solid ${props.theme.colors.chocolate};
  `}

  /* Estilo "Anotação" Secundária */
  /* [FIX] Adicionado o tipo 'FullStyledProps' */
  ${(props: FullStyledProps) =>
    props.variant === 'secondary' &&
    `
    background-color: #fff;
    border: 2px dashed ${props.theme.colors.mutedBrown};
  `}
`;

interface LargeButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
}

export const LargeButton = ({
  title,
  variant = 'primary',
  isLoading = false,
  ...props
}: LargeButtonProps) => {
  const textColor = variant === 'primary' ? '#fff' : undefined; // Usa a cor padrão

  return (
    <ButtonWrapper variant={variant} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? (
        <ActivityIndicator color={textColor || '#000'} />
      ) : (
        <AppText type="heading" style={{ fontSize: 20, color: textColor }}>
          {title}
        </AppText>
      )}
    </ButtonWrapper>
  );
};