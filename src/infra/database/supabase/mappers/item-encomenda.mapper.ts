import { ItemEncomenda } from '../../../../domain/entities/item-encomenda.entity';

export class ItemEncomendaMapper {
    static toDomain(raw: any): ItemEncomenda {
        return new ItemEncomenda(
            raw.id,
            raw.encomenda_id,
            raw.produto_id,
            raw.nome_produto,
            raw.quantidade,
            raw.preco_unitario_centavos
        );
    }

    static toPersistence(item: ItemEncomenda, encomendaId: string): any {
        return {
            id: item.id,
            encomenda_id: encomendaId,
            produto_id: item.produtoId,
            nome_produto: item.nomeProduto,
            quantidade: item.quantidade,
            preco_unitario_centavos: item.precoUnitarioEmCentavos,
        };
    }
}
