// src/services/productsApi.ts
import api from './api';

// --- Tipos (DTOs de Produto) ---

// POST /produtos (Input)
export interface CriarProdutoInputDTO {
  nome: string;
  quantidadeEstoque: number;
  precoCustoEmCentavos: number;
  precoVendaEmCentavos: number;
}

// POST /produtos (Output 201)
export interface CriarProdutoOutputDTO {
  id: string;
  nome: string;
  quantidadeEstoque: number;
  precoVendaFormatado: string;
}

// GET /produtos (Output 200 - Item da Array)
export interface ListarProdutosOutputDTO {
  id: string;
  nome: string;
  precoFormatado: string;
  precoVendaEmCentavos: number;
  quantidadeEstoque: number;
}

// PATCH /produtos/:id/estoque (Output 200)
export interface AtualizarEstoqueOutputDTO {
    id: string;
    novoEstoque: number;
}

// --- Funções de API ---

/**
 * @description Lista todos os produtos (GET /produtos)
 */
export const fetchProducts = async (): Promise<ListarProdutosOutputDTO[]> => {
  try {
    const response = await api.get<ListarProdutosOutputDTO[]>('/produtos');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw new Error('Não foi possível carregar os produtos.');
  }
};

/**
 * @description Cria um novo produto (POST /produtos)
 */
export const createProduct = async (
  productData: CriarProdutoInputDTO,
): Promise<CriarProdutoOutputDTO> => {
  try {
    const response = await api.post<CriarProdutoOutputDTO>(
      '/produtos',
      productData,
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    throw new Error('Não foi possível criar o produto.');
  }
};

/**
 * [NOVA FUNÇÃO]
 * @description Atualiza o estoque de um produto específico (PATCH /produtos/:id/estoque)
 */
export const updateProductStock = async (
  id: string,
  novoEstoque: number,
): Promise<AtualizarEstoqueOutputDTO> => {
  try {
    const response = await api.patch<AtualizarEstoqueOutputDTO>(
      `/produtos/${id}/estoque`,
      { novoEstoque }, // Corpo da requisição
    );
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar estoque do produto ${id}:`, error);
    // Tenta capturar a mensagem de erro do backend (ex: "Estoque não pode ser negativo.")
    throw error; 
  }
};