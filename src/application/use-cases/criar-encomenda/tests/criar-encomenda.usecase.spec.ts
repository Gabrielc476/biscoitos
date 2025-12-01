import { CriarEncomendaUseCase } from '../criar-encomenda.usecase';
import { IEncomendaRepositorio } from '../../../../domain/repositories/iencomenda.repositorio';
import { IProdutoRepositorio } from '../../../../domain/repositories/iproduto.repositorio';
import { IPromocaoRepositorio } from '../../../../domain/repositories/ipromocao.repositorio';
import { MotorPromocaoService } from '../../../services/motor-promocao.service';
import { Produto } from '../../../../domain/entities/produto.entity';

// [FIX] Mock do uuid para evitar erro de "Unexpected token 'export'" do Jest
jest.mock('uuid', () => ({
    v4: () => 'uuid-test-123'
}));

describe('CriarEncomendaUseCase', () => {
    let useCase: CriarEncomendaUseCase;
    let encomendaRepo: IEncomendaRepositorio;
    let produtoRepo: IProdutoRepositorio;
    let promocaoRepo: IPromocaoRepositorio;
    let motorPromocao: MotorPromocaoService;

    beforeEach(() => {
        // Mock dos Repositórios
        encomendaRepo = {
            criar: jest.fn(),
            buscarPorId: jest.fn(),
            listarTodas: jest.fn(),
            atualizarStatus: jest.fn(),
        };

        produtoRepo = {
            salvar: jest.fn(),
            buscarPorId: jest.fn(),
            buscarPorIds: jest.fn(),
            listarTodos: jest.fn(),
            listarTodosAtivos: jest.fn(),
            uploadImagem: jest.fn(), // [FIX] Adicionado mock faltante
        };

        promocaoRepo = {
            buscarAtivas: jest.fn(),
            buscarPorId: jest.fn(),
        };

        // Mock do Serviço
        motorPromocao = new MotorPromocaoService();
        motorPromocao.calcular = jest.fn().mockReturnValue({
            itensProcessados: [],
            totalFinalEmCentavos: 5000 // 50 reais
        });

        useCase = new CriarEncomendaUseCase(
            encomendaRepo,
            produtoRepo,
            promocaoRepo,
            motorPromocao
        );
    });

    it('deve criar uma encomenda com sucesso', async () => {
        // Arrange
        const produto = new Produto('p1', 'Cookie', 10, 100, 200);
        (produtoRepo.buscarPorIds as jest.Mock).mockResolvedValue([produto]);
        (promocaoRepo.buscarAtivas as jest.Mock).mockResolvedValue([]);

        const dataFutura = new Date();
        dataFutura.setDate(dataFutura.getDate() + 5); // 5 dias no futuro

        const input = {
            clienteNome: 'Gabriel',
            dataEntrega: dataFutura,
            itens: [{ produtoId: 'p1', quantidade: 2 }]
        };

        // Act
        const output = await useCase.executar(input);

        // Assert
        expect(output.id).toBeDefined();
        expect(output.total).toBe(5000);
        expect(encomendaRepo.criar).toHaveBeenCalledTimes(1);
        expect(produtoRepo.buscarPorIds).toHaveBeenCalledWith(['p1']);
    });

    it('deve lançar erro se data de entrega for no passado', async () => {
        const input = {
            clienteNome: 'Gabriel',
            dataEntrega: new Date('2020-01-01'), // Data passada
            itens: [{ produtoId: 'p1', quantidade: 2 }]
        };

        await expect(useCase.executar(input)).rejects.toThrow('A data de entrega deve ser futura.');
    });

    it('deve lançar erro se algum produto não for encontrado', async () => {
        (produtoRepo.buscarPorIds as jest.Mock).mockResolvedValue([]); // Nenhum produto encontrado

        const dataFutura = new Date();
        dataFutura.setDate(dataFutura.getDate() + 5);

        const input = {
            clienteNome: 'Gabriel',
            dataEntrega: dataFutura,
            itens: [{ produtoId: 'p1', quantidade: 2 }]
        };

        await expect(useCase.executar(input)).rejects.toThrow('Um ou mais produtos não foram encontrados.');
    });
});
