// src/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchProducts,
  createProduct,
  updateProductStock, // [FIX] Importado a nova função
  CriarProdutoInputDTO,
} from '@/services/productsApi';

const productsQueryKey = ['products'];

/**
 * Hook para buscar a lista de produtos (GET /produtos).
 */
export const useProducts = () => {
  return useQuery({
    queryKey: productsQueryKey,
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, 
    retry: false, 
  });
};

/**
 * Hook para criar um novo produto (POST /produtos).
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newProduct: CriarProdutoInputDTO) => createProduct(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
    },
  });
};

/**
 * [FIX] Hook para atualizar o estoque de um produto (PATCH /produtos/:id/estoque)
 */
export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // [FIX] Agora chama a função de serviço corretamente
    mutationFn: ({ id, novoEstoque }: { id: string; novoEstoque: number }) => 
      updateProductStock(id, novoEstoque),
      
    onSuccess: () => {
      // Atualiza a lista automaticamente após salvar
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
    },
  });
};