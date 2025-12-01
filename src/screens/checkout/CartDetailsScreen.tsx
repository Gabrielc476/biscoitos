// src/screens/checkout/CartDetailsScreen.tsx
import React, { useState } from 'react';
import { FlatList, TouchableOpacity, TextInput, View, Alert } from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PageContainer } from '@/components/design/PageContainer';
import { AppText } from '@/components/design/AppText';
import { LargeButton } from '@/components/design/LargeButton';

import { useCartStore, CartItem, ProductToAdd } from '@/store/cartStore';
import { useCreateSale } from '@/hooks/useSales';
import { RootStackParamList } from '@/navigation/types';

type CartDetailsNavProp = NativeStackNavigationProp<RootStackParamList, 'CartDetails'>;
type ThemeProps = { theme: DefaultTheme };

// --- Styled Components ---

// Linha do item (parece uma linha de caderno)
const ItemRow = styled.View`
  flex-direction: row;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.mutedBrown};
  border-style: dashed;
  align-items: center;
  justify-content: space-between;
`;

const ItemInfo = styled.View`
  flex: 1;
`;

const QuantityControls = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  border-radius: 20px;
  border: 1px solid ${(props: ThemeProps) => props.theme.colors.mutedBrown};
  margin-left: 8px;
`;

const QtyButton = styled(TouchableOpacity)`
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
`;

const RemoveButton = styled(TouchableOpacity)`
  padding: 8px;
  margin-left: 8px;
`;

const TotalFooter = styled.View`
  margin-top: 20px;
  padding-top: 20px;
  border-top-width: 2px;
  border-top-color: ${(props: ThemeProps) => props.theme.colors.chocolate};
  margin-bottom: 20px;
`;

// Input para editar preço (escondido por padrão)
const PriceInput = styled(TextInput)`
  font-family: ${(props: ThemeProps) => props.theme.fonts.body};
  font-size: 16px;
  color: ${(props: ThemeProps) => props.theme.colors.chocolate};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.jamAccent};
  min-width: 80px;
  text-align: right;
`;

// --- Componente de Item Individual ---

const CartItemComponent = ({ item }: { item: CartItem }) => {
  // Hooks do store para manipular este item
  const addItem = useCartStore((state) => state.addItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updatePrice = useCartStore((state) => state.updateItemPrice);

  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [priceText, setPriceText] = useState((item.precoVendaEmCentavos / 100).toFixed(2));

  const formatCurrency = (cents: number) => {
    return (cents / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleConfirmPrice = () => {
    // Converte "5,90" ou "5.90" para centavos
    const cleanValue = priceText.replace(',', '.');
    const floatValue = parseFloat(cleanValue);

    if (!isNaN(floatValue) && floatValue >= 0) {
      updatePrice(item.produtoId, Math.round(floatValue * 100));
    } else {
      // Reverte se inválido
      setPriceText((item.precoVendaEmCentavos / 100).toFixed(2));
    }
    setIsEditingPrice(false);
  };

  // Helper para adaptar o objeto para ProductToAdd
  const handleIncrement = () => {
    addItem({
      id: item.produtoId,
      nome: item.nome,
      precoVendaEmCentavos: item.precoVendaEmCentavos
    });
  };

  return (
    <ItemRow>
      <ItemInfo>
        <AppText type="heading" style={{ fontSize: 18 }}>{item.nome}</AppText>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          {isEditingPrice ? (
            <PriceInput
              value={priceText}
              onChangeText={setPriceText}
              keyboardType="numeric"
              onBlur={handleConfirmPrice}
              autoFocus
              returnKeyType="done"
            />
          ) : (
            <TouchableOpacity onPress={() => setIsEditingPrice(true)}>
              {/* Mostra o preço unitário. O ícone de lápis é simbólico (texto) */}
              <AppText type="label" style={{ textDecorationLine: 'underline' }}>
                {formatCurrency(item.precoVendaEmCentavos)} ✎
              </AppText>
            </TouchableOpacity>
          )}

          <AppText type="label" style={{ marginLeft: 8 }}>
            (Total: {formatCurrency(item.precoVendaEmCentavos * item.quantidade)})
          </AppText>
        </View>
      </ItemInfo>

      {/* Controles de Quantidade */}
      <QuantityControls>
        <QtyButton onPress={() => decrementItem(item.produtoId)}>
          <AppText type="heading" style={{ fontSize: 18 }}>-</AppText>
        </QtyButton>

        <AppText style={{ marginHorizontal: 4, fontWeight: 'bold' }}>
          {item.quantidade}
        </AppText>

        <QtyButton onPress={handleIncrement}>
          <AppText type="heading" style={{ fontSize: 18 }}>+</AppText>
        </QtyButton>
      </QuantityControls>

      {/* Botão Remover (Lixeira) */}
      <RemoveButton onPress={() => removeItem(item.produtoId)}>
        <AppText type="heading" color="red" style={{ fontSize: 16 }}>X</AppText>
      </RemoveButton>
    </ItemRow>
  );
};

// --- Tela Principal ---

export const CartDetailsScreen = () => {
  const navigation = useNavigation<CartDetailsNavProp>();

  const items = useCartStore((state) => state.items);
  const totalEmCentavos = useCartStore((state) => state.totalEmCentavos);
  const clearCart = useCartStore((state) => state.clearCart);
  const activePromotions = useCartStore((state) => state.activePromotions);
  const togglePromotion = useCartStore((state) => state.togglePromotion);

  const { mutate: createSale, isPending } = useCreateSale();

  const formatTotal = (cents: number) =>
    (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleCheckout = () => {
    if (items.length === 0) return;

    const dto = {
      itens: items.map((item) => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
      })),
      promocoesSelecionadas: activePromotions,
    };

    createSale(dto, {
      onSuccess: (data) => {
        clearCart(); // [FIX] Limpa o carrinho após o sucesso
        navigation.replace('PaymentOptions', {
          vendaId: data.vendaId,
          totalFormatado: data.totalFormatado,
        });
      },
      onError: (error: any) => {
        console.log('Erro bruto:', error);

        // Tenta pegar a mensagem enviada pelo servidor (backend)
        const serverMessage = error.response?.data?.message;
        const genericMessage = error.message;

        alert(`Erro do Servidor: ${serverMessage || genericMessage}`);
      },
    });
  };

  const handleClear = () => {
    Alert.alert('Limpar Carrinho', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Limpar', style: 'destructive', onPress: () => {
          clearCart();
          navigation.goBack();
        }
      }
    ]);
  };

  return (
    <PageContainer>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText type="heading">Revisão do Pedido</AppText>
        <TouchableOpacity onPress={handleClear}>
          <AppText type="label" color="red">Limpar Tudo</AppText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.produtoId}
        renderItem={({ item }) => <CartItemComponent item={item} />}
        ListEmptyComponent={
          <AppText style={{ marginTop: 40, textAlign: 'center' }}>
            O carrinho está vazio.
          </AppText>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Seção de Promoções */}
      <View style={{ marginTop: 10, padding: 16, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', borderStyle: 'dashed' }}>
        <AppText type="heading" style={{ fontSize: 18, marginBottom: 12 }}>Promoções</AppText>

        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
          onPress={() => togglePromotion('family')}
        >
          <View style={{
            width: 24, height: 24, borderRadius: 4, borderWidth: 2, borderColor: '#5D4037',
            backgroundColor: activePromotions.family ? '#5D4037' : 'transparent',
            marginRight: 12, justifyContent: 'center', alignItems: 'center'
          }}>
            {activePromotions.family && <AppText style={{ color: '#fff', fontSize: 16 }}>✓</AppText>}
          </View>
          <View>
            <AppText type="label">Amigos e Família</AppText>
            <AppText style={{ fontSize: 12, color: '#666' }}>Itens de R$ 5,90 saem por R$ 4,60 (2 por R$ 8,00)</AppText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={() => togglePromotion('special')}
        >
          <View style={{
            width: 24, height: 24, borderRadius: 4, borderWidth: 2, borderColor: '#5D4037',
            backgroundColor: activePromotions.special ? '#5D4037' : 'transparent',
            marginRight: 12, justifyContent: 'center', alignItems: 'center'
          }}>
            {activePromotions.special && <AppText style={{ color: '#fff', fontSize: 16 }}>✓</AppText>}
          </View>
          <View>
            <AppText type="label">Combo 2 Especiais</AppText>
            <AppText style={{ fontSize: 12, color: '#666' }}>Itens de R$ 6,50 saem 2 por R$ 12,00</AppText>
          </View>
        </TouchableOpacity>
      </View>

      <TotalFooter>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <AppText type="heading" style={{ fontSize: 24 }}>Total Final:</AppText>
          <AppText type="heading" style={{ fontSize: 24 }}>
            {formatTotal(totalEmCentavos)}
          </AppText>
        </View>

        <LargeButton
          title="Confirmar Venda"
          onPress={handleCheckout}
          isLoading={isPending}
          disabled={items.length === 0}
        />

        <LargeButton
          title="Voltar ao Catálogo"
          variant="secondary"
          onPress={() => navigation.goBack()}
        />
      </TotalFooter>
    </PageContainer>
  );
};