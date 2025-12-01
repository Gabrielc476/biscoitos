import { IProdutoRepositorio } from '../../../domain/repositories/iproduto.repositorio';
import { IUseCase } from '../../iuse-case.interface';
import { CriarProdutoInputDTO, CriarProdutoOutputDTO } from './criar-produto.dto';
import { v4 as uuidv4 } from 'uuid';
import { Produto } from '../../../domain/entities/produto.entity';

/**
 * Caso de Uso para a criação de um novo Produto.
 */
export class CriarProdutoUseCase
  implements IUseCase<CriarProdutoInputDTO, CriarProdutoOutputDTO> {
  // Injetamos a interface do repositório
  constructor(
    private readonly produtoRepo: IProdutoRepositorio
  ) { }

  async executar(input: CriarProdutoInputDTO): Promise<CriarProdutoOutputDTO> {
    // 1. Validação (Opcional, pois o construtor da entidade já valida)
    if (input.precoVendaEmCentavos < 0 || input.precoCustoEmCentavos < 0) {
      throw new Error("Preços não podem ser negativos.");
    }

    // 2. Gera um novo ID
    const id = uuidv4();

    // 3. Cria a Entidade de Domínio (aqui as regras de negócio são aplicadas)
    // Usamos a entidade que você forneceu
    const novoProduto = new Produto(
      id,
      input.nome,
      input.quantidadeEstoque,
      input.precoCustoEmCentavos,
      input.precoVendaEmCentavos,
      input.imagemUrl // [NOVO] - Passando a URL da imagem
    );

    // (A entidade 'Produto' já tem o 'ativo: true' por padrão
    // se tivéssemos essa versão da entidade)

    // 4. Persiste a entidade usando o Repositório
    await this.produtoRepo.salvar(novoProduto);

    // 5. Retorna o DTO de Saída
    return {
      id: novoProduto.id,
      nome: novoProduto.nome,
      quantidadeEstoque: novoProduto.quantidadeEstoque,
      precoVendaFormatado: novoProduto.obterPrecoVendaFormatado(),
    };
  }
}