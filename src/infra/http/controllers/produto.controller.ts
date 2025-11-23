import { Request, Response } from 'express';
import { CriarProdutoUseCase } from '../../../application/use-cases/criar-produto/criar-produto.usecase';
import { ListarProdutosUseCase } from '../../../application/use-cases/listar-produtos/listar-produtos.usecase';
// [NOVO] Importe o novo caso de uso
import { AtualizarEstoqueUseCase } from '../../../application/use-cases/atualizar-estoque/atualizar-estoque.usecase';

export class ProdutoController {
  constructor(
    private readonly criarProdutoUseCase: CriarProdutoUseCase,
    private readonly listarProdutosUseCase: ListarProdutosUseCase,
    // [NOVO] Injete o caso de uso aqui
    private readonly atualizarEstoqueUseCase: AtualizarEstoqueUseCase,
  ) {}

  // ... (handleCriarProduto e handleListarProdutos continuam iguais) ...

  async handleCriarProduto(req: Request, res: Response): Promise<Response> {
    try {
      const input = req.body; 
      const output = await this.criarProdutoUseCase.executar(input);
      return res.status(201).json(output);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Erro ao criar produto.' });
    }
  }

  async handleListarProdutos(req: Request, res: Response): Promise<Response> {
    try {
      const output = await this.listarProdutosUseCase.executar();
      return res.status(200).json(output);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Erro ao listar produtos.' });
    }
  }

  /**
   * [NOVO] Lida com a requisição de Atualizar Estoque (PATCH /produtos/:id/estoque)
   * Body esperado: { "novoEstoque": 50 }
   */
  async handleAtualizarEstoque(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params; // Pega o ID da URL
      const { novoEstoque } = req.body; // Pega a quantidade do corpo

      if (typeof novoEstoque !== 'number') {
        return res.status(400).json({ message: 'novoEstoque deve ser um número.' });
      }

      const output = await this.atualizarEstoqueUseCase.executar({
        produtoId: id,
        novoEstoque: novoEstoque,
      });

      return res.status(200).json(output);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || 'Erro ao atualizar estoque.',
      });
    }
  }
}