import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, CreateOrderInput } from '../services/ordersApi';
import { Alert } from 'react-native';

export const useOrders = (status?: string) => {
    return useQuery({
        queryKey: ['orders', status],
        queryFn: () => ordersApi.fetchOrders(status),
    });
};

export const useCreateOrder = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateOrderInput) => ordersApi.createOrder(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            Alert.alert('Sucesso', 'Encomenda criada com sucesso!');
            if (onSuccess) onSuccess();
        },
        onError: (error: any) => {
            Alert.alert('Erro', `Não foi possível criar a encomenda: ${error.message}`);
        },
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, novoStatus }: { id: string; novoStatus: string }) =>
            ordersApi.updateStatus(id, novoStatus),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            Alert.alert('Sucesso', 'Status atualizado!');
        },
        onError: (error: any) => {
            Alert.alert('Erro', `Erro ao atualizar status: ${error.message}`);
        },
    });
};
