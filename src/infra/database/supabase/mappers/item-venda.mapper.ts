// Importa a entidade de Domínio
import { ItemVenda } from '../../../../domain/entities/item-venda.entity';

// Interface para o tipo de dado do Supabase (snake_case)
interface ItemVendaSupabaseRow {
  id: string;
  venda_id: string;
  produto_id: string | null; // Pode ser nulo se o produto for deletado
  quantidade: number;
  nome_produto: string;
  preco_venda_unitario_em_centavos: number;
  preco_total_pago_em_centavos: number;
}

export class ItemVendaMapper {
  /**
   * Converte uma linha do Supabase para a Entidade de Domínio.
   */
  public static toDomain(row: ItemVendaSupabaseRow): ItemVenda {
    const entidade = new ItemVenda(
      row.id,
      row.produto_id || 'produto-deletado', // Lida com o ID nulo
      row.quantidade,
      row.nome_produto,
      row.preco_venda_unitario_em_centavos,
      row.preco_total_pago_em_centavos,
    );
    return entidade;
  }

  /**
   * Converte uma Entidade de Domínio para um objeto
   * que o Supabase entende (para salvar).
   */
  public static toPersistence(entidade: ItemVenda, vendaId: string) {
    return {
      id: entidade.id,
      venda_id: vendaId, // O ID da Venda (pai) é necessário
      produto_id: entidade.produtoId === 'produto-deletado' ? null : entidade.produtoId,
      quantidade: entidade.quantidade,
      nome_produto: entidade.nomeProduto,
      preco_venda_unitario_em_centavos: entidade.precoVendaUnitarioEmCentavos,
      preco_total_pago_em_centavos: entidade.precoTotalPagoEmCentavos,
    };
  }
}