import { ItemEncomenda } from './item-encomenda.entity';

export enum StatusEncomenda {
    PENDENTE = 'PENDENTE',
    EM_PRODUCAO = 'EM_PRODUCAO',
    PRONTO = 'PRONTO',
    ENTREGUE = 'ENTREGUE',
    CANCELADO = 'CANCELADO',
}

export class Encomenda {
    id: string;
    clienteNome: string;
    clienteTelefone: string | null;
    dataEntrega: Date;
    status: StatusEncomenda;
    observacoes: string | null;
    itens: ItemEncomenda[];
    totalEmCentavos: number;
    criadoEm: Date;

    constructor(
        id: string,
        clienteNome: string,
        clienteTelefone: string | null,
        dataEntrega: Date,
        status: StatusEncomenda,
        observacoes: string | null,
        itens: ItemEncomenda[],
        totalEmCentavos: number,
        criadoEm: Date = new Date()
    ) {
        this.id = id;
        this.clienteNome = clienteNome;
        this.clienteTelefone = clienteTelefone;
        this.dataEntrega = dataEntrega;
        this.status = status;
        this.observacoes = observacoes;
        this.itens = itens;
        this.totalEmCentavos = totalEmCentavos;
        this.criadoEm = criadoEm;
    }

    atualizarStatus(novoStatus: StatusEncomenda): void {
        this.status = novoStatus;
    }

    obterTotalFormatado(): string {
        const precoEmReais = (this.totalEmCentavos / 100).toFixed(2);
        return `R$ ${precoEmReais.replace('.', ',')}`;
    }
}
