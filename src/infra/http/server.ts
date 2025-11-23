import express from 'express';
import cors from 'cors';

// --- CAMADA DE INFRA (IMPLEMENTAÇÕES DOS REPOSITÓRIOS) ---
import { ProdutoSupabaseRepositorio } from '../database/supabase/repositories/produto.supabase.repositorio';
import { VendaSupabaseRepositorio } from '../database/supabase/repositories/venda.supabase.repositorio';
import { PromocaoSupabaseRepositorio } from '../database/supabase/repositories/promocao.supabase.repositorio';

// --- CAMADA DE APLICAÇÃO (SERVIÇOS E CASOS DE USO) ---
import { MotorPromocaoService } from '../../application/services/motor-promocao.service';
import { CriarProdutoUseCase } from '../../application/use-cases/criar-produto/criar-produto.usecase';
import { ListarProdutosUseCase } from '../../application/use-cases/listar-produtos/listar-produtos.usecase';
// [NOVO] Importe o Caso de Uso de Atualizar Estoque
import { AtualizarEstoqueUseCase } from '../../application/use-cases/atualizar-estoque/atualizar-estoque.usecase'; 
import { CriarVendaUseCase } from '../../application/use-cases/criar-venda/criar-venda.usecase';
import { ListarVendasUseCase } from '../../application/use-cases/listar-vendas/listar-vendas.usecase';
import { GerarPixVendaUseCase } from '../../application/use-cases/gerar-pix-venda/gerar-pix-venda.usecase';
import { ConfirmarPagamentoUseCase } from '../../application/use-cases/confirmar-pagamento/confirmar-pagamento.usecase';

// --- CAMADA DE INFRA (CONTROLLERS) ---
import { ProdutoController } from './controllers/produto.controller';
import { VendaController } from './controllers/venda.controller';

// ----------------------------------------------------
// --- INJEÇÃO DE DEPENDÊNCIA (A "COLA") ---
// ----------------------------------------------------

// 1. Instanciar Repositórios (Infra)
const produtoRepo = new ProdutoSupabaseRepositorio();
const vendaRepo = new VendaSupabaseRepositorio();
const promocaoRepo = new PromocaoSupabaseRepositorio();

// 2. Instanciar Serviços (Aplicação)
const motorPromocao = new MotorPromocaoService();

// 3. Instanciar Casos de Uso (Aplicação)
const criarProdutoUseCase = new CriarProdutoUseCase(produtoRepo);
const listarProdutosUseCase = new ListarProdutosUseCase(produtoRepo);
// [NOVO] Instancie o Caso de Uso
const atualizarEstoqueUseCase = new AtualizarEstoqueUseCase(produtoRepo); 

const criarVendaUseCase = new CriarVendaUseCase(
  produtoRepo,
  vendaRepo,
  promocaoRepo,
  motorPromocao,
);
const listarVendasUseCase = new ListarVendasUseCase(vendaRepo);
const gerarPixVendaUseCase = new GerarPixVendaUseCase(vendaRepo);
const confirmarPagamentoUseCase = new ConfirmarPagamentoUseCase(vendaRepo);

// 4. Instanciar Controllers (Infra)
// [CORREÇÃO] Injete o novo caso de uso no controller de Produto
const produtoController = new ProdutoController(
  criarProdutoUseCase,
  listarProdutosUseCase,
  atualizarEstoqueUseCase // [NOVO]
);

const vendaController = new VendaController(
  criarVendaUseCase,
  listarVendasUseCase,
  gerarPixVendaUseCase,
  confirmarPagamentoUseCase
);

// ----------------------------------------------------
// --- CONFIGURAÇÃO DO EXPRESS ---
// ----------------------------------------------------
const app = express();
const port = process.env.PORT || 3333;
app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// --- ROTAS DA API ---
// ----------------------------------------------------

// Rotas de Produto
app.post('/produtos', (req, res) => produtoController.handleCriarProduto(req, res));
app.get('/produtos', (req, res) => produtoController.handleListarProdutos(req, res));

// [NOVA ROTA] Rota para atualizar estoque
app.patch('/produtos/:id/estoque', (req, res) => produtoController.handleAtualizarEstoque(req, res));

// Rotas de Venda
app.post('/vendas', (req, res) => vendaController.handleCriarVenda(req, res));
app.get('/vendas', (req, res) => vendaController.handleListarVendas(req, res));

// Rotas de Pagamento
app.get('/vendas/:id/pix', (req, res) => vendaController.handleGerarPix(req, res));
app.patch('/vendas/:id/pagar', (req, res) => vendaController.handleConfirmarPagamento(req, res));

// ----------------------------------------------------
// --- INICIAR SERVIDOR ---
// ----------------------------------------------------
app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});