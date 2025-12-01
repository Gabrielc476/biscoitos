import React, { useState } from 'react';
import { FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { PageContainer } from '@/components/design/PageContainer';
import { AppText } from '@/components/design/AppText';
import { AdminProductCard } from '@/components/features/AdminProductCard';
import { useProducts } from '@/hooks/useProduct';
import { AdminStackParamList } from '@/navigation/types';

type AdminNavProp = NativeStackNavigationProp<AdminStackParamList, 'AdminProductList'>;
type ThemeProps = { theme: DefaultTheme };

// Botão Flutuante (FAB)
const FabButton = styled(TouchableOpacity)`
  position: absolute;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: ${(props: ThemeProps) => props.theme.colors.cookieGold};
  justify-content: center;
  align-items: center;
  
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
  elevation: 6;
  border: 2px solid #fff;
  border-style: dashed;
`;

// Botão de Voltar
const BackButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
  align-self: flex-start;
`;

export const AdminProductListScreen = () => {
  const navigation = useNavigation<AdminNavProp>();
  const { data: products, isLoading, refetch } = useProducts();

  if (products && products.length > 0) {
    console.log('🔍 [Screen] Produtos na tela:', JSON.stringify(products[0], null, 2));
  }
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading && !refreshing) {
    return (
      <PageContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Botão de Voltar */}
      <BackButton onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#5D4037" />
        <AppText type="label" style={{ marginLeft: 8, fontSize: 16 }}>Voltar</AppText>
      </BackButton>

      <AppText type="heading" style={{ marginBottom: 16 }}>
        Estoque de Biscoitos
      </AppText>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AdminProductCard
            id={item.id}
            nome={item.nome}
            precoFormatado={item.precoFormatado}
            estoqueAtual={item.quantidadeEstoque}
            imagemUrl={item.imagemUrl}
          />
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <AppText style={{ textAlign: 'center', marginTop: 40, opacity: 0.5 }}>
            Nenhum produto cadastrado.
          </AppText>
        }
      />

      {/* Botão para Criar Produto */}
      <FabButton onPress={() => navigation.navigate('AdminCreateProduct')}>
        <AppText type="heading" style={{ fontSize: 32, color: '#fff', marginTop: -2 }}>
          +
        </AppText>
      </FabButton>
    </PageContainer>
  );
};