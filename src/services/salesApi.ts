// src/services/salesApi.ts
import api from './api';

// --- Tipos (DTOs de Venda) ---

// POST /vendas (Input)
export interface CriarVendaInputDTO {
  itens: Array<{
    produtoId: string;
    quantidade: number;
  }>;
}

// POST /vendas (Output 201)
export interface CriarVendaOutputDTO {
  vendaId: string;
  totalPagoEmCentavos: number;
  totalFormatado: string;
  status: 'Pendente'; // Status inicial é sempre Pendente
  itensProcessados: Array<{
    nomeProduto: string;
    quantidade: number;
    precoPagoFormatado: string;
  }>;
}

// GET /vendas (Output 200 - Item da Array)
export interface ListarVendasOutputDTO {
  vendaId: string;
  status: string; // 'Pendente', 'Pago', 'Cancelado'
  totalFormatado: string;
  data: string;
  resumoItens: string;
}

// GET /vendas/:id/pix (Output 200)
export interface GerarPixVendaOutputDTO {
  vendaId: string;
  valor: number;
  pixCopiaECola: string;
}

// PATCH /vendas/:id/pagar (Output 200)
export interface ConfirmarPagamentoOutputDTO {
  vendaId: string;
  novoStatus: 'Pago';
}

// --- Funções de API ---

/**
 * @description Lista todas as vendas (GET /vendas)
 */
export const fetchSales = async (): Promise<ListarVendasOutputDTO[]> => {
  try {
    const response = await api.get<ListarVendasOutputDTO[]>('/vendas');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    throw new Error('Não foi possível carregar o histórico de vendas.');
  }
};

/**
 * @description Cria uma nova venda (POST /vendas)
 * @param saleData Os dados do `CriarVendaInputDTO`
 */
export const createSale = async (
  saleData: CriarVendaInputDTO,
): Promise<CriarVendaOutputDTO> => {
  try {
    const response = await api.post<CriarVendaOutputDTO>('/vendas', saleData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar venda:', error);
    throw new Error('Não foi possível processar a venda.');
  }
};

/**
 * @description Gera o PIX para uma venda pendente (GET /vendas/:id/pix)
 * @param vendaId O ID da venda
 */
export const fetchPix = async (
  vendaId: string,
): Promise<GerarPixVendaOutputDTO> => {
  try {
    const response = await api.get<GerarPixVendaOutputDTO>(
      `/vendas/${vendaId}/pix`,
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar PIX:', error);
    throw new Error('Não foi possível gerar o PIX.');
  }
};

/**
 * @description Confirma o pagamento de uma venda (PATCH /vendas/:id/pagar)
 * @param vendaId O ID da venda
 */
export const confirmPayment = async (
  vendaId: string,
): Promise<ConfirmarPagamentoOutputDTO> => {
  try {
    const response = await api.patch<ConfirmarPagamentoOutputDTO>(
      `/vendas/${vendaId}/pagar`,
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao confirmar pagamento:', error);
    throw new Error('Não foi possível confirmar o pagamento.');
  }
};