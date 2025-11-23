// /src/domain/repositories/ipromocao.repositorio.ts

import { Promocao } from '../entities/promocao.entity';

export interface IPromocaoRepositorio {
  /**
   * Busca todas as promoções que estão ativas no momento.
   * @returns Uma lista de entidades Promocao.
   */
  buscarTodasAtivas(): Promise<Promocao[]>;

  /**
   * Busca uma promoção pelo seu ID.
   * @param id O ID único da promoção.
   * @returns Uma entidade Promocao ou null se não for encontrada.
   */
  buscarPorId(id: string): Promise<Promocao | null>;

  // (Métodos para salvar, atualizar, etc., seriam usados pelo Painel Admin)
}