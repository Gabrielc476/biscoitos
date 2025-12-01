import { StatusEncomenda } from '../../../domain/entities/encomenda.entity';

export interface AtualizarStatusEncomendaInputDTO {
    id: string;
    novoStatus: StatusEncomenda;
}

export interface AtualizarStatusEncomendaOutputDTO {
    sucesso: boolean;
}
