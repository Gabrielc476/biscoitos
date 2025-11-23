// src/components/features/CartFooter.tsx
import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';
import { useCartStore } from '@/store/cartStore';
import { AppText } from '../design/AppText';

// [FIX] Defina um tipo para as props com tema
type ThemeProps = { theme: DefaultTheme };

// Simula papel quadriculado "colado" na base
const FooterContainer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  
  padding: 16px;
  padding-bottom: 24px; /* Mais espaço para a 'safe area' inferior */
  
  /* [FIX] Adicione o tipo ThemeProps */
  background-color: ${(props: ThemeProps) => props.theme.colors.parchment};
  
  border-top-width: 2px;
  /* [FIX] Adicione o tipo ThemeProps */
  border-top-color: ${(props: ThemeProps) => props.theme.colors.mutedBrown};
  border-style: dashed;
  
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  
  /* Sombra leve para destacar do conteúdo */
  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.05;
  shadow-radius: 3px;
  elevation: 5;
`;

// Botão "Etiqueta Kraft"
const CheckoutButton = styled(TouchableOpacity)`
  /* [FIX] Adicione o tipo ThemeProps */
  background-color: ${(props: ThemeProps) => props.theme.colors.cookieGold};
  padding: 12px 20px;
  border-radius: 8px;
`;

// Formata R$ 0,00
const formatCurrency = (cents: number) => {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

interface CartFooterProps {
  onPressCheckout: () => void;
}

export const CartFooter = ({ onPressCheckout }: CartFooterProps) => {
  // [FIX] Seletores separados para evitar re-renders desnecessários (Loop Infinito)
  const totalItens = useCartStore((state) => state.totalItens);
  const totalEmCentavos = useCartStore((state) => state.totalEmCentavos);

  // Se não tem itens, esconde o rodapé
  if (totalItens === 0) {
    return null;
  }

  return (
    <FooterContainer>
      <AppText type="label" style={{ width: 60 }}>
        {totalItens} item(ns)
      </AppText>
      
      <AppText type="heading" style={{ fontSize: 22 }}>
        {formatCurrency(totalEmCentavos)}
      </AppText>
      
      <CheckoutButton onPress={onPressCheckout}>
        <AppText type="heading" style={{ fontSize: 18, color: '#fff' }}>
          Ver Carrinho
        </AppText>
      </CheckoutButton>
    </FooterContainer>
  );
};