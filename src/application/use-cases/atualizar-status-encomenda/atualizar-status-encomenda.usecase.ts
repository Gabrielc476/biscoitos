import { IUseCase } from '../../iuse-case.interface';
import { AtualizarStatusEncomendaInputDTO, AtualizarStatusEncomendaOutputDTO } from './atualizar-status-encomenda.dto';
import { IEncomendaRepositorio } from '../../../domain/repositories/iencomenda.repositorio';

export class AtualizarStatusEncomendaUseCase implements IUseCase<AtualizarStatusEncomendaInputDTO, AtualizarStatusEncomendaOutputDTO> {
    constructor(private readonly encomendaRepo: IEncomendaRepositorio) { }

    async executar(input: AtualizarStatusEncomendaInputDTO): Promise<AtualizarStatusEncomendaOutputDTO> {
        const encomenda = await this.encomendaRepo.buscarPorId(input.id);

        if (!encomenda) {
            throw new Error('Encomenda não encontrada.');
        }

        // Aqui poderiam entrar validações de transição de estado (ex: não pode voltar de ENTREGUE para PENDENTE)

        await this.encomendaRepo.atualizarStatus(input.id, input.novoStatus);

        return { sucesso: true };
    }
}
