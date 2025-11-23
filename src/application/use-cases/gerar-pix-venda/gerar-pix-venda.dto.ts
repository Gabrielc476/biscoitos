// /src/application/use-cases/gerar-pix-venda/gerar-pix-venda.dto.ts

// --- INPUT PORT ---
export interface GerarPixVendaInputDTO {
  vendaId: string;
}

// --- OUTPUT PORT ---
export interface GerarPixVendaOutputDTO {
  vendaId: string;
  valor: number;
  pixCopiaECola: string;
}