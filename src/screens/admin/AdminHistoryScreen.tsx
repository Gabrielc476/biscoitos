// src/screens/admin/AdminHistoryScreen.tsx
import React, { useState } from 'react';
import { FlatList, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Componentes de UI
import { PageContainer } from '@/components/design/PageContainer';
import { AppText } from '@/components/design/AppText';
import { SaleCard } from '@/components/features/SaleCard';

// Hooks e Tipos de Dados
import { useSales, useConfirmPayment } from '@/hooks/useSales';
import { ListarVendasOutputDTO } from '@/services/salesApi';

// Tipos de Navegação
import { AdminStackParamList } from '@/navigation/types';

type AdminNavProp = NativeStackNavigationProp<AdminStackParamList, 'AdminHistory'>;
type ThemeProps = { theme: DefaultTheme };

// --- Styled Components ---

// Cabeçalho estilo "Livro Caixa"
const HeaderContainer = styled.View`
  padding-bottom: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.chocolate};
  margin-bottom: 16px;
`;

// Botão de Atalho para o Estoque (Estilo "Adesivo/Nota")
const ShortcutButton = styled.TouchableOpacity`
  padding: 8px 12px;
  background-color: #fff;
  border: 1px dashed ${(props: ThemeProps) => props.theme.colors.chocolate};
  border-radius: 4px;
  align-self: flex-start;
  margin-top: 12px;
  
  /* Sombra leve */
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;
  elevation: 2;
`;

export const AdminHistoryScreen = () => {
  // Hook de navegação tipado
  const navigation = useNavigation<AdminNavProp>();

  // 1. Buscar Vendas (TanStack Query)
  const { data: vendas, isLoading, error, refetch } = useSales();

  // 2. Ação de Confirmar Pagamento (Mutation)
  const { mutate: confirmPayment, isPending: isConfirming } = useConfirmPayment();

  // Estado para o Pull-to-Refresh
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Lógica ao clicar no card da venda
  const handlePressSale = (venda: ListarVendasOutputDTO) => {
    if (venda.status === 'Pago') {
      return; // Nada a fazer se já está pago
    }

    Alert.alert(
      'Confirmar Pagamento',
      `Deseja marcar a venda de ${venda.totalFormatado} como PAGA?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar (Recebi)',
          style: 'default',
          onPress: () => {
            confirmPayment(venda.vendaId, {
              onSuccess: () => {
                // O hook useConfirmPayment já invalida a query 'sales',
                // então a lista vai atualizar sozinha!
                Alert.alert('Sucesso', 'Pagamento registrado no livro caixa.');
              },
              onError: (err) => {
                Alert.alert('Erro', err.message);
              }
            });
          },
        },
      ]
    );
  };

  // --- Renderização ---

  if (isLoading && !refreshing) {
    return (
      <PageContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <AppText type="label" style={{ marginTop: 10 }}>
          Abrindo o livro caixa...
        </AppText>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
        <AppText type="heading">Erro</AppText>
        <AppText color="red">{error.message}</AppText>
        <AppText
          onPress={() => refetch()}
          style={{ marginTop: 20, textDecorationLine: 'underline' }}
        >
          Tentar novamente
        </AppText>
      </PageContainer>
    );
  }

  return (

    <PageContainer>
      <HeaderContainer>
        <AppText type="heading">Histórico de Vendas</AppText>
        <AppText type="label">Toque em uma venda pendente para baixar.</AppText>

        <ShortcutButton onPress={() => navigation.navigate('AdminProductList')}>
          <AppText type="accent">📦 Gerenciar Estoque →</AppText>
        </ShortcutButton>

        <ShortcutButton onPress={() => navigation.navigate('AdminOrders')} style={{ marginTop: 8 }}>
          <AppText type="accent">📅 Gerenciar Encomendas →</AppText>
        </ShortcutButton>
      </HeaderContainer>

      {isConfirming && (
        <ActivityIndicator style={{ marginBottom: 10 }} />
      )}

      <FlatList
        data={vendas}
        keyExtractor={(item) => item.vendaId}
        renderItem={({ item }) => (
          <SaleCard
            venda={item}
            onPress={() => handlePressSale(item)}
          />
        )}
        ListEmptyComponent={
          <AppText style={{ textAlign: 'center', marginTop: 40, opacity: 0.6 }}>
            Nenhuma venda registrada hoje.
          </AppText>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#D4A77A']} // Cor 'cookieGold'
            tintColor={'#D4A77A'}
          />
        }
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </PageContainer >
  );
};