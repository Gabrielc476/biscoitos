import { Venda } from '../entities/venda.entity';

export interface IVendaRepositorio {
  /**
   * Cria uma nova venda (e seus itens).
   * @param venda A entidade Venda a ser criada.
   */
  criar(venda: Venda): Promise<void>;

  /**
   * Busca uma venda (e seus itens) pelo seu ID.
   * @param id O ID único da venda.
   * @returns Uma entidade Venda ou null se não for encontrada.
   */
  buscarPorId(id: string): Promise<Venda | null>;

  /**
   * Busca todas as vendas, ordenadas pela mais recente.
   */
  listarTodas(): Promise<Venda[]>;

  /**
   * Salva (atualiza) o estado de uma Venda existente.
   * (Usado para mudar o status para 'Pago' ou 'Cancelado').
   * @param venda A entidade Venda com seu estado atualizado.
   */
  salvar(venda: Venda): Promise<void>;
}