import express from 'express';
import cors from 'cors';

// --- CAMADA DE INFRA (IMPLEMENTAÇÕES DOS REPOSITÓRIOS) ---
import { ProdutoSupabaseRepositorio } from '../database/supabase/repositories/produto.supabase.repositorio';
import { VendaSupabaseRepositorio } from '../database/supabase/repositories/venda.supabase.repositorio';
import { PromocaoSupabaseRepositorio } from '../database/supabase/repositories/promocao.supabase.repositorio';
import { EncomendaSupabaseRepositorio } from '../database/supabase/repositories/encomenda.supabase.repositorio';

// --- CAMADA DE APLICAÇÃO (SERVIÇOS E CASOS DE USO) ---
import { MotorPromocaoService } from '../../application/services/motor-promocao.service';
import { CriarProdutoUseCase } from '../../application/use-cases/criar-produto/criar-produto.usecase';
import { ListarProdutosUseCase } from '../../application/use-cases/listar-produtos/listar-produtos.usecase';
import { AtualizarEstoqueUseCase } from '../../application/use-cases/atualizar-estoque/atualizar-estoque.usecase';
import { UploadImagemProdutoUseCase } from '../../application/use-cases/upload-imagem/upload-imagem.usecase';
import { CriarVendaUseCase } from '../../application/use-cases/criar-venda/criar-venda.usecase';
import { ListarVendasUseCase } from '../../application/use-cases/listar-vendas/listar-vendas.usecase';
import { GerarPixVendaUseCase } from '../../application/use-cases/gerar-pix-venda/gerar-pix-venda.usecase';
import { ConfirmarPagamentoUseCase } from '../../application/use-cases/confirmar-pagamento/confirmar-pagamento.usecase';
import { CriarEncomendaUseCase } from '../../application/use-cases/criar-encomenda/criar-encomenda.usecase';
import { ListarEncomendasUseCase } from '../../application/use-cases/listar-encomendas/listar-encomendas.usecase';
import { AtualizarStatusEncomendaUseCase } from '../../application/use-cases/atualizar-status-encomenda/atualizar-status-encomenda.usecase';

// --- CAMADA DE INFRA (CONTROLLERS) ---
import { ProdutoController } from './controllers/produto.controller';
import { VendaController } from './controllers/venda.controller';
import { EncomendaController } from './controllers/encomenda.controller';

// --- MIDDLEWARES ---
import { upload } from './middlewares/upload.middleware';

// ----------------------------------------------------
// --- INJEÇÃO DE DEPENDÊNCIA (A "COLA") ---
// ----------------------------------------------------

// 1. Instanciar Repositórios (Infra)
const produtoRepo = new ProdutoSupabaseRepositorio();
const vendaRepo = new VendaSupabaseRepositorio();
const promocaoRepo = new PromocaoSupabaseRepositorio();
const encomendaRepo = new EncomendaSupabaseRepositorio();

// 2. Instanciar Serviços (Aplicação)
const motorPromocao = new MotorPromocaoService();

// 3. Instanciar Casos de Uso (Aplicação)
const criarProdutoUseCase = new CriarProdutoUseCase(produtoRepo);
const listarProdutosUseCase = new ListarProdutosUseCase(produtoRepo);
const atualizarEstoqueUseCase = new AtualizarEstoqueUseCase(produtoRepo);
const uploadImagemProdutoUseCase = new UploadImagemProdutoUseCase(produtoRepo);

const criarVendaUseCase = new CriarVendaUseCase(
  produtoRepo,
  vendaRepo,
  promocaoRepo,
  motorPromocao,
);
const listarVendasUseCase = new ListarVendasUseCase(vendaRepo);
const gerarPixVendaUseCase = new GerarPixVendaUseCase(vendaRepo);
const confirmarPagamentoUseCase = new ConfirmarPagamentoUseCase(vendaRepo);

const criarEncomendaUseCase = new CriarEncomendaUseCase(
  encomendaRepo,
  produtoRepo,
  promocaoRepo,
  motorPromocao
);
const listarEncomendasUseCase = new ListarEncomendasUseCase(encomendaRepo);
const atualizarStatusEncomendaUseCase = new AtualizarStatusEncomendaUseCase(encomendaRepo);

// 4. Instanciar Controllers (Infra)
const produtoController = new ProdutoController(
  criarProdutoUseCase,
  listarProdutosUseCase,
  atualizarEstoqueUseCase,
  uploadImagemProdutoUseCase
);

const vendaController = new VendaController(
  criarVendaUseCase,
  listarVendasUseCase,
  gerarPixVendaUseCase,
  confirmarPagamentoUseCase
);

const encomendaController = new EncomendaController(
  criarEncomendaUseCase,
  listarEncomendasUseCase,
  atualizarStatusEncomendaUseCase
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
app.patch('/produtos/:id/estoque', (req, res) => produtoController.handleAtualizarEstoque(req, res));
app.post('/produtos/upload', upload.single('file'), (req, res) => produtoController.handleUploadImagem(req, res));

// Rotas de Venda
app.post('/vendas', (req, res) => vendaController.handleCriarVenda(req, res));
app.get('/vendas', (req, res) => vendaController.handleListarVendas(req, res));
app.get('/vendas/:id/pix', (req, res) => vendaController.handleGerarPix(req, res));
app.patch('/vendas/:id/pagar', (req, res) => vendaController.handleConfirmarPagamento(req, res));

// Rotas de Encomenda
app.post('/encomendas', (req, res) => encomendaController.handleCriar(req, res));
app.get('/encomendas', (req, res) => encomendaController.handleListar(req, res));
app.patch('/encomendas/:id/status', (req, res) => encomendaController.handleAtualizarStatus(req, res));

// ----------------------------------------------------
// --- INICIAR SERVIDOR ---
// ----------------------------------------------------
app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});