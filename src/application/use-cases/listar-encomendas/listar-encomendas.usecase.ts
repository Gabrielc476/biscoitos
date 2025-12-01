import { IUseCase } from '../../iuse-case.interface';
import { ListarEncomendasInputDTO, ListarEncomendasOutputDTO } from './listar-encomendas.dto';
import { IEncomendaRepositorio } from '../../../domain/repositories/iencomenda.repositorio';
import { Encomenda } from '../../../domain/entities/encomenda.entity';

export class ListarEncomendasUseCase implements IUseCase<ListarEncomendasInputDTO, ListarEncomendasOutputDTO[]> {
    constructor(private readonly encomendaRepo: IEncomendaRepositorio) { }

    async executar(input: ListarEncomendasInputDTO): Promise<ListarEncomendasOutputDTO[]> {
        const encomendas = await this.encomendaRepo.listarTodas();

        // Filtragem simples em memória (idealmente seria no banco)
        const encomendasFiltradas = input.status
            ? encomendas.filter((e) => e.status === input.status)
            : encomendas;

        return encomendasFiltradas.map(this.mapearParaDTO);
    }

    private mapearParaDTO(encomenda: Encomenda): ListarEncomendasOutputDTO {
        const resumoItens = encomenda.itens
            .map((item) => `${item.nomeProduto} (${item.quantidade})`)
            .join(', ');

        return {
            id: encomenda.id,
            clienteNome: encomenda.clienteNome,
            dataEntrega: encomenda.dataEntrega.toISOString(),
            status: encomenda.status,
            totalFormatado: encomenda.obterTotalFormatado(),
            resumoItens,
        };
    }
}
