import React, { useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View, Alert, FlatList, ActivityIndicator, Platform } from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { PageContainer } from '@/components/design/PageContainer';
import { AppText } from '@/components/design/AppText';
import { useProducts } from '@/hooks/useProduct';
import { useCreateOrder } from '@/hooks/useOrders';
import { AdminStackParamList } from '@/navigation/types';
import { OrderItemInput } from '@/services/ordersApi';

type AdminNavProp = NativeStackNavigationProp<AdminStackParamList, 'AdminCreateOrder'>;
type ThemeProps = { theme: DefaultTheme };

const BackButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
  align-self: flex-start;
`;

const FormLabel = styled(AppText)`
  font-size: 16px;
  color: #5D4037;
  margin-bottom: 8px;
  font-weight: bold;
`;

const Input = styled(TextInput)`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  color: #333;
  margin-bottom: 16px;
`;

const DateButton = styled.TouchableOpacity`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitle = styled(AppText)`
  font-size: 18px;
  font-weight: bold;
  color: #5D4037;
  margin-top: 16px;
  margin-bottom: 8px;
`;

const ProductItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 8px;
  border: 1px solid #eee;
`;

const AddButton = styled.TouchableOpacity`
  background-color: #E0E0E0;
  padding: 8px 12px;
  border-radius: 6px;
`;

const SelectedItemContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #FFF8E1;
  border-radius: 8px;
  margin-bottom: 8px;
  border: 1px solid #FFE082;
`;

const QuantityControl = styled.View`
  flex-direction: row;
  align-items: center;
`;

const QtyButton = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  background-color: #FFD54F;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: ${(props: ThemeProps) => props.theme.colors.cookieGold};
  padding: 16px;
  border-radius: 8px;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 40px;
`;

export const AdminCreateOrderScreen = () => {
    const navigation = useNavigation<AdminNavProp>();
    const { data: products } = useProducts();
    const createOrderMutation = useCreateOrder(() => navigation.goBack());

    const [clienteNome, setClienteNome] = useState('');

    // Data inicial: Amanhã
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [dataEntrega, setDataEntrega] = useState(tomorrow);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [selectedItems, setSelectedItems] = useState<OrderItemInput[]>([]);
    const [promocoes, setPromocoes] = useState({ family: false, special: false });

    const handleAddItem = (produtoId: string) => {
        const existingItem = selectedItems.find(item => item.produtoId === produtoId);
        if (existingItem) {
            Alert.alert('Produto já adicionado', 'Aumente a quantidade na lista de itens selecionados.');
            return;
        }
        setSelectedItems([...selectedItems, { produtoId, quantidade: 1 }]);
    };

    const handleUpdateQuantity = (produtoId: string, delta: number) => {
        setSelectedItems(prevItems =>
            prevItems.map(item => {
                if (item.produtoId === produtoId) {
                    const newQty = item.quantidade + delta;
                    return newQty > 0 ? { ...item, quantidade: newQty } : item;
                }
                return item;
            })
        );
    };

    const handleRemoveItem = (produtoId: string) => {
        setSelectedItems(prevItems => prevItems.filter(item => item.produtoId !== produtoId));
    };

    const onChangeDate = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || dataEntrega;
        setShowDatePicker(Platform.OS === 'ios'); // No iOS mantém aberto se quiser, mas aqui vamos fechar no Android
        if (event.type === 'set' || Platform.OS === 'ios') {
            setDataEntrega(currentDate);
        }
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
    };

    const handleSubmit = () => {
        if (!clienteNome.trim()) {
            Alert.alert('Erro', 'Informe o nome do cliente.');
            return;
        }
        if (selectedItems.length === 0) {
            Alert.alert('Erro', 'Adicione pelo menos um produto.');
            return;
        }

        createOrderMutation.mutate({
            clienteNome,
            dataEntrega,
            itens: selectedItems,
            promocoesSelecionadas: promocoes,
        });
    };

    return (
        <PageContainer>
            <BackButton onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#5D4037" />
                <AppText type="label" style={{ marginLeft: 8, fontSize: 16 }}>Voltar</AppText>
            </BackButton>

            <AppText type="heading" style={{ marginBottom: 16 }}>Nova Encomenda</AppText>

            <ScrollView showsVerticalScrollIndicator={false}>
                <FormLabel>Nome do Cliente</FormLabel>
                <Input
                    placeholder="Ex: Maria Silva"
                    value={clienteNome}
                    onChangeText={setClienteNome}
                />

                <FormLabel>Data de Entrega</FormLabel>
                <DateButton onPress={() => setShowDatePicker(true)}>
                    <AppText style={{ fontSize: 16, color: '#333' }}>
                        {dataEntrega.toLocaleDateString('pt-BR')}
                    </AppText>
                    <Ionicons name="calendar-outline" size={20} color="#5D4037" />
                </DateButton>

                {showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={dataEntrega}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={onChangeDate}
                        minimumDate={new Date()}
                    />
                )}

                <SectionTitle>Itens Selecionados</SectionTitle>
                {selectedItems.length === 0 && (
                    <AppText style={{ color: '#999', fontStyle: 'italic', marginBottom: 10 }}>
                        Nenhum item selecionado.
                    </AppText>
                )}
                {selectedItems.map(item => {
                    const product = products?.find(p => p.id === item.produtoId);
                    return (
                        <SelectedItemContainer key={item.produtoId}>
                            <View style={{ flex: 1 }}>
                                <AppText style={{ fontWeight: 'bold' }}>{product?.nome || 'Produto'}</AppText>
                                <AppText style={{ fontSize: 12, color: '#666' }}>{product?.precoFormatado}</AppText>
                            </View>

                            <QuantityControl>
                                <QtyButton onPress={() => handleUpdateQuantity(item.produtoId, -1)}>
                                    <AppText>-</AppText>
                                </QtyButton>
                                <AppText style={{ marginHorizontal: 12, fontWeight: 'bold' }}>{item.quantidade}</AppText>
                                <QtyButton onPress={() => handleUpdateQuantity(item.produtoId, 1)}>
                                    <AppText>+</AppText>
                                </QtyButton>
                            </QuantityControl>

                            <TouchableOpacity onPress={() => handleRemoveItem(item.produtoId)} style={{ marginLeft: 12 }}>
                                <Ionicons name="trash-outline" size={20} color="#D32F2F" />
                            </TouchableOpacity>
                        </SelectedItemContainer>
                    );
                })}

                <SectionTitle>Adicionar Produtos</SectionTitle>
                {products?.map(product => (
                    <ProductItem key={product.id}>
                        <View>
                            <AppText style={{ fontWeight: 'bold' }}>{product.nome}</AppText>
                            <AppText style={{ fontSize: 12, color: '#666' }}>{product.precoFormatado}</AppText>
                        </View>
                        <AddButton onPress={() => handleAddItem(product.id)}>
                            <AppText style={{ fontSize: 12 }}>Adicionar</AppText>
                        </AddButton>
                    </ProductItem>
                ))}

                <SectionTitle>Promoções</SectionTitle>
                <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', borderStyle: 'dashed' }}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
                        onPress={() => setPromocoes(p => ({ ...p, family: !p.family }))}
                    >
                        <View style={{
                            width: 24, height: 24, borderRadius: 4, borderWidth: 2, borderColor: '#5D4037',
                            backgroundColor: promocoes.family ? '#5D4037' : 'transparent',
                            marginRight: 12, justifyContent: 'center', alignItems: 'center'
                        }}>
                            {promocoes.family && <AppText style={{ color: '#fff', fontSize: 16 }}>✓</AppText>}
                        </View>
                        <View>
                            <AppText type="label">Amigos e Família</AppText>
                            <AppText style={{ fontSize: 12, color: '#666' }}>Itens de R$ 5,90 saem por R$ 4,60 (2 por R$ 8,00)</AppText>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => setPromocoes(p => ({ ...p, special: !p.special }))}
                    >
                        <View style={{
                            width: 24, height: 24, borderRadius: 4, borderWidth: 2, borderColor: '#5D4037',
                            backgroundColor: promocoes.special ? '#5D4037' : 'transparent',
                            marginRight: 12, justifyContent: 'center', alignItems: 'center'
                        }}>
                            {promocoes.special && <AppText style={{ color: '#fff', fontSize: 16 }}>✓</AppText>}
                        </View>
                        <View>
                            <AppText type="label">Combo 2 Especiais</AppText>
                            <AppText style={{ fontSize: 12, color: '#666' }}>Itens de R$ 6,50 saem 2 por R$ 12,00</AppText>
                        </View>
                    </TouchableOpacity>
                </View>

                <SubmitButton onPress={handleSubmit} disabled={createOrderMutation.isPending}>
                    {createOrderMutation.isPending ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <AppText type="heading" style={{ color: '#fff', fontSize: 18 }}>Criar Encomenda</AppText>
                    )}
                </SubmitButton>
            </ScrollView>
        </PageContainer>
    );
};
