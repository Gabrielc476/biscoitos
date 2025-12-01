import { IVendaRepositorio } from '../../../domain/repositories/ivenda.repositorio';
import { IUseCase } from '../../iuse-case.interface';
import { ListarVendasInputDTO, ListarVendasOutputDTO } from './listar-vendas.dto';
import { Venda } from '../../../domain/entities/venda.entity';

/**
 * Caso de Uso para listar todas as Vendas (Histórico).
 */
export class ListarVendasUseCase
  implements IUseCase<ListarVendasInputDTO, ListarVendasOutputDTO[]> {
  constructor(
    private readonly vendaRepo: IVendaRepositorio
  ) { }

  async executar(input: ListarVendasInputDTO): Promise<ListarVendasOutputDTO[]> {
    // 1. Busca as vendas no repositório
    // (Ignorando o 'input' por enquanto, mas aqui entrariam os filtros)
    const vendas = await this.vendaRepo.listarTodas();

    // 2. Mapeia as Entidades para o DTO de Saída
    return vendas.map((venda) => this.mapearParaDTO(venda));
  }

  /**
   * Helper privado para formatar a entidade Venda no DTO de saída.
   */
  private mapearParaDTO(venda: Venda): ListarVendasOutputDTO {
    // Cria um resumo simples dos itens
    const resumoItens = venda.itens
      .map(item => `${item.nomeProduto} (${item.quantidade})`)
      .join(', ');

    return {
      vendaId: venda.id,
      status: venda.status,
      totalFormatado: venda.obterTotalFormatado(),
      data: venda.criadoEm.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      resumoItens: resumoItens,
    };
  }
}