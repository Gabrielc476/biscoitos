import React from 'react';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';
import { AppText } from '../design/AppText';
import { useUpdateStock } from '@/hooks/useProduct';

type ThemeProps = { theme: DefaultTheme };

// Reutiliza o estilo base do cartão
const CardContainer = styled.View`
  background-color: #fff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  flex-direction: row;
  align-items: center;
  
  /* Borda diferente para o Admin (Azulada/Cinza em vez de marrom) */
  border: 1px solid ${(props: ThemeProps) => props.theme.colors.mutedBrown};
  border-left-width: 6px; /* Destaque lateral */
  border-left-color: ${(props: ThemeProps) => props.theme.colors.cookieGold};
  
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  elevation: 2;
`;

const InfoColumn = styled.View`
  flex: 1;
`;

const StockControl = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props: ThemeProps) => props.theme.colors.parchment};
  border-radius: 8px;
  padding: 4px;
  border: 1px dashed ${(props: ThemeProps) => props.theme.colors.mutedBrown};
`;

const StockButton = styled(TouchableOpacity)`
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

interface AdminProductCardProps {
  id: string;
  nome: string;
  precoFormatado: string;
  estoqueAtual: number;
}

export const AdminProductCard = ({
  id,
  nome,
  precoFormatado,
  estoqueAtual,
}: AdminProductCardProps) => {
  // Usa o hook de atualização de estoque
  const { mutate: updateStock, isPending } = useUpdateStock();

  const handleIncrement = () => {
    updateStock({ id, novoEstoque: estoqueAtual + 1 });
  };

  const handleDecrement = () => {
    if (estoqueAtual > 0) {
      updateStock({ id, novoEstoque: estoqueAtual - 1 });
    }
  };

  return (
    <CardContainer>
      <InfoColumn>
        <AppText type="heading" style={{ fontSize: 18 }}>
          {nome}
        </AppText>
        <AppText type="label">
          {precoFormatado} (Venda)
        </AppText>
        
        <View style={{ flexDirection: 'row', marginTop: 6 }}>
          {estoqueAtual === 0 && (
            <AppText type="label" style={{ color: 'red', fontWeight: 'bold' }}>
              ESGOTADO
            </AppText>
          )}
        </View>
      </InfoColumn>

      <StockControl>
        {/* Botão Menos */}
        <StockButton onPress={handleDecrement} disabled={isPending || estoqueAtual === 0}>
          <AppText type="heading" style={{ fontSize: 18, color: '#C06C84' }}>-</AppText>
        </StockButton>

        {/* Mostrador de Estoque */}
        <View style={{ minWidth: 40, alignItems: 'center' }}>
          {isPending ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <AppText type="heading" style={{ fontSize: 18 }}>
              {estoqueAtual}
            </AppText>
          )}
        </View>

        {/* Botão Mais */}
        <StockButton onPress={handleIncrement} disabled={isPending}>
          <AppText type="heading" style={{ fontSize: 18, color: 'green' }}>+</AppText>
        </StockButton>
      </StockControl>
    </CardContainer>
  );
};
