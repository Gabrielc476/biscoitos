// src/components/design/ProductCard.tsx
import React from 'react';
// [FIX] Importamos o 'DefaultTheme'
import styled, { DefaultTheme } from 'styled-components/native';
import { AppText } from './AppText';
import { TouchableOpacity } from 'react-native';

// [FIX] Definimos um tipo simples para as props de tema
type ThemeProps = { theme: DefaultTheme };

// O "cartão de ficha"
const CardContainer = styled.View`
  background-color: #fff; /* Fundo branco puro para contraste */
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  flex-direction: row;
  align-items: center;

  /* Simula a borda de polaroid */
  /* [FIX] Adicionamos o tipo 'ThemeProps' */
  border: 1px solid ${(props: ThemeProps) => props.theme.colors.mutedBrown};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

// Espaço para a foto (simulado)
const ImagePlaceholder = styled.View`
  width: 70px;
  height: 70px;
  border-radius: 6px;
  /* [FIX] Adicionamos o tipo 'ThemeProps' */
  background-color: ${(props: ThemeProps) => props.theme.colors.parchment};
  /* [FIX] Adicionamos o tipo 'ThemeProps' */
  border: 1px dashed ${(props: ThemeProps) => props.theme.colors.mutedBrown};
  margin-right: 12px;

  /* "Washi tape" decorativa no canto */
  &::after {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    width: 30px;
    height: 15px;
    /* [FIX] Adicionamos o tipo 'ThemeProps' */
    background-color: ${(props: ThemeProps) => props.theme.colors.jamAccent};
    opacity: 0.6;
    transform: rotate(-15deg);
  }
`;

// Coluna de informações
const InfoColumn = styled.View`
  flex: 1; /* Ocupa o espaço restante */
`;

// Botão de adicionar
const AddButton = styled(TouchableOpacity)`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  /* [FIX] Adicionamos o tipo 'ThemeProps' */
  background-color: ${(props: ThemeProps) => props.theme.colors.cookieGold};
  justify-content: center;
  align-items: center;
  margin-left: 12px;
`;

interface ProductCardProps {
  nome: string;
  precoFormatado: string;
  estoque: number;
  onAddPress: () => void;
}

export const ProductCard = ({
  nome,
  precoFormatado,
  estoque,
  onAddPress,
}: ProductCardProps) => {
  const hasStock = estoque > 0;

  return (
    <CardContainer style={{ opacity: hasStock ? 1 : 0.5 }}>
      <ImagePlaceholder />

      <InfoColumn>
        <AppText type="heading" style={{ fontSize: 20 }}>
          {nome}
        </AppText>
        <AppText type="accent" style={{ fontSize: 18, marginVertical: 4 }}>
          {precoFormatado}
        </AppText>
        <AppText type="label">
          {hasStock ? `Estoque: ${estoque}` : 'Sem estoque'}
        </AppText>
      </InfoColumn>

      <AddButton onPress={onAddPress} disabled={!hasStock}>
        <AppText
          type="heading"
          style={{ fontSize: 24, color: '#fff', lineHeight: 26 }}
        >
          +
        </AppText>
      </AddButton>
    </CardContainer>
  );
};