// src/hooks/useSales.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchSales,
  createSale,
  fetchPix,
  confirmPayment,
  CriarVendaInputDTO,
} from '@/services/salesApi';

// Chaves de query
const salesQueryKey = ['sales'];
const pixQueryKey = 'pix'; // Será usado como ['pix', vendaId]

/**
 * Hook para buscar o histórico de vendas (GET /vendas).
 */
export const useSales = () => {
  return useQuery({
    queryKey: salesQueryKey,
    queryFn: fetchSales,
  });
};

/**
 * Hook para criar uma nova venda (POST /vendas).
 * Usado no checkout.
 */
export const useCreateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newSale: CriarVendaInputDTO) => createSale(newSale),
    onSuccess: () => {
      // Invalida a lista de produtos para refletir a baixa no estoque imediatamente
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

/**
 * Hook para buscar o PIX (GET /vendas/:id/pix).
 *
 * Note que ele é 'enabled: false'. Ele só será executado
 * quando a função 'refetch' for chamada manualmente.
 */
export const useFetchPix = (vendaId: string) => {
  return useQuery({
    // Chave de query dinâmica
    queryKey: [pixQueryKey, vendaId],
    queryFn: () => fetchPix(vendaId),

    // IMPORTANTE: Desabilitado por padrão
    // Só queremos buscar o PIX quando o usuário clicar no botão
    enabled: false,

    // Não tenta buscar de novo automaticamente
    retry: false,
  });
};

/**
 * Hook para confirmar o pagamento (PATCH /vendas/:id/pagar).
 * Usado pelo Admin.
 */
export const useConfirmPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vendaId: string) => confirmPayment(vendaId),

    // MÁGICA DA INTEGRAÇÃO:
    // Quando o pagamento for confirmado...
    onSuccess: () => {
      // Invalida a query 'sales'.
      // Isso força o TanStack Query a buscar o histórico de vendas novamente
      // e atualizar o status de "Pendente" para "Pago" na tela do Admin.
      queryClient.invalidateQueries({ queryKey: salesQueryKey });
    },
  });
};