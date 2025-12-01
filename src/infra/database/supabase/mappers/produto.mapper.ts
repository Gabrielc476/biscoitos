// Importa a entidade de Domínio
import { Produto } from '../../../../domain/entities/produto.entity';

// Define uma interface para o tipo de dado que vem do Supabase
// (Note o snake_case, igual ao da sua tabela)
interface ProdutoSupabaseRow {
  id: string;
  nome: string;
  quantidade_estoque: number;
  preco_custo_em_centavos: number;
  preco_venda_em_centavos: number;
  criado_em: string; // O Supabase retorna datas como strings (TIMESTAMPTZ)
  atualizado_em: string;
  imagem_url?: string; // [NOVO]
  // 'ativo' seria adicionado aqui se o tivéssemos na tabela
}

/**
 * Classe estática para converter entre a Entidade 'Produto'
 * e o modelo da tabela 'produtos' do Supabase.
 */
export class ProdutoMapper {
  /**
   * Converte uma linha do Supabase (snake_case) para a Entidade de Domínio (camelCase).
   */
  public static toDomain(row: ProdutoSupabaseRow): Produto {
    // 1. Cria a entidade usando o construtor
    const entidade = new Produto(
      row.id,
      row.nome,
      row.quantidade_estoque,
      row.preco_custo_em_centavos,
      row.preco_venda_em_centavos,
      row.imagem_url // [NOVO]
    );

    // 2. "Hidrata" os campos que não estão no construtor (como datas)
    entidade.criadoEm = new Date(row.criado_em);
    entidade.atualizadoEm = new Date(row.atualizado_em);

    return entidade;
  }

  /**
   * Converte uma Entidade de Domínio (camelCase) para um objeto
   * que o Supabase entende (snake_case) para salvar.
   */
  public static toPersistence(entidade: Produto) {
    return {
      id: entidade.id,
      nome: entidade.nome,
      quantidade_estoque: entidade.quantidadeEstoque,
      preco_custo_em_centavos: entidade.precoCustoEmCentavos,
      preco_venda_em_centavos: entidade.precoVendaEmCentavos,
      imagem_url: entidade.imagemUrl, // [NOVO]
    };
  }
}