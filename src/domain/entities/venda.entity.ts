// /src/domain/entities/venda.entity.ts
import { ItemVenda } from './item-venda.entity';

// Enum para os status da Venda (boas práticas)
export enum StatusVenda {
  PENDENTE = 'Pendente',
  PAGO = 'Pago',
  CANCELADO = 'Cancelado',
}

/**
 * A entidade Venda é o agregado principal da transação.
 * Ela armazena o *resultado* final do cálculo de preços.
 * * A lógica de cálculo (o "Motor de Promoções") NÃO vive aqui.
 * Ela vive na camada de Aplicação (Use Case) e apenas passa
 * os valores finais para o construtor da Venda.
 */
export class Venda {
  id: string; // ID da Venda (ex: uuid)
  itens: ItemVenda[]; // A lista de itens "congelados"
  
  /**
   * O valor TOTAL FINAL (em centavos) da venda, após todas
   * as promoções, descontos e taxas.
   */
  totalFinalEmCentavos: number;
  
  status: StatusVenda;
  criadoEm: Date;
  atualizadoEm: Date;

  constructor(
    id: string,
    itens: ItemVenda[],
    totalFinalEmCentavos: number
  ) {
    this.id = id;
    this.itens = itens;
    this.totalFinalEmCentavos = totalFinalEmCentavos;
    
    this.status = StatusVenda.PENDENTE;
    this.criadoEm = new Date();
    this.atualizadoEm = new Date();
  }

  // --- Lógica de Negócio (ações da própria entidade) ---

  /**
   * Marca a venda como paga.
   */
  marcarComoPaga(): void {
    if (this.status !== StatusVenda.PENDENTE) {
      throw new Error(`Não é possível pagar uma venda com status: ${this.status}`);
    }
    this.status = StatusVenda.PAGO;
    this.atualizadoEm = new Date();
  }

  /**
   * Cancela a venda.
   */
  cancelar(): void {
    if (this.status === StatusVenda.CANCELADO) {
      return; // Já está cancelada
    }
    this.status = StatusVenda.CANCELADO;
    this.atualizadoEm = new Date();
    // (Em um caso real, isso dispararia um evento de "VendaCancelada"
    // para a camada de aplicação lidar com estornos).
  }
  
  /**
   * Helper para obter o total formatado (R$).
   */
  obterTotalFormatado(): string {
    const precoEmReais = (this.totalFinalEmCentavos / 100).toFixed(2);
    return `R$ ${precoEmReais.replace('.', ',')}`;
  }
}