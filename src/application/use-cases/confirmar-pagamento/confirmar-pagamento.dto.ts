// /src/application/use-cases/confirmar-pagamento/confirmar-pagamento.dto.ts

// --- INPUT PORT ---
export interface ConfirmarPagamentoInputDTO {
  vendaId: string;
}

// --- OUTPUT PORT ---
export interface ConfirmarPagamentoOutputDTO {
  vendaId: string;
  novoStatus: string;
}