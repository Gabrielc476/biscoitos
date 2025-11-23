import { IProdutoRepositorio } from '../../../domain/repositories/iproduto.repositorio';
import { IVendaRepositorio } from '../../../domain/repositories/ivenda.repositorio';
import { IPromocaoRepositorio } from '../../../domain/repositories/ipromocao.repositorio';
import { MotorPromocaoService } from '../../services/motor-promocao.service';
import { Venda } from '../../../domain/entities/venda.entity';
import { IUseCase } from '../../iuse-case.interface';
import { CriarVendaInputDTO, CriarVendaOutputDTO } from './criar-venda.dto';
import { v4 as uuidv4 } from 'uuid';
import { Produto } from '../../../domain/entities/produto.entity';

export class CriarVendaUseCase
  implements IUseCase<CriarVendaInputDTO, CriarVendaOutputDTO>
{
  constructor(
    private readonly produtoRepo: IProdutoRepositorio,
    private readonly vendaRepo: IVendaRepositorio,
    private readonly promocaoRepo: IPromocaoRepositorio,
    private readonly motorPromocao: MotorPromocaoService,
  ) {}

  async executar(input: CriarVendaInputDTO): Promise<CriarVendaOutputDTO> {
    
    // [CORREÇÃO 1] Extrair IDs ÚNICOS para a busca no banco
    // Se o carrinho tem { id: "A", qtd: 2 }, buscamos "A" apenas uma vez.
    const idsUnicos = [...new Set(input.itens.map(item => item.produtoId))];
    
    // Busca no banco (retorna 1 registro por ID único)
    const produtosEncontrados = await this.produtoRepo.buscarPorIds(idsUnicos);

    // [CORREÇÃO 2] Validação correta
    // Comparamos encontrados (1) com buscados únicos (1). Agora passa!
    if (produtosEncontrados.length !== idsUnicos.length) {
      throw new Error("Um ou mais produtos não foram encontrados.");
    }

    // [CORREÇÃO 3] "Expandir" os produtos para o Motor de Promoção
    // O motor precisa receber [ProdutoA, ProdutoA] para calcular "2 por 10".
    const listaExpandidaParaMotor: Produto[] = [];

    for (const itemInput of input.itens) {
      const produtoRef = produtosEncontrados.find(p => p.id === itemInput.produtoId);
      
      if (produtoRef) {
        // Adiciona o mesmo objeto N vezes na lista (conforme a quantidade)
        for (let i = 0; i < itemInput.quantidade; i++) {
          listaExpandidaParaMotor.push(produtoRef);
        }
      }
    }
    
    // (Aqui entraria a validação de estoque, comparando 'input.itens'...)

    // 3. Buscar as promoções ativas
    const promocoesAtivas = await this.promocaoRepo.buscarTodasAtivas();

    // 4. Chamar o "Motor" com a lista expandida (ex: [Biscoito, Biscoito])
    const { itensProcessados, totalFinalEmCentavos } =
      this.motorPromocao.calcular(listaExpandidaParaMotor, promocoesAtivas);

    // 5. Criar a entidade Venda
    const novaVenda = new Venda(
      uuidv4(),
      itensProcessados,
      totalFinalEmCentavos,
    );

    // 6. Persistir a Venda
    await this.vendaRepo.criar(novaVenda);

  for (const itemInput of input.itens) {
  const produto = produtosEncontrados.find(p => p.id === itemInput.produtoId);

  if (produto) {
    // 1. A Entidade valida a regra de negócio (se pode diminuir)
    produto.diminuirEstoque(itemInput.quantidade); 
    
    // 2. O repositório persiste a mudança de estado (o novo estoque)
    await this.produtoRepo.salvar(produto); 
  }
}

    // 8. Retornar o DTO
    return {
      vendaId: novaVenda.id,
      totalPagoEmCentavos: novaVenda.totalFinalEmCentavos,
      totalFormatado: novaVenda.obterTotalFormatado(),
      status: novaVenda.status,
      itensProcessados: itensProcessados.map(item => ({
        nomeProduto: item.nomeProduto,
        quantidade: item.quantidade,
        precoPagoFormatado: `R$ ${(item.precoTotalPagoEmCentavos / 100).toFixed(2).replace('.', ',')}`,
      })),
    };
  }
}