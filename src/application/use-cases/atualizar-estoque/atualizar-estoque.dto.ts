// src/application/use-cases/atualizar-estoque/atualizar-estoque.dto.ts

// --- INPUT PORT ---
/**
 * DTO de Entrada para o UseCase de Atualizar Estoque.
 * Contém a referência do produto e a nova quantidade.
 */
export interface AtualizarEstoqueInputDTO {
  produtoId: string;
  novoEstoque: number;
}

// --- OUTPUT PORT ---
/**
 * DTO de Saída com o status da atualização.
 */
export interface AtualizarEstoqueOutputDTO {
  id: string;
  novoEstoque: number;
}