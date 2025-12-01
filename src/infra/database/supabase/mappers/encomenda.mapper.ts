import { Encomenda, StatusEncomenda } from '../../../../domain/entities/encomenda.entity';
import { ItemEncomendaMapper } from './item-encomenda.mapper';

export class EncomendaMapper {
    static toDomain(raw: any): Encomenda {
        const itens = raw.itens_encomenda
            ? raw.itens_encomenda.map(ItemEncomendaMapper.toDomain)
            : [];

        return new Encomenda(
            raw.id,
            raw.cliente_nome,
            raw.cliente_telefone,
            new Date(raw.data_entrega),
            raw.status as StatusEncomenda,
            raw.observacoes,
            itens,
            raw.total_centavos,
            new Date(raw.criado_em)
        );
    }

    static toPersistence(encomenda: Encomenda): any {
        return {
            id: encomenda.id,
            cliente_nome: encomenda.clienteNome,
            cliente_telefone: encomenda.clienteTelefone,
            data_entrega: encomenda.dataEntrega.toISOString(),
            status: encomenda.status,
            observacoes: encomenda.observacoes,
            total_centavos: encomenda.totalEmCentavos,
            criado_em: encomenda.criadoEm.toISOString(),
        };
    }
}
