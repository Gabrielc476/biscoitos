import { StatusEncomenda } from '../../../domain/entities/encomenda.entity';

export interface ListarEncomendasInputDTO {
    status?: StatusEncomenda; // Filtro opcional
}

export interface ListarEncomendasOutputDTO {
    id: string;
    clienteNome: string;
    dataEntrega: string; // ISO
    status: string;
    totalFormatado: string;
    resumoItens: string;
}
