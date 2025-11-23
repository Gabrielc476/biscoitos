// /src/domain/entities/tests/produto.entity.spec.ts
// (Ou onde você o colocou, ex: /src/domain/entities/produto.entity.spec.ts)

import { Produto } from '../produto.entity'; // Ajuste o caminho se necessário

// Descreve o conjunto de testes para a entidade Produto
describe('Produto Entity', () => {
  let produto: Produto;

  // 'beforeEach' é executado antes de cada 'it' (teste)
  beforeEach(() => {
    // Cria uma instância "limpa" para cada teste
    produto = new Produto(
      'uuid-001',
      'Biscoito',
      100, // 100 em estoque
      300, // Custo R$ 3,00
      590, // Venda R$ 5,90
    );
  });

  // --- Testes dos Métodos de Lógica de Negócio ---
  describe('Lógica de Negócio', () => {
    it('deve atualizar o estoque para um novo valor', () => {
      produto.atualizarEstoque(150);
      expect(produto.quantidadeEstoque).toBe(150);
    });

    it('deve lançar um erro ao tentar atualizar o estoque para um valor negativo', () => {
      expect(() => {
        produto.atualizarEstoque(-10);
      }).toThrow('Estoque não pode ser negativo.');
    });

    it('deve ajustar o preço de venda corretamente', () => {
      produto.ajustarPrecoVenda(650); // Novo preço: R$ 6,50
      expect(produto.precoVendaEmCentavos).toBe(650);
    });

    it('deve lançar um erro ao tentar ajustar o preço de venda para negativo', () => {
      expect(() => {
        produto.ajustarPrecoVenda(-100);
      }).toThrow('O preço de venda não pode ser negativo.');
    });

    it('deve calcular a margem de lucro percentual corretamente', () => {
      // Custo 300, Venda 590
      // Lucro = 290
      // Margem = (290 / 590) * 100 = 49.152...
      expect(produto.obterMargemLucroPercentual()).toBe(49.15); // 49.15%
    });

    it('deve retornar 0% de margem se o preço de venda for zero', () => {
      produto.ajustarPrecoVenda(0);
      expect(produto.obterMargemLucroPercentual()).toBe(0);
    });

    it('deve calcular o valor total do estoque (custo)', () => {
      // Estoque 100, Custo 300
      // Total = 100 * 300 = 30000
      expect(produto.obterValorTotalEstoqueCusto()).toBe(30000); // R$ 300,00
    });
  });

  // --- Testes dos Métodos de Formatação (Helpers) ---
  describe('Formatação de Preço', () => {
    it('deve formatar o preço de VENDA corretamente', () => {
      expect(produto.obterPrecoVendaFormatado()).toBe('R$ 5,90');
    });

    it('deve formatar o preço de CUSTO corretamente', () => {
      expect(produto.obterPrecoCustoFormatado()).toBe('R$ 3,00');
    });

    it('deve formatar preços maiores corretamente', () => {
      produto.ajustarPrecoVenda(12345); // R$ 123,45
      expect(produto.obterPrecoVendaFormatado()).toBe('R$ 123,45');
    });
  });
});