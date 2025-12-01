import { Request, Response } from 'express';
import { CriarEncomendaUseCase } from '../../../application/use-cases/criar-encomenda/criar-encomenda.usecase';
import { ListarEncomendasUseCase } from '../../../application/use-cases/listar-encomendas/listar-encomendas.usecase';
import { AtualizarStatusEncomendaUseCase } from '../../../application/use-cases/atualizar-status-encomenda/atualizar-status-encomenda.usecase';
import { StatusEncomenda } from '../../../domain/entities/encomenda.entity';

export class EncomendaController {
    constructor(
        private readonly criarEncomendaUseCase: CriarEncomendaUseCase,
        private readonly listarEncomendasUseCase: ListarEncomendasUseCase,
        private readonly atualizarStatusEncomendaUseCase: AtualizarStatusEncomendaUseCase
    ) { }

    async handleCriar(req: Request, res: Response): Promise<void> {
        try {
            const { clienteNome, clienteTelefone, dataEntrega, observacoes, itens } = req.body;

            if (!clienteNome || !dataEntrega || !itens || itens.length === 0) {
                res.status(400).json({ erro: 'Dados inválidos. Verifique nome, data e itens.' });
                return;
            }

            const output = await this.criarEncomendaUseCase.executar({
                clienteNome,
                clienteTelefone,
                dataEntrega,
                observacoes,
                itens,
            });

            res.status(201).json(output);
        } catch (error: any) {
            console.error('Erro ao criar encomenda:', error);
            res.status(500).json({ erro: error.message || 'Erro interno ao criar encomenda.' });
        }
    }

    async handleListar(req: Request, res: Response): Promise<void> {
        try {
            const { status } = req.query;
            const output = await this.listarEncomendasUseCase.executar({
                status: status as StatusEncomenda,
            });
            res.json(output);
        } catch (error: any) {
            console.error('Erro ao listar encomendas:', error);
            res.status(500).json({ erro: error.message });
        }
    }

    async handleAtualizarStatus(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { novoStatus } = req.body;

            if (!novoStatus) {
                res.status(400).json({ erro: 'Novo status é obrigatório.' });
                return;
            }

            await this.atualizarStatusEncomendaUseCase.executar({
                id,
                novoStatus: novoStatus as StatusEncomenda,
            });

            res.json({ sucesso: true });
        } catch (error: any) {
            console.error('Erro ao atualizar status:', error);
            res.status(500).json({ erro: error.message });
        }
    }
}
