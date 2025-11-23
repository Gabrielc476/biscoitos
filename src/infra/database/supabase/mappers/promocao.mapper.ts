// Importa a entidade de Domínio
import { Promocao, PromocaoProps, TipoPromocao } from '../../../../domain/entities/promocao.entity';

// Interface para o tipo de dado do Supabase (snake_case)
interface PromocaoSupabaseRow {
  id: string;
  nome: string;
  ativa: boolean;
  tipo: string; // Vem como TEXT
  categoria_alvo: string | null;
  condicao_minimo_itens: number | null;
  acao_preco_fixo_em_centavos: number | null;
  acao_percentual_desconto: number | null;
  acao_itens_gratis: number | null;
}

export class PromocaoMapper {
  /**
   * Converte uma linha do Supabase para a Entidade de Domínio.
   */
  public static toDomain(row: PromocaoSupabaseRow): Promocao {
    // Monta o objeto de propriedades
    const props: PromocaoProps = {
      id: row.id,
      nome: row.nome,
      ativa: row.ativa,
      tipo: row.tipo as TipoPromocao, // Faz o type cast do TEXT para o Enum
      
      // Mapeia os campos nulos (coalescência)
      categoriaAlvo: row.categoria_alvo ?? undefined,
      condicao_minimoItens: row.condicao_minimo_itens ?? undefined,
      acao_precoFixoEmCentavos: row.acao_preco_fixo_em_centavos ?? undefined,
      acao_percentualDesconto: row.acao_percentual_desconto ?? undefined,
      acao_itensGratis: row.acao_itens_gratis ?? undefined,
    };

    // Cria a entidade usando o construtor que aceita props
    return new Promocao(props);
  }

  /**
   * Converte uma Entidade de Domínio para um objeto
   * que o Supabase entende (para salvar).
   */
  public static toPersistence(entidade: Promocao) {
    return {
      id: entidade.id,
      nome: entidade.nome,
      ativa: entidade.ativa,
      tipo: entidade.tipo.toString(), // Salva o Enum como TEXT
      
      // Se a propriedade for 'undefined' na entidade, salva 'null' no banco
      categoria_alvo: entidade.categoriaAlvo ?? null,
      condicao_minimo_itens: entidade.condicao_minimoItens ?? null,
      acao_preco_fixo_em_centavos: entidade.acao_precoFixoEmCentavos ?? null,
      acao_percentual_desconto: entidade.acao_percentualDesconto ?? null,
      acao_itens_gratis: entidade.acao_itensGratis ?? null,
    };
  }
}