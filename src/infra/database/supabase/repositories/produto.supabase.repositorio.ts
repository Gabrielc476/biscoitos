// Importa a Interface (Contrato) do Domínio
import { IProdutoRepositorio } from '../../../../domain/repositories/iproduto.repositorio';

// Importa a Entidade de Domínio
import { Produto } from '../../../../domain/entities/produto.entity';

// Importa as ferramentas de Infra (Cliente e Mapper)
import { supabaseClient } from '../supabase-client';
import { ProdutoMapper } from '../mappers/produto.mapper';

/**
 * Esta é a implementação concreta (Infraestrutura) do Repositório de Produto
 * usando o Supabase como banco de dados.
 */
export class ProdutoSupabaseRepositorio implements IProdutoRepositorio {

  // A classe usa o cliente Supabase importado
  private readonly client = supabaseClient;

  /**
   * Busca um produto pelo seu ID.
   */
  async buscarPorId(id: string): Promise<Produto | null> {
    const { data, error } = await this.client
      .from('produtos')
      .select('*')
      .eq('id', id)
      .single(); // .single() retorna um objeto ou null (perfeito para nós)

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = "Row not found". Ignoramos esse "erro" pois é um resultado esperado.
      console.error('Erro ao buscar produto no Supabase:', error);
      throw new Error(`Erro ao buscar produto: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    // Traduz a linha do Supabase para a Entidade de Domínio
    return ProdutoMapper.toDomain(data);
  }

  /**
   * Busca vários produtos por seus IDs.
   * (Usado pelo carrinho de compras).
   */
  async buscarPorIds(ids: string[]): Promise<Produto[]> {
    const { data, error } = await this.client
      .from('produtos')
      .select('*')
      .in('id', ids);

    if (error) {
      console.error('Erro ao buscar produtos por IDs:', error);
      throw new Error(`Erro ao buscar produtos: ${error.message}`);
    }

    // Mapeia a lista de resultados para a Entidade de Domínio
    return data.map(ProdutoMapper.toDomain);
  }

  /**
   * Salva (Cria ou Atualiza) um produto.
   * A entidade 'Produto' já contém o estado final,
   * o repositório apenas persiste esse estado.
   */
  async salvar(produto: Produto): Promise<void> {
    // Traduz da Entidade de Domínio para o formato do Supabase
    const dadosPersistencia = ProdutoMapper.toPersistence(produto);

    console.log(`🔵 [Repo] Salvando produto ${produto.id} no Supabase. Dados:`, JSON.stringify(dadosPersistencia));

    // O 'upsert' do Supabase é perfeito para "salvar".
    // Ele cria se o 'id' não existir, ou atualiza se existir.
    const { error } = await this.client
      .from('produtos')
      .upsert(dadosPersistencia);

    if (error) {
      console.error('🔴 [Repo] Erro ao salvar produto no Supabase:', error);
      throw new Error(`Erro ao salvar produto: ${error.message}`);
    }
    console.log(`🟢 [Repo] Produto ${produto.id} salvo com sucesso.`);
  }

  /**
   * Busca todos os produtos cadastrados.
   * (Usado em painéis de admin).
   */
  async listarTodos(): Promise<Produto[]> {
    const { data, error } = await this.client
      .from('produtos')
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao listar todos os produtos:', error);
      throw new Error(`Erro ao listar produtos: ${error.message}`);
    }

    return data.map(ProdutoMapper.toDomain);
  }

  /**
   * Busca apenas os produtos que estão marcados como 'ativos'.
   * (Usado pela loja virtual).
   */
  async listarTodosAtivos(): Promise<Produto[]> {
    // Para implementar este método, precisamos primeiro
    // adicionar o campo 'ativo' à nossa entidade Produto
    // e à nossa tabela 'produtos' no Supabase.

    // Quando tivermos o campo 'ativo':
    // const { data, error } = await this.client
    //   .from('produtos')
    //   .select('*')
    //   .eq('ativo', true) // <--- A MUDANÇA ESTÁ AQUI
    //   .order('nome', { ascending: true });

    // Por enquanto, ele apenas retorna todos:
    console.warn("Método 'listarTodosAtivos' está retornando todos os produtos. Adicione o campo 'ativo' para filtrar.");
    return this.listarTodos();
  }

  async uploadImagem(arquivo: { buffer: Buffer; mimetype: string }, nomeArquivo: string): Promise<string> {
    // 1. Upload para o bucket 'produtos'
    const { data, error } = await this.client.storage
      .from('produtos')
      .upload(nomeArquivo, arquivo.buffer, {
        contentType: arquivo.mimetype,
        upsert: true,
      });

    if (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw new Error(`Erro ao fazer upload: ${error.message}`);
    }

    // 2. Obter URL pública
    const { data: publicUrlData } = this.client.storage
      .from('produtos')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  }
}