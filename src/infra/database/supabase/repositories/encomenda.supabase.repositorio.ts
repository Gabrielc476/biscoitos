import { IEncomendaRepositorio } from '../../../../domain/repositories/iencomenda.repositorio';
import { Encomenda, StatusEncomenda } from '../../../../domain/entities/encomenda.entity';
import { supabaseClient } from '../supabase-client';
import { EncomendaMapper } from '../mappers/encomenda.mapper';
import { ItemEncomendaMapper } from '../mappers/item-encomenda.mapper';
import { ItemEncomenda } from '../../../../domain/entities/item-encomenda.entity';

export class EncomendaSupabaseRepositorio implements IEncomendaRepositorio {
    private readonly client = supabaseClient;

    async criar(encomenda: Encomenda): Promise<void> {
        // 1. Salva a Encomenda
        const dadosEncomenda = EncomendaMapper.toPersistence(encomenda);
        const { error: erroEncomenda } = await this.client
            .from('encomendas')
            .insert(dadosEncomenda);

        if (erroEncomenda) {
            console.error('Erro ao criar Encomenda:', erroEncomenda);
            throw new Error(`Erro ao salvar Encomenda: ${erroEncomenda.message}`);
        }

        // 2. Salva os Itens
        try {
            const dadosItens = encomenda.itens.map((item: ItemEncomenda) =>
                ItemEncomendaMapper.toPersistence(item, encomenda.id)
            );

            const { error: erroItens } = await this.client
                .from('itens_encomenda')
                .insert(dadosItens);

            if (erroItens) throw erroItens;

        } catch (error: any) {
            // Rollback manual
            console.error('Erro ao criar Itens da Encomenda, deletando cabeçalho:', error);
            await this.client.from('encomendas').delete().eq('id', encomenda.id);
            throw new Error(`Erro ao salvar Itens da Encomenda: ${error.message}`);
        }
    }

    async buscarPorId(id: string): Promise<Encomenda | null> {
        const { data, error } = await this.client
            .from('encomendas')
            .select('*, itens_encomenda(*)')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Erro ao buscar encomenda:', error);
            throw new Error(`Erro ao buscar encomenda: ${error.message}`);
        }

        if (!data) return null;

        return EncomendaMapper.toDomain(data);
    }

    async listarTodas(): Promise<Encomenda[]> {
        const { data, error } = await this.client
            .from('encomendas')
            .select('*, itens_encomenda(*)')
            .order('data_entrega', { ascending: true }); // Ordena por data de entrega mais próxima

        if (error) {
            console.error('Erro ao listar encomendas:', error);
            throw new Error(`Erro ao listar encomendas: ${error.message}`);
        }

        return data.map(EncomendaMapper.toDomain);
    }

    async atualizarStatus(id: string, status: StatusEncomenda): Promise<void> {
        const { error } = await this.client
            .from('encomendas')
            .update({ status })
            .eq('id', id);

        if (error) {
            console.error('Erro ao atualizar status da encomenda:', error);
            throw new Error(`Erro ao atualizar status: ${error.message}`);
        }
    }
}
