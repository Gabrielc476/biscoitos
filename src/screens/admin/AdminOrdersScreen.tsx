import React, { useState } from 'react';
import { FlatList, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { PageContainer } from '@/components/design/PageContainer';
import { AppText } from '@/components/design/AppText';
import { useOrders } from '@/hooks/useOrders';
import { AdminStackParamList } from '@/navigation/types';
import { Order } from '@/services/ordersApi';

type AdminNavProp = NativeStackNavigationProp<AdminStackParamList, 'AdminOrders'>;
type ThemeProps = { theme: DefaultTheme };

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

const BackButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
  align-self: flex-start;
`;

const OrderCardContainer = styled.TouchableOpacity`
  background-color: #fff;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  border: 1px solid #eee;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  elevation: 2;
`;

const StatusBadge = styled.View<{ status: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${(props: any) => {
        switch (props.status) {
            case 'PENDENTE': return '#FFECB3';
            case 'EM_PRODUCAO': return '#BBDEFB';
            case 'PRONTO': return '#C8E6C9';
            case 'ENTREGUE': return '#E0E0E0';
            case 'CANCELADO': return '#FFCDD2';
            default: return '#F5F5F5';
        }
    }};
  align-self: flex-start;
  margin-bottom: 8px;
`;

const StatusText = styled(AppText)`
  font-size: 12px;
  font-weight: bold;
  color: #444;
`;

export const AdminOrdersScreen = () => {
    const navigation = useNavigation<AdminNavProp>();
    const { data: orders, isLoading, refetch } = useOrders();
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

    const renderItem = ({ item }: { item: Order }) => (
        <OrderCardContainer>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View>
                    <StatusBadge status={item.status}>
                        <StatusText>{item.status}</StatusText>
                    </StatusBadge>
                    <AppText type="heading" style={{ fontSize: 18 }}>{item.clienteNome}</AppText>
                    <AppText style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
                        Entrega: {new Date(item.dataEntrega).toLocaleDateString()}
                    </AppText>
                </View>
                <AppText type="heading" style={{ fontSize: 16, color: '#5D4037' }}>
                    {item.totalFormatado}
                </AppText>
            </View>

            <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#eee' }}>
                <AppText style={{ fontSize: 14, color: '#444' }} numberOfLines={2}>
                    {item.resumoItens}
                </AppText>
            </View>
        </OrderCardContainer>
    );

    return (
        <PageContainer>
            <BackButton onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#5D4037" />
                <AppText type="label" style={{ marginLeft: 8, fontSize: 16 }}>Voltar</AppText>
            </BackButton>

            <AppText type="heading" style={{ marginBottom: 16 }}>
                Encomendas
            </AppText>

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                refreshing={refreshing}
                onRefresh={onRefresh}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListEmptyComponent={
                    <AppText style={{ textAlign: 'center', marginTop: 40, opacity: 0.5 }}>
                        Nenhuma encomenda encontrada.
                    </AppText>
                }
            />

            <FabButton onPress={() => navigation.navigate('AdminCreateOrder')}>
                <AppText type="heading" style={{ fontSize: 32, color: '#fff', marginTop: -2 }}>
                    +
                </AppText>
            </FabButton>
        </PageContainer>
    );
};
