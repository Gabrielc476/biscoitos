export interface ItemPedidoInput {
    produtoId: string;
    quantidade: number;
}

export interface CriarEncomendaInputDTO {
    clienteNome: string;
    clienteTelefone?: string;
    dataEntrega: Date;
    observacoes?: string;
    itens: ItemPedidoInput[];
    promocoesSelecionadas?: {
        family?: boolean;
        special?: boolean;
    };
}

export interface CriarEncomendaOutputDTO {
    id: string;
    total: number;
    status: string;
}
