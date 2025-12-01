import api from './api';

export interface OrderItemInput {
    produtoId: string;
    quantidade: number;
}

export interface CreateOrderInput {
    clienteNome: string;
    clienteTelefone?: string;
    dataEntrega: Date;
    observacoes?: string;
    itens: OrderItemInput[];
    promocoesSelecionadas?: {
        family?: boolean;
        special?: boolean;
    };
}

export interface Order {
    id: string;
    clienteNome: string;
    dataEntrega: string;
    status: 'PENDENTE' | 'EM_PRODUCAO' | 'PRONTO' | 'ENTREGUE' | 'CANCELADO';
    totalFormatado: string;
    resumoItens: string;
}

export const ordersApi = {
    createOrder: async (data: CreateOrderInput) => {
        const response = await api.post('/encomendas', data);
        return response.data;
    },

    fetchOrders: async (status?: string) => {
        const params = status ? { status } : {};
        const response = await api.get<Order[]>('/encomendas', { params });
        return response.data;
    },

    updateStatus: async (id: string, novoStatus: string) => {
        const response = await api.patch(`/encomendas/${id}/status`, { novoStatus });
        return response.data;
    },
};
