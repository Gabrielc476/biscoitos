import { Produto } from '../../../domain/entities/produto.entity';
import { IProdutoRepositorio } from '../../../domain/repositories/iproduto.repositorio';
import { IUseCase } from '../../iuse-case.interface';

// [MUDANÇA 1] - Adicione 'precoVendaEmCentavos' e 'quantidadeEstoque' ao DTO
interface ListarProdutosOutputDTO {
  id: string;
  nome: string;
  precoFormatado: string;
  precoVendaEmCentavos: number;
  quantidadeEstoque: number;
  imagemUrl?: string; // [NOVO]
}

// O Input é 'void' (não precisa de nada para listar)
export class ListarProdutosUseCase
  implements IUseCase<void, ListarProdutosOutputDTO[]> {
  // Recebe o repositório (Interface do Domínio) via injeção
  constructor(
    private readonly produtoRepo: IProdutoRepositorio
  ) { }

  /**
   * Executa a lógica de listar os produtos.
   */
  async executar(): Promise<ListarProdutosOutputDTO[]> {
    // 1. Chama o repositório (a implementação da infra)
    const produtos = await this.produtoRepo.listarTodosAtivos();

    console.log('🔍 [UseCase] Produtos encontrados:', produtos.length);
    if (produtos.length > 0) {
      console.log('🔍 [UseCase] Exemplo de produto (com imagem?):', JSON.stringify(produtos[0], null, 2));
    }

    // 2. Mapeia as Entidades para o DTO de Saída (para o frontend)
    return produtos.map((produto) => {
      // Assumindo que sua Entidade 'Produto' tem as propriedades
      // 'id', 'nome', 'precoVendaEmCentavos', 'quantidadeEstoque'
      // e o método 'obterPrecoVendaFormatado()'

      return {
        id: produto.id,
        nome: produto.nome,
        precoFormatado: produto.obterPrecoVendaFormatado(),
        // [MUDANÇA 2] - Exponha o preço de venda e o estoque
        precoVendaEmCentavos: produto.precoVendaEmCentavos,
        quantidadeEstoque: produto.quantidadeEstoque,
        imagemUrl: produto.imagemUrl, // [NOVO]
      };
    });
  }
}