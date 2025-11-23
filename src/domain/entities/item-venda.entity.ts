// /src/domain/entities/item-venda.entity.ts

/**
 * Representa um item *dentro* de uma Venda.
 * Esta classe "congela" os dados do produto no momento da compra,
 * garantindo que o histórico da venda seja imutável.
 */
export class ItemVenda {
  id: string; // ID do ItemVenda (ex: uuid)
  produtoId: string | null; // Referência ao ID do Produto (pode ser null para itens promocionais)
  
  /** * A quantidade do produto que foi comprada.
   * Ex: 2 (dois saquinhos)
   */
  quantidade: number;
  
  /**
   * O nome do produto no momento da venda.
   */
  nomeProduto: string;

  /**
   * O preço de venda unitário *base* do produto (em centavos)
   * no momento da compra, *antes* das promoções desta linha.
   */
  precoVendaUnitarioEmCentavos: number;

  /**
   * O preço total (em centavos) *pago* por esta linha de itens,
   * *após* a aplicação de promoções.
   */
  precoTotalPagoEmCentavos: number;

  constructor(
    id: string,
    produtoId: string | null, // Aceita null
    quantidade: number,
    nomeProduto: string,
    precoVendaUnitarioEmCentavos: number,
    precoTotalPagoEmCentavos: number
  ) {
    this.id = id;
    this.produtoId = produtoId;
    this.quantidade = quantidade;
    this.nomeProduto = nomeProduto;
    this.precoVendaUnitarioEmCentavos = precoVendaUnitarioEmCentavos;
    this.precoTotalPagoEmCentavos = precoTotalPagoEmCentavos;
  }

  // --- MÉTODOS AUXILIARES (DE FÁBRICA) ---

  /**
   * Construtor auxiliar para itens que representam um DESCONTO ou uma PROMOÇÃO.
   * O produtoId é null, indicando que não é um produto físico a ser buscado no estoque ou repositório.
   */
  static createPromotionItem(
    id: string,
    nomePromocao: string,
    quantidadeDeReferencia: number, // Ex: 2 (para 2 por 10)
    precoTotalPagoEmCentavos: number, // Valor do pacote
  ): ItemVenda {
    return new ItemVenda(
      id,
      null, // <--- PRODUTO ID É NULL AQUI
      quantidadeDeReferencia,
      nomePromocao,
      0, // Preço unitário base não se aplica ao item promocional
      precoTotalPagoEmCentavos,
    );
  }
}