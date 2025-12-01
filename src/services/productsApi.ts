// src/services/productsApi.ts
import api from './api';

// --- Tipos (DTOs de Produto) ---

// POST /produtos (Input)
export interface CriarProdutoInputDTO {
  nome: string;
  quantidadeEstoque: number;
  precoCustoEmCentavos: number;
  precoVendaEmCentavos: number;
  imagemUrl?: string; // [NOVO]
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
  imagemUrl?: string; // [NOVO]
}

// PATCH /produtos/:id/estoque (Output 200)
export interface AtualizarEstoqueOutputDTO {
  id: string;
  novoEstoque: number;
}

// POST /produtos/upload (Output 200)
export interface UploadImagemOutputDTO {
  url: string;
}

// --- Funções de API ---

/**
 * @description Lista todos os produtos (GET /produtos)
 */
export const fetchProducts = async (): Promise<ListarProdutosOutputDTO[]> => {
  try {
    const response = await api.get<ListarProdutosOutputDTO[]>('/produtos');
    console.log('🔍 [Frontend API] Produtos recebidos:', response.data.length);
    if (response.data.length > 0) {
      console.log('🔍 [Frontend API] Exemplo de produto:', JSON.stringify(response.data[0], null, 2));
    }
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
 * @description Faz o upload de uma imagem (POST /produtos/upload)
 */
export const uploadProductImage = async (uri: string): Promise<string> => {
  try {
    const formData = new FormData();
    // @ts-ignore: O React Native aceita isso, mas o TS reclama
    formData.append('file', {
      uri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    const response = await api.post<UploadImagemOutputDTO>('/produtos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.url;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    throw new Error('Falha no upload da imagem.');
  }
};

/**
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