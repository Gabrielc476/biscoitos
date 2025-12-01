import { IPromocaoRepositorio } from '../../../../domain/repositories/ipromocao.repositorio';
import { Promocao } from '../../../../domain/entities/promocao.entity';
import { supabaseClient } from '../supabase-client';
import { PromocaoMapper } from '../mappers/promocao.mapper';

/**
 * Implementação do Repositório de Promoções usando Supabase.
 */
export class PromocaoSupabaseRepositorio implements IPromocaoRepositorio {

  private readonly client = supabaseClient;

  /**
   * Busca todas as promoções que estão ativas.
   * (Usado pelo Motor de Promoção).
   */
  async buscarAtivas(): Promise<Promocao[]> {
    const { data, error } = await this.client
      .from('promocoes')
      .select('*')
      .eq('ativa', true); // Filtra apenas as ativas

    if (error) {
      console.error('Erro ao buscar promoções ativas:', error);
      throw new Error(`Erro ao buscar promoções: ${error.message}`);
    }

    return data.map(PromocaoMapper.toDomain);
  }

  /**
   * Busca uma promoção específica pelo seu ID.
   * (Usado pelo Painel Admin para editar uma promoção).
   */
  async buscarPorId(id: string): Promise<Promocao | null> {
    const { data, error } = await this.client
      .from('promocoes')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar promoção por ID:', error);
      throw new Error(`Erro ao buscar promoção: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return PromocaoMapper.toDomain(data);
  }

  // --- Métodos Adicionais (Para o Painel Admin) ---
  // (Embora não estejam na interface original, eles são necessários)

  /**
   * Salva (Cria ou Atualiza) uma promoção.
   * (Usado pelo Painel Admin).
   */
  async salvar(promocao: Promocao): Promise<void> {
    const dadosPersistencia = PromocaoMapper.toPersistence(promocao);

    const { error } = await this.client
      .from('promocoes')
      .upsert(dadosPersistencia);

    if (error) {
      console.error('Erro ao salvar promoção:', error);
      throw new Error(`Erro ao salvar promoção: ${error.message}`);
    }
  }
}