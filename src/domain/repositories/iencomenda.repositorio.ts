import { Encomenda, StatusEncomenda } from '../entities/encomenda.entity';

export interface IEncomendaRepositorio {
    criar(encomenda: Encomenda): Promise<void>;
    buscarPorId(id: string): Promise<Encomenda | null>;
    listarTodas(): Promise<Encomenda[]>;
    atualizarStatus(id: string, status: StatusEncomenda): Promise<void>;
}
