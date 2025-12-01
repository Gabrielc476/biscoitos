// --- INPUT PORT ---
/**
 * DTO de Entrada para criar um novo produto.
 * (Dados que vêm do Controller/API).
 */
export interface CriarProdutoInputDTO {
  nome: string;
  quantidadeEstoque: number;
  precoCustoEmCentavos: number;
  precoVendaEmCentavos: number;
  imagemUrl?: string; // [NOVO]
}

// --- OUTPUT PORT ---
/**
 * DTO de Saída após criar um produto.
 * (Dados que o Caso de Uso retorna para o Controller).
 */
export interface CriarProdutoOutputDTO {
  id: string;
  nome: string;
  quantidadeEstoque: number;
  precoVendaFormatado: string;
}