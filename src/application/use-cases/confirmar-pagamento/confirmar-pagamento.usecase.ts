// /src/application/use-cases/confirmar-pagamento/confirmar-pagamento.usecase.ts

import { IVendaRepositorio } from '../../../domain/repositories/ivenda.repositorio';
import { IUseCase } from '../../iuse-case.interface';
import { ConfirmarPagamentoInputDTO, ConfirmarPagamentoOutputDTO } from './confirmar-pagamento.dto';

export class ConfirmarPagamentoUseCase
  implements IUseCase<ConfirmarPagamentoInputDTO, ConfirmarPagamentoOutputDTO>
{
  constructor(private readonly vendaRepo: IVendaRepositorio) {}

  async executar(input: ConfirmarPagamentoInputDTO): Promise<ConfirmarPagamentoOutputDTO> {
    // 1. Buscar a Venda
    const venda = await this.vendaRepo.buscarPorId(input.vendaId);
    if (!venda) {
      throw new Error('Venda não encontrada.');
    }

    // 2. Chamar a Lógica de Domínio
    // (A própria entidade 'venda' vai disparar um erro
    // se ela não estiver como "Pendente")
    venda.marcarComoPaga();

    // 3. Salvar a Venda (precisamos do método 'salvar')
    await this.vendaRepo.salvar(venda);

    // 4. Retornar DTO
    return {
      vendaId: venda.id,
      novoStatus: venda.status,
    };
  }
}