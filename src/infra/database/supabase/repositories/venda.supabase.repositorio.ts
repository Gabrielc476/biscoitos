import { IVendaRepositorio } from '../../../../domain/repositories/ivenda.repositorio';
import { Venda } from '../../../../domain/entities/venda.entity';
import { supabaseClient } from '../supabase-client';
import { VendaMapper } from '../mappers/venda.mapper';
import { ItemVendaMapper } from '../mappers/item-venda.mapper';
// Importamos a Entidade para poder checar se um item é promocional
import { ItemVenda } from '../../../../domain/entities/item-venda.entity'; 

export class VendaSupabaseRepositorio implements IVendaRepositorio {
  
  private readonly client = supabaseClient;

  /**
   * Busca uma Venda (e seus Itens) pelo ID.
   */
  async buscarPorId(id: string): Promise<Venda | null> {
    // Pede a 'venda' e todos os 'itens_venda' associados
    const { data, error } = await this.client
      .from('vendas')
      .select('*, itens_venda(*)')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar venda no Supabase:', error);
      throw new Error(`Erro ao buscar venda: ${error.message}`);
    }

    if (!data) return null;

    return VendaMapper.toDomain(data);
  }

  /**
   * Cria uma nova Venda (e seus Itens).
   * Implementa um Rollback Manual: Deleta a Venda se a inserção dos Itens falhar.
   */
  async criar(venda: Venda): Promise<void> {
    // 1. Salva a Venda (Cabeçalho)
    const dadosVenda = VendaMapper.toPersistence(venda);

    const { error: erroVenda } = await this.client
      .from('vendas')
      .insert(dadosVenda);

    if (erroVenda) {
      console.error('Erro ao criar Venda (principal):', erroVenda);
      throw new Error(`Erro ao salvar Venda: ${erroVenda.message}`);
    }

    // 2. Salva os Itens
    try {
      // [CORREÇÃO FINAL] Filtra itens promocionais sem produtoId antes de persistir
      const itensReais = venda.itens.filter(
          (item: ItemVenda) => item.produtoId !== null 
      );
      
      const dadosItens = itensReais.map((item) =>
        ItemVendaMapper.toPersistence(item, venda.id),
      );

      const { error: erroItens } = await this.client
        .from('itens_venda')
        .insert(dadosItens);

      if (erroItens) throw erroItens;

    } catch (error: any) {
      // ROLLBACK MANUAL: Se os itens falharem, deletamos a Venda "órfã"
      console.error('Erro ao criar Itens da Venda, deletando cabeçalho:', error);
      await this.client.from('vendas').delete().eq('id', venda.id);
      
      throw new Error(`Erro ao salvar Itens da Venda: ${error.message}`);
    }
  }

  /**
   * Busca todas as Vendas (e seus Itens).
   */
  async listarTodas(): Promise<Venda[]> {
    const { data, error } = await this.client
      .from('vendas')
      .select('*, itens_venda(*)')
      .order('criado_em', { ascending: false });

    if (error) {
      console.error('Erro ao listar vendas no Supabase:', error);
      throw new Error(`Erro ao listar vendas: ${error.message}`);
    }

    return data.map(VendaMapper.toDomain);
  }

  /**
   * Atualiza o estado de uma Venda (ex: Status).
   */
  async salvar(venda: Venda): Promise<void> {
    const dadosVenda = VendaMapper.toPersistence(venda);
    
    const { error } = await this.client
      .from('vendas')
      .update({ status: dadosVenda.status })
      .eq('id', venda.id);

    if (error) {
      console.error('Erro ao salvar (atualizar) Venda:', error);
      throw new Error(`Erro ao atualizar Venda: ${error.message}`);
    }
  }
}