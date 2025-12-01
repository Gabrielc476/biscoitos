/**
 * Representa um item dentro de uma Encomenda.
 * Diferente da Venda, aqui o produtoId é OBRIGATÓRIO para garantir
 * que a produção saiba exatamente o que produzir.
 */
export class ItemEncomenda {
    id: string;
    encomendaId: string;
    produtoId: string; // Obrigatório
    nomeProduto: string;
    quantidade: number;
    precoUnitarioEmCentavos: number;

    constructor(
        id: string,
        encomendaId: string,
        produtoId: string,
        nomeProduto: string,
        quantidade: number,
        precoUnitarioEmCentavos: number
    ) {
        this.id = id;
        this.encomendaId = encomendaId;
        this.produtoId = produtoId;
        this.nomeProduto = nomeProduto;
        this.quantidade = quantidade;
        this.precoUnitarioEmCentavos = precoUnitarioEmCentavos;
    }

    get totalEmCentavos(): number {
        return this.quantidade * this.precoUnitarioEmCentavos;
    }
}
