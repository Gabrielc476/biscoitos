// /src/domain/repositories/iproduto.repositorio.ts

import { Produto } from '../entities/produto.entity';

/**
 * Interface (Contrato) para o Repositório de Produtos.
 *
 * Define quais métodos a camada de Infraestrutura (ex: Prisma, TypeORM)
 * deve implementar para que a camada de Aplicação (Use Cases)
 * possa interagir com os dados de Produto.
 */
export interface IProdutoRepositorio {
  /**
   * Busca um produto pelo seu ID único.
   * @param id O ID do produto.
   * @returns A entidade Produto ou null se não for encontrada.
   */
  buscarPorId(id: string): Promise<Produto | null>;

  /**
   * Busca uma lista de produtos por seus IDs.
   * (Usado pelo Caso de Uso 'CriarVenda' para buscar os itens do carrinho).
   * @param ids Uma array de IDs de produtos.
   * @returns Uma lista de entidades Produto.
   */
  buscarPorIds(ids: string[]): Promise<Produto[]>;

  /**
   * Persiste as mudanças de uma entidade Produto no banco de dados.
   * Este método lida tanto com a criação (insert) quanto com a
   * atualização (update) de um produto.
   *
   * Os Casos de Uso chamarão este método após alterar a entidade,
   * (ex: produto.desativar() ou produto.removerEstoque(1)).
   *
   * @param produto A entidade Produto com seu estado atualizado.
   */
  salvar(produto: Produto): Promise<void>;

  /**
   * Retorna uma lista de TODOS os produtos cadastrados.
   * (Geralmente usado em painéis administrativos).
   * @returns Uma lista de todas as entidades Produto.
   */
  listarTodos(): Promise<Produto[]>;

  /**
   * Retorna uma lista apenas dos produtos marcados como 'ativos'.
   * (Geralmente usado pela vitrine da loja/frontend).
   * @returns Uma lista de entidades Produto ativas.
   */
  listarTodosAtivos(): Promise<Produto[]>;

  /*
   * Nota: Não há 'deletar' pois usamos 'desativar' (soft-delete),
   * que é gerenciado pela entidade e persistido pelo método 'salvar'.
   */
}