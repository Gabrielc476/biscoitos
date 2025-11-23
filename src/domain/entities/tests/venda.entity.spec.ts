// /src/domain/entities/venda.entity.spec.ts

import { Venda, StatusVenda } from '../venda.entity';
import { ItemVenda } from '../item-venda.entity';

describe('Venda Entity', () => {
  let venda: Venda;
  const mockItem = new ItemVenda('item-1', 'prod-1', 1, 'Biscoito', 590, 590);

  beforeEach(() => {
    venda = new Venda('venda-1', [mockItem], 590);
  });

  it('deve ser criada com status PENDENTE', () => {
    expect(venda.status).toBe(StatusVenda.PENDENTE);
  });

  it('deve formatar o total corretamente', () => {
    const vendaTotalAlto = new Venda('venda-2', [], 10599); // R$ 105,99
    expect(venda.obterTotalFormatado()).toBe('R$ 5,90');
    expect(vendaTotalAlto.obterTotalFormatado()).toBe('R$ 105,99');
  });

  describe('Mudança de Status', () => {
    it('deve mudar o status de PENDENTE para PAGO', () => {
      venda.marcarComoPaga();
      expect(venda.status).toBe(StatusVenda.PAGO);
    });

    it('deve mudar o status de PENDENTE para CANCELADO', () => {
      venda.cancelar();
      expect(venda.status).toBe(StatusVenda.CANCELADO);
    });

    it('deve mudar o status de PAGO para CANCELADO (ex: estorno)', () => {
      venda.marcarComoPaga(); // Primeiro paga
      venda.cancelar(); // Depois cancela (estorna)
      expect(venda.status).toBe(StatusVenda.CANCELADO);
    });

    it('deve lançar um erro ao tentar pagar uma venda CANCELADA', () => {
      venda.cancelar(); // Está cancelada
      expect(() => {
        venda.marcarComoPaga();
      }).toThrow('Não é possível pagar uma venda com status: Cancelado');
    });

    it('deve lançar um erro ao tentar pagar uma venda que já está PAGA', () => {
      venda.marcarComoPaga(); // Está paga
      expect(() => {
        venda.marcarComoPaga();
      }).toThrow('Não é possível pagar uma venda com status: Pago');
    });
  });
});