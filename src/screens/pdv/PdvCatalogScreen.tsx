// src/screens/pdv/PdvCatalogScreen.tsx
import React from 'react';
import { ActivityIndicator, FlatList, ListRenderItem } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled, { DefaultTheme } from 'styled-components/native';

// Nossos Componentes de UI
import { PageContainer } from '@/components/design/PageContainer';
import { AppText } from '@/components/design/AppText';
import { ProductCard } from '@/components/design/ProductCard';
import { CartFooter } from '@/components/features/CartFooter';

// Nossos Hooks de Dados
import { useProducts } from '@/hooks/useProduct';
import { useCartStore } from '@/store/cartStore';

import { RootStackParamList } from '@/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ListarProdutosOutputDTO } from '@/services/productsApi';

type PdvNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Main'
>;
type ThemeProps = { theme: DefaultTheme };

export const PdvCatalogScreen = () => {
  const navigation = useNavigation<PdvNavigationProp>();

  const { data: products, isLoading, error } = useProducts();

  // Hooks do carrinho (Seletores separados para evitar loop)
  const addItem = useCartStore((state) => state.addItem);

  // Função para o botão "Adicionar" no card
  const handleAddProduct = (product: ListarProdutosOutputDTO) => {
    if (!product.precoVendaEmCentavos) {
      console.error('Produto sem precoVendaEmCentavos!', product);
      alert('Erro: Produto sem preço. Verifique o DTO da API.');
      return;
    }

    addItem({
      id: product.id,
      nome: product.nome,
      precoVendaEmCentavos: product.precoVendaEmCentavos,
    });
  };

  // Apenas abre a tela de detalhes
  const handleOpenCart = () => {
    navigation.navigate('CartDetails');
  };

  // --- Renderização ---

  if (isLoading) {
    return (
      <PageContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <AppText type="label">Carregando biscoitos...</AppText>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
        <AppText type="heading">Ops!</AppText>
        <AppText color="red">{error.message}</AppText>
      </PageContainer>
    );
  }

  const renderProductItem: ListRenderItem<ListarProdutosOutputDTO> = ({ item }) => (
    <ProductCard
      nome={item.nome}
      precoFormatado={item.precoFormatado}
      estoque={item.quantidadeEstoque || 0}
      imagemUrl={item.imagemUrl}
      onAddPress={() => handleAddProduct(item)}
    />
  );

  return (
    <PageContainer>
      <AppText type="heading" style={{ marginBottom: 16 }}>
        Nossos Biscoitos
      </AppText>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProductItem}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <CartFooter onPressCheckout={handleOpenCart} />

    </PageContainer>
  );
};