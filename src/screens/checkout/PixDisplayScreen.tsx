// src/screens/checkout/PixDisplayScreen.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';

import { AppText } from '@/components/design/AppText';
import { LargeButton } from '@/components/design/LargeButton';
import { useCartStore } from '@/store/cartStore';

import { RootStackParamList } from '@/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// ... (Tipos de Navegação e Tema)
type PixScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PixDisplay'
>;
type PixScreenRouteProp = RouteProp<RootStackParamList, 'PixDisplay'>;
type ThemeProps = { theme: DefaultTheme };

// ... (Styled Components: ModalContainer, QrCodeWrapper, PixStringWrapper)
const ModalContainer = styled.View`
  flex: 1;
  background-color: #fefae0;
  padding: 24px;
  align-items: center;
`;
const QrCodeWrapper = styled.View`
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
  border: 1px solid ${(props: ThemeProps) => props.theme.colors.mutedBrown};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;
const PixStringWrapper = styled.View`
  background-color: #fff;
  border: 1px dashed ${(props: ThemeProps) => props.theme.colors.mutedBrown};
  padding: 12px;
  border-radius: 8px;
  margin-top: 24px;
  margin-bottom: 24px;
  width: 100%;
`;

export const PixDisplayScreen = () => {
  const navigation = useNavigation<PixScreenNavigationProp>();
  const route = useRoute<PixScreenRouteProp>();

  const { pixCopiaECola } = route.params;
  const clearCart = useCartStore((state) => state.clearCart);
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopyPix = async () => {
    await Clipboard.setStringAsync(pixCopiaECola);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleDone = () => {
    clearCart();
    navigation.navigate('Main'); 
  };

  return (
    <ModalContainer>
      <AppText type="heading" style={{ fontSize: 24, textAlign: 'center' }}>
        Escaneie ou copie o PIX
      </AppText>

      <QrCodeWrapper>
        <QRCode
          value={pixCopiaECola}
          size={220}
          
          // [FIX] 1. Usando o nível 'M' (Medium) de correção.
          // Este é o "ponto-certo" mais compatível.
          ecl="M" 
          
          // [FIX] 2. Removida a propriedade 'logoBackgroundColor'.
        />
      </QrCodeWrapper>

      <PixStringWrapper>
        {/* ... (resto do componente) ... */}
        <AppText type="label" style={{ marginBottom: 4 }}>
          PIX Copia e Cola:
        </AppText>
        <AppText type="body" style={{ fontSize: 13 }} numberOfLines={3}>
          {pixCopiaECola}
        </AppText>
      </PixStringWrapper>

      <LargeButton
        title={hasCopied ? 'Copiado!' : 'Copiar Chave Pix'}
        variant="primary"
        onPress={handleCopyPix}
      />

      <LargeButton
        title="Concluir Venda"
        variant="secondary"
        onPress={handleDone}
        style={{ marginTop: 8 }}
      />
    </ModalContainer>
  );
};