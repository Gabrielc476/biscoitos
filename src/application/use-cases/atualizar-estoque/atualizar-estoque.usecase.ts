import { IUseCase } from '../../iuse-case.interface';
import { IProdutoRepositorio } from '../../../domain/repositories/iproduto.repositorio';
// [FIX] Importando os DTOs do arquivo separado
import { AtualizarEstoqueInputDTO, AtualizarEstoqueOutputDTO } from './atualizar-estoque.dto';

export class AtualizarEstoqueUseCase implements IUseCase<AtualizarEstoqueInputDTO, AtualizarEstoqueOutputDTO> {
  constructor(private readonly produtoRepo: IProdutoRepositorio) {}

  async executar(input: AtualizarEstoqueInputDTO): Promise<AtualizarEstoqueOutputDTO> {
    // 1. Busca o produto
    const produto = await this.produtoRepo.buscarPorId(input.produtoId);

    if (!produto) {
      throw new Error('Produto não encontrado.');
    }

    // 2. Usa o método da Entidade (Domínio) para atualizar
    // A Entidade Produto deve ter o método 'atualizarEstoque(novaQuantidade)'
    produto.atualizarEstoque(input.novoEstoque);

    // 3. Persiste a alteração (Infra)
    await this.produtoRepo.salvar(produto);

    return {
      id: produto.id,
      novoEstoque: produto.quantidadeEstoque,
    };
  }
}