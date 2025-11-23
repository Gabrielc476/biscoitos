// src/screens/checkout/PaymentOptionsScreen.tsx
import React from 'react';
import styled, { DefaultTheme } from 'styled-components/native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

// Nossos Componentes e Hooks
import { AppText } from '@/components/design/AppText';
import { LargeButton } from '@/components/design/LargeButton';
// [FIX] Importe o useCartStore para limpar o carrinho
import { useCartStore } from '@/store/cartStore';

// Tipos da Navegação
import { RootStackParamList } from '@/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Tipos para 'useNavigation' e 'useRoute'
type PaymentScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PaymentOptions'
>;
type PaymentScreenRouteProp = RouteProp<
  RootStackParamList,
  'PaymentOptions'
>;

type ScreenThemeProps = { theme: DefaultTheme };

// Container "Bloco de Notas Amarelo"
const ModalContainer = styled.View`
  flex: 1;
  background-color: #fefae0; 
  padding: 24px;
`;

const Header = styled.View`
  justify-content: center;
  align-items: center;
  padding-vertical: 20px;
  border-bottom-width: 2px;
  border-bottom-color: ${(props: ScreenThemeProps) => props.theme.colors.jamAccent};
  margin-bottom: 24px;
`;

export const PaymentOptionsScreen = () => {
  const navigation = useNavigation<PaymentScreenNavigationProp>();
  const route = useRoute<PaymentScreenRouteProp>();

  // 1. Pega os dados da venda (passados da tela anterior)
  const { vendaId, totalFormatado } = route.params;

  // 2. [FIX] Pega a ação de limpar o carrinho
  const clearCart = useCartStore((state) => state.clearCart);

  // --- Ação do Botão ---

  /**
   * Cliente pagou em Dinheiro.
   * 1. Limpa o carrinho.
   * 2. Fecha o modal e volta para a tela principal.
   */
  const handleConfirmCash = () => {
    // 1. Limpa o carrinho
    clearCart();
    
    // 2. Fecha o modal e volta para o catálogo
    navigation.navigate('Main'); 
  };

  return (
    <ModalContainer>
      <Header>
        <AppText type="label" style={{ marginBottom: 8 }}>
          Venda #{vendaId.substring(0, 8)}
        </AppText>
        <AppText type="heading" style={{ fontSize: 36 }}>
          Total: {totalFormatado}
        </AppText>
      </Header>

      <AppText
        type="heading"
        style={{ fontSize: 24, marginBottom: 24, textAlign: 'center' }}
      >
        Confirmar recebimento?
      </AppText>

      {/* [FIX] Botão único. Agora é 'primary' e chama a função correta. */}
      <LargeButton
        title="Confirmar (Dinheiro)"
        variant="primary"
        onPress={handleConfirmCash}
      />
      
      {/* O botão de Gerar PIX foi removido. */}
      
    </ModalContainer>
  );
};