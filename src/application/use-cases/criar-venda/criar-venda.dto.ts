/**
 * Define um item que o cliente está tentando comprar
 * (Vindo do body da requisição HTTP).
 */
interface ItemVendaInput {
  produtoId: string;
  quantidade: number;
}

// --- INPUT PORT ---
export interface CriarVendaInputDTO {
  itens: ItemVendaInput[];
  promocoesSelecionadas?: {
    family?: boolean;
    special?: boolean;
  };
  // clienteId?: string;
  // metodoPagamento?: string;
}

// --- OUTPUT PORT ---
export interface CriarVendaOutputDTO {
  vendaId: string;
  totalPagoEmCentavos: number;
  totalFormatado: string;
  status: string;
  itensProcessados: {
    nomeProduto: string;
    quantidade: number;
    precoPagoFormatado: string;
  }[];
}