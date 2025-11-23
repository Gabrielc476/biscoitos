import { Request, Response } from 'express';
import { CriarVendaUseCase } from '../../../application/use-cases/criar-venda/criar-venda.usecase';
import { ListarVendasUseCase } from '../../../application/use-cases/listar-vendas/listar-vendas.usecase';
import { GerarPixVendaUseCase } from '../../../application/use-cases/gerar-pix-venda/gerar-pix-venda.usecase';
import { ConfirmarPagamentoUseCase } from '../../../application/use-cases/confirmar-pagamento/confirmar-pagamento.usecase';

/**
 * Controller para manipular requisições HTTP relacionadas a Vendas.
 */
export class VendaController {
  constructor(
    private readonly criarVendaUseCase: CriarVendaUseCase,
    private readonly listarVendasUseCase: ListarVendasUseCase,
    private readonly gerarPixVendaUseCase: GerarPixVendaUseCase,
    private readonly confirmarPagamentoUseCase: ConfirmarPagamentoUseCase
  ) {}

  /**
   * Lida com a requisição de Criar uma nova Venda (POST /vendas)
   */
  async handleCriarVenda(req: Request, res: Response): Promise<Response> {
    try {
      const input = req.body;
      
      // [DEBUG LOG] Ver o que o frontend enviou
      console.log('🔵 [POST /vendas] Recebido:', JSON.stringify(input, null, 2));

      const output = await this.criarVendaUseCase.executar(input);
      
      console.log('🟢 [POST /vendas] Sucesso! ID:', output.vendaId);
      return res.status(201).json(output);

    } catch (error: any) {
      // [DEBUG LOG] Ver o erro real do UseCase
      console.error('🔴 [POST /vendas] Erro:', error.message);
      
      // Mostra a linha exata onde o erro aconteceu no backend
      if (error.stack) {
        console.error('🔴 Stack Trace:', error.stack);
      }

      return res.status(400).json({
        message: error.message || 'Erro inesperado ao processar venda.',
      });
    }
  }

  /**
   * Lida com a requisição de Listar Vendas (GET /vendas)
   */
  async handleListarVendas(req: Request, res: Response): Promise<Response> {
    try {
      const input = req.query;
      const output = await this.listarVendasUseCase.executar(input as any);
      return res.status(200).json(output);
    } catch (error: any) {
      console.error('🔴 [GET /vendas] Erro:', error.message);
      return res.status(500).json({
        message: error.message || 'Erro inesperado ao listar vendas.',
      });
    }
  }

  /**
   * Lida com a requisição de Gerar o Pix (GET /vendas/:id/pix)
   */
  async handleGerarPix(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const output = await this.gerarPixVendaUseCase.executar({ vendaId: id });
      return res.status(200).json(output);
    } catch (error: any) {
      console.error('🔴 [GET /pix] Erro:', error.message);
      return res.status(400).json({
        message: error.message || 'Erro ao gerar Pix.',
      });
    }
  }

  /**
   * Lida com a requisição de Confirmar Pagamento (PATCH /vendas/:id/pagar)
   */
  async handleConfirmarPagamento(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const output = await this.confirmarPagamentoUseCase.executar({ vendaId: id });
      return res.status(200).json(output);
    } catch (error: any) {
      console.error('🔴 [PATCH /pagar] Erro:', error.message);
      return res.status(400).json({
        message: error.message || 'Erro ao confirmar pagamento.',
      });
    }
  }
}