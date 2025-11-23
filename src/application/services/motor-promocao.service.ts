import { Produto } from '../../domain/entities/produto.entity';
import { Promocao, TipoPromocao } from '../../domain/entities/promocao.entity';
import { ItemVenda } from '../../domain/entities/item-venda.entity';
import { v4 as uuidv4 } from 'uuid';

// Estrutura do resultado do cálculo
export interface ResultadoCalculo {
  itensProcessados: ItemVenda[];
  totalFinalEmCentavos: number;
}

/**
 * Este serviço contém a lógica de negócio complexa para
 * aplicar promoções a um carrinho de produtos.
 */
export class MotorPromocaoService {
  /**
   * Calcula o preço final do carrinho, aplicando promoções.
   */
  public calcular(
    produtos: Produto[], // Lista de produtos no carrinho (ex: 3 biscoitos)
    promocoes: Promocao[], // Lista de promoções ativas do banco
  ): ResultadoCalculo {
    
    // 1. Tenta encontrar a promoção "Leve 2 por R$ 10" para Biscoitos
    const promoBiscoito = promocoes.find(
      (p) =>
        p.ativa &&
        p.tipo === TipoPromocao.LEVE_X_PAGUE_Y_PRECO_FIXO &&
        p.nome.includes('2 por R$ 10'), // Simplificação
    );

    let itensProcessados: ItemVenda[] = [];
    let totalFinalEmCentavos = 0;
    
    const produtosElegiveis = produtos; 

    if (promoBiscoito) {
      const qtdParaAtivar = promoBiscoito.condicao_minimoItens!; // Ex: 2
      const precoPromo = promoBiscoito.acao_precoFixoEmCentavos!; // Ex: 1000

      const numPares = Math.floor(produtosElegiveis.length / qtdParaAtivar);
      const numAvulsos = produtosElegiveis.length % qtdParaAtivar;

      // 2. Adiciona os "Pares" (pacotes promocionais)
      if (numPares > 0) {
        // [CORREÇÃO] Usando o construtor auxiliar que define produtoId = null
        const itemPromocional = ItemVenda.createPromotionItem(
          uuidv4(),
          promoBiscoito.nome, // Ex: "Promo Biscoitos 2 por R$ 10"
          numPares * qtdParaAtivar, // Quantidade de produtos (ex: 2, 4, 6)
          precoPromo * numPares, // Preço pago (Ex: 1000 * 1 par = 1000)
        );
        
        itensProcessados.push(itemPromocional);
        totalFinalEmCentavos += itemPromocional.precoTotalPagoEmCentavos;
      }

      // 3. Adiciona os "Avulsos" (produtos que sobraram)
      if (numAvulsos > 0) {
        // Pega o último item (o avulso)
        const produtoAvulso = produtosElegiveis[produtosElegiveis.length - 1];
        const itemAvulso = new ItemVenda(
          uuidv4(),
          produtoAvulso.id, // ID real do produto
          numAvulsos, // 1
          produtoAvulso.nome,
          produtoAvulso.precoVendaEmCentavos,
          produtoAvulso.precoVendaEmCentavos * numAvulsos, // Pagou o preço cheio
        );
        itensProcessados.push(itemAvulso);
        totalFinalEmCentavos += itemAvulso.precoTotalPagoEmCentavos;
      }
    } else {
      // 4. Se não houver promoções, apenas adiciona os itens com preço normal
      // (Esta lógica ainda precisa ser ajustada para agrupar produtos, mas está funcional para 1x1)
      for (const produto of produtos) {
        const item = new ItemVenda(
          uuidv4(),
          produto.id,
          1,
          produto.nome,
          produto.precoVendaEmCentavos,
          produto.precoVendaEmCentavos,
        );
        itensProcessados.push(item);
        totalFinalEmCentavos += item.precoTotalPagoEmCentavos;
      }
    }

    return { itensProcessados, totalFinalEmCentavos };
  }
}