// --- INPUT PORT ---
/**
 * DTO de Entrada para listar vendas.
 * (Vazio por enquanto, mas poderia ter filtros de data, status, etc.)
 */
export interface ListarVendasInputDTO {
  // Ex: status?: 'Pendente' | 'Pago' | 'Cancelado';
  // Ex: dataInicio?: string;
  // Ex: dataFim?: string;
}

// --- OUTPUT PORT ---
/**
 * DTO de Saída para cada item dentro de uma venda listada.
 */
interface ItemVendaListadoDTO {
  nomeProduto: string;
  quantidade: number;
}

/**
 * DTO de Saída para cada venda na lista.
 */
export interface ListarVendasOutputDTO {
  vendaId: string;
  status: string;
  totalFormatado: string;
  data: string; // Data formatada
  resumoItens: string; // Ex: "Biscoito (2), Refrigerante (1)"
}