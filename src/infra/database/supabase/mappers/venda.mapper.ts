// Importa as entidades de Domínio
import { Venda, StatusVenda } from '../../../../domain/entities/venda.entity';
import { ItemVenda } from '../../../../domain/entities/item-venda.entity';
import { ItemVendaMapper } from './item-venda.mapper';

// Interface para a linha principal da Venda
interface VendaSupabaseRow {
  id: string;
  total_final_em_centavos: number;
  status: string;
  criado_em: string;
  // Esta é a mágica do Supabase: ele pode aninhar os itens
  itens_venda: any[]; // O Supabase retorna os itens aqui
}

export class VendaMapper {
  /**
   * Converte uma linha da Venda (com seus itens aninhados)
   * para a Entidade de Domínio Venda.
   */
  public static toDomain(row: VendaSupabaseRow): Venda {
    // 1. Mapeia os itens aninhados primeiro
    const itens: ItemVenda[] = row.itens_venda.map((itemRow) =>
      ItemVendaMapper.toDomain(itemRow),
    );

    // 2. Cria a entidade Venda (Agregado)
    const entidade = new Venda(
      row.id,
      itens,
      row.total_final_em_centavos,
    );

    // 3. Hidrata os campos restantes (status, datas)
    // Precisamos de um type assertion para o Enum
    entidade.status = row.status as StatusVenda;
    entidade.criadoEm = new Date(row.criado_em);
    
    // (A entidade Venda ainda não tem 'atualizadoEm',
    // mas se tivesse, seria hidratado aqui)

    return entidade;
  }

  /**
   * Converte uma Entidade de Domínio Venda para o formato de
   * persistência da tabela 'vendas' (APENAS a tabela principal).
   * Os itens são tratados pelo Repositório.
   */
  public static toPersistence(entidade: Venda) {
    return {
      id: entidade.id,
      total_final_em_centavos: entidade.totalFinalEmCentavos,
      status: entidade.status.toString(),
      criado_em: entidade.criadoEm.toISOString(),
    };
  }
}