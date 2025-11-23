export class Produto {
  id: string;
  nome: string;
  
  /** Quantidade física em estoque. */
  quantidadeEstoque: number;
  
  /** O preço que você pagou pelo item (em centavos). */
  precoCustoEmCentavos: number;
  
  /** O preço base que você vende o item (em centavos). */
  precoVendaEmCentavos: number;

  // Metadados
  criadoEm: Date;
  atualizadoEm: Date;

  constructor(
    id: string,
    nome: string,
    quantidadeEstoque: number,
    precoCustoEmCentavos: number,
    precoVendaEmCentavos: number
  ) {
    this.id = id;
    this.nome = nome;
    this.quantidadeEstoque = quantidadeEstoque;
    this.precoCustoEmCentavos = precoCustoEmCentavos;
    this.precoVendaEmCentavos = precoVendaEmCentavos;
    
    // Validação simples no construtor
    if (precoVendaEmCentavos < precoCustoEmCentavos) {
      console.warn(`Atenção: Produto "${nome}" (ID: ${id}) está com preço de venda abaixo do custo.`);
    }

    this.criadoEm = new Date();
    this.atualizadoEm = new Date();
  }

  // --- MÉTODOS (Lógica de Negócio) ---

  /**
   * Atualiza a quantidade em estoque.
   */
  atualizarEstoque(novaQuantidade: number): void {
    if (novaQuantidade < 0) {
      throw new Error("Estoque não pode ser negativo.");
    }
    this.quantidadeEstoque = novaQuantidade;
    this.atualizadoEm = new Date();
  }

  diminuirEstoque(quantidadeVendida: number): void {
    if (quantidadeVendida <= 0) {
      return; // Nada a fazer
    }
    
    if (this.quantidadeEstoque < quantidadeVendida) {
      throw new Error(`Estoque insuficiente! Necessário: ${quantidadeVendida}, Disponível: ${this.quantidadeEstoque}.`);
    }

    this.quantidadeEstoque -= quantidadeVendida;
    this.atualizadoEm = new Date();
  }

  /**
   * Altera o preço de venda base do produto.
   */
  ajustarPrecoVenda(novoPrecoEmCentavos: number): void {
    if (novoPrecoEmCentavos < 0) {
      throw new Error("O preço de venda não pode ser negativo.");
    }
    
    if (novoPrecoEmCentavos < this.precoCustoEmCentavos) {
       console.warn(`Atenção: O novo preço de venda (R$ ${novoPrecoEmCentavos / 100}) é menor que o preço de custo (R$ ${this.precoCustoEmCentavos / 100}).`);
    }
    
    this.precoVendaEmCentavos = novoPrecoEmCentavos;
    this.atualizadoEm = new Date();
  }

  /**
   * Retorna a margem de lucro bruta (Markup sobre o preço de venda).
   * Ex: Custo 8, Venda 10 -> Margem = 20%
   */
  obterMargemLucroPercentual(): number {
    if (this.precoVendaEmCentavos <= 0) {
      return 0; // Evita divisão por zero
    }
    
    const lucro = this.precoVendaEmCentavos - this.precoCustoEmCentavos;
    const margem = (lucro / this.precoVendaEmCentavos) * 100;
    
    // Retorna arredondado (ex: 19.99)
    return parseFloat(margem.toFixed(2));
  }
  
  /**
   * Retorna o valor total do estoque deste produto (Custo).
   */
  obterValorTotalEstoqueCusto(): number {
    return this.quantidadeEstoque * this.precoCustoEmCentavos;
  }

  // --- MÉTODOS DE FORMATAÇÃO (Helpers) ---

  /**
   * Retorna o preço de VENDA formatado em Reais (R$).
   */
  obterPrecoVendaFormatado(): string {
    const precoEmReais = (this.precoVendaEmCentavos / 100).toFixed(2);
    return `R$ ${precoEmReais.replace('.', ',')}`;
  }
  
  /**
   * Retorna o preço de CUSTO formatado em Reais (R$).
   */
  obterPrecoCustoFormatado(): string {
    const precoEmReais = (this.precoCustoEmCentavos / 100).toFixed(2);
    return `R$ ${precoEmReais.replace('.', ',')}`;
  }
}