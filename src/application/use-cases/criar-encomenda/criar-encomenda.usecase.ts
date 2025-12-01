import { IUseCase } from '../../iuse-case.interface';
import { CriarEncomendaInputDTO, CriarEncomendaOutputDTO } from './criar-encomenda.dto';
import { IEncomendaRepositorio } from '../../../domain/repositories/iencomenda.repositorio';
import { IProdutoRepositorio } from '../../../domain/repositories/iproduto.repositorio';
import { IPromocaoRepositorio } from '../../../domain/repositories/ipromocao.repositorio';
import { MotorPromocaoService } from '../../services/motor-promocao.service';
import { Encomenda, StatusEncomenda } from '../../../domain/entities/encomenda.entity';
import { ItemEncomenda } from '../../../domain/entities/item-encomenda.entity';
import { v4 as uuidv4 } from 'uuid';

export class CriarEncomendaUseCase implements IUseCase<CriarEncomendaInputDTO, CriarEncomendaOutputDTO> {
    constructor(
        private readonly encomendaRepo: IEncomendaRepositorio,
        private readonly produtoRepo: IProdutoRepositorio,
        private readonly promocaoRepo: IPromocaoRepositorio,
        private readonly motorPromocao: MotorPromocaoService
    ) { }

    async executar(input: CriarEncomendaInputDTO): Promise<CriarEncomendaOutputDTO> {
        // 1. Validar Data de Entrega (deve ser futura)
        if (new Date(input.dataEntrega) < new Date()) {
            throw new Error('A data de entrega deve ser futura.');
        }

        // 2. Buscar Produtos
        const produtoIds = input.itens.map((i) => i.produtoId);
        const produtos = await this.produtoRepo.buscarPorIds(produtoIds);

        if (produtos.length !== input.itens.length) {
            throw new Error('Um ou mais produtos não foram encontrados.');
        }

        // 3. Preparar lista expandida para o Motor de Promoção
        // O motor espera uma lista plana de produtos (ex: [Cookie, Cookie, Brownie])
        const produtosParaCalculo: any[] = [];

        // Também preparamos os itens da encomenda
        const itensEncomenda: ItemEncomenda[] = [];
        const encomendaId = uuidv4();

        for (const itemInput of input.itens) {
            const produto = produtos.find((p) => p.id === itemInput.produtoId);
            if (!produto) continue;

            // Adiciona N vezes na lista para cálculo
            for (let i = 0; i < itemInput.quantidade; i++) {
                produtosParaCalculo.push(produto);
            }

            // Cria o ItemEncomenda (preservando o ID do produto)
            itensEncomenda.push(
                new ItemEncomenda(
                    uuidv4(),
                    encomendaId,
                    produto.id,
                    produto.nome,
                    itemInput.quantidade,
                    produto.precoVendaEmCentavos // Preço unitário original
                )
            );
        }

        // 4. Calcular Total com Promoções
        const promocoesAtivas = await this.promocaoRepo.buscarAtivas();
        const resultadoCalculo = this.motorPromocao.calcular(
            produtosParaCalculo,
            promocoesAtivas,
            input.promocoesSelecionadas // [NOVO] Passando flags
        );

        // 5. Criar a Encomenda
        const encomenda = new Encomenda(
            encomendaId,
            input.clienteNome,
            input.clienteTelefone || null,
            new Date(input.dataEntrega),
            StatusEncomenda.PENDENTE,
            input.observacoes || null,
            itensEncomenda,
            resultadoCalculo.totalFinalEmCentavos // Usa o total com desconto
        );

        // 6. Persistir
        await this.encomendaRepo.criar(encomenda);

        return {
            id: encomenda.id,
            total: encomenda.totalEmCentavos,
            status: encomenda.status,
        };
    }
}
