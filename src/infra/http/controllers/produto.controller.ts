import { Request, Response } from 'express';
import { CriarProdutoUseCase } from '../../../application/use-cases/criar-produto/criar-produto.usecase';
import { ListarProdutosUseCase } from '../../../application/use-cases/listar-produtos/listar-produtos.usecase';
import { AtualizarEstoqueUseCase } from '../../../application/use-cases/atualizar-estoque/atualizar-estoque.usecase';
import { UploadImagemProdutoUseCase } from '../../../application/use-cases/upload-imagem/upload-imagem.usecase';

export class ProdutoController {
  constructor(
    private readonly criarProdutoUseCase: CriarProdutoUseCase,
    private readonly listarProdutosUseCase: ListarProdutosUseCase,
    private readonly atualizarEstoqueUseCase: AtualizarEstoqueUseCase,
    private readonly uploadImagemProdutoUseCase: UploadImagemProdutoUseCase,
  ) { }

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
   * Lida com a requisição de Atualizar Estoque (PATCH /produtos/:id/estoque)
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

  /**
   * Lida com o upload de imagem (POST /produtos/upload)
   * Espera um arquivo 'file' no multipart/form-data.
   */
  async handleUploadImagem(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
      }

      const output = await this.uploadImagemProdutoUseCase.executar({
        arquivo: {
          buffer: req.file.buffer,
          mimetype: req.file.mimetype,
          originalname: req.file.originalname,
        },
      });

      return res.status(200).json(output);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || 'Erro ao fazer upload da imagem.',
      });
    }
  }
}