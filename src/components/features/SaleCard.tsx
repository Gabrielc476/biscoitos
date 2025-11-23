// src/components/features/SaleCard.tsx
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';
import { AppText } from '../design/AppText';

// Tipos
import { ListarVendasOutputDTO } from '@/services/salesApi';

type ThemeProps = { theme: DefaultTheme };

// O cartão parece um pedaço de papel rasgado ou um recibo
const CardContainer = styled(TouchableOpacity)`
  background-color: #fff;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 4px;
  
  /* Borda tracejada em baixo para simular destaque */
  border-bottom-width: 2px;
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.mutedBrown};
  border-style: dashed;

  /* Sombra leve */
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
  elevation: 2;
  
  position: relative;
  overflow: hidden; 
`;

// O "Carimbo" de Status
const StatusStamp = styled.View<{ status: string }>`
  position: absolute;
  top: 10px;
  right: -10px;
  padding: 4px 20px;
  transform: rotate(15deg);
  border: 2px solid;
  border-radius: 4px;
  opacity: 0.8;

  ${(props) => {
    if (props.status === 'Pago') {
      return `
        border-color: green;
        background-color: rgba(0, 128, 0, 0.1);
      `;
    }
    return `
      border-color: ${props.theme.colors.jamAccent};
      background-color: rgba(192, 108, 132, 0.1);
    `;
  }}
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

interface SaleCardProps {
  venda: ListarVendasOutputDTO;
  onPress: () => void;
}

export const SaleCard = ({ venda, onPress }: SaleCardProps) => {
  const isPago = venda.status === 'Pago';

  return (
    <CardContainer onPress={onPress} activeOpacity={0.8}>
      {/* Carimbo Visual */}
      <StatusStamp status={venda.status}>
        <AppText 
          type="heading" 
          style={{ fontSize: 14, color: isPago ? 'green' : '#C06C84' }}
        >
          {venda.status.toUpperCase()}
        </AppText>
      </StatusStamp>

      {/* Cabeçalho: Data e ID */}
      <Row>
        <AppText type="label">{venda.data}</AppText>
        <AppText type="label" style={{ marginRight: 60 }}>
          #{venda.vendaId.substring(0, 6)}...
        </AppText>
      </Row>

      {/* Valor Total (Grande Destaque) */}
      <AppText type="heading" style={{ fontSize: 24, marginVertical: 4 }}>
        {venda.totalFormatado}
      </AppText>

      {/* Resumo dos Itens */}
      <AppText type="body" style={{ fontSize: 14, color: '#666' }}>
        {venda.resumoItens}
      </AppText>

      {!isPago && (
        <AppText type="accent" style={{ fontSize: 12, marginTop: 8 }}>
          Toque para confirmar pagamento →
        </AppText>
      )}
    </CardContainer>
  );
};