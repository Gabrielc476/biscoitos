import { Produto } from '../../domain/entities/produto.entity';
import { Promocao, TipoPromocao } from '../../domain/entities/promocao.entity';
import { ItemVenda } from '../../domain/entities/item-venda.entity';
import { v4 as uuidv4 } from 'uuid';

// Estrutura do resultado do cálculo
export interface ResultadoCalculo {
  itensProcessados: ItemVenda[];
  totalFinalEmCentavos: number;
}

export interface FlagsPromocao {
  family?: boolean;
  special?: boolean;
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
    flags: FlagsPromocao = {} // [NOVO] Flags vindas do frontend
  ): ResultadoCalculo {

    let itensProcessados: ItemVenda[] = [];
    let totalFinalEmCentavos = 0;

    // Separa produtos por preço para aplicar regras específicas
    const produtos590 = produtos.filter(p => p.precoVendaEmCentavos === 590);
    const produtos650 = produtos.filter(p => p.precoVendaEmCentavos === 650);
    const outrosProdutos = produtos.filter(p => p.precoVendaEmCentavos !== 590 && p.precoVendaEmCentavos !== 650);

    // --- 1. Promoção "Amigos e Família" (R$ 5,90) ---
    // Regra: 2 por R$ 8,00. Avulso R$ 4,60.
    if (flags.family && produtos590.length > 0) {
      const qtd = produtos590.length;
      const pares = Math.floor(qtd / 2);
      const avulsos = qtd % 2;

      if (pares > 0) {
        const itemPar = ItemVenda.createPromotionItem(
          uuidv4(),
          "Promo Amigos e Família (2 por R$ 8,00)",
          pares * 2,
          pares * 800 // 800 centavos por par
        );
        itensProcessados.push(itemPar);
        totalFinalEmCentavos += itemPar.precoTotalPagoEmCentavos;
      }

      if (avulsos > 0) {
        // Pega um produto de exemplo para manter o ID e nome corretos
        const prodExemplo = produtos590[0];
        const itemAvulso = new ItemVenda(
          uuidv4(),
          prodExemplo.id,
          avulsos,
          `${prodExemplo.nome} (Promo Família)`,
          460, // Preço unitário reduzido
          avulsos * 460
        );
        itensProcessados.push(itemAvulso);
        totalFinalEmCentavos += itemAvulso.precoTotalPagoEmCentavos;
      }
    } else {
      // Sem promoção, processa normal
      outrosProdutos.push(...produtos590);
    }

    // --- 2. Promoção "2 Especiais" (R$ 6,50) ---
    // Regra: 2 por R$ 12,00. Avulso preço normal (R$ 6,50).
    if (flags.special && produtos650.length > 0) {
      const qtd = produtos650.length;
      const pares = Math.floor(qtd / 2);
      const avulsos = qtd % 2;

      if (pares > 0) {
        const itemPar = ItemVenda.createPromotionItem(
          uuidv4(),
          "Promo 2 Especiais (2 por R$ 12,00)",
          pares * 2,
          pares * 1200 // 1200 centavos por par
        );
        itensProcessados.push(itemPar);
        totalFinalEmCentavos += itemPar.precoTotalPagoEmCentavos;
      }

      if (avulsos > 0) {
        // Avulsos pagam preço normal, então jogamos para o processamento padrão
        // Mas precisamos garantir que eles sejam processados.
        // Como 'outrosProdutos' vai processar item a item, podemos adicionar lá.
        // Porém, para manter a ordem ou lógica, vamos processar aqui mesmo.
        const prodExemplo = produtos650[0];
        const itemAvulso = new ItemVenda(
          uuidv4(),
          prodExemplo.id,
          avulsos,
          prodExemplo.nome,
          650,
          avulsos * 650
        );
        itensProcessados.push(itemAvulso);
        totalFinalEmCentavos += itemAvulso.precoTotalPagoEmCentavos;
      }
    } else {
      // Sem promoção, processa normal
      outrosProdutos.push(...produtos650);
    }

    // --- 2.5. Promoção Genérica do Banco (Ex: "2 por R$ 10") ---
    // Aplica-se aos produtos restantes (outrosProdutos)
    const promoBanco = promocoes.find(
      (p) =>
        p.ativa &&
        p.tipo === TipoPromocao.LEVE_X_PAGUE_Y_PRECO_FIXO &&
        p.nome.includes('2 por R$ 10') // Simplificação baseada no código anterior
    );

    const produtosParaProcessamentoPadrao: Produto[] = [];

    if (promoBanco && outrosProdutos.length > 0) {
      // Filtra apenas produtos elegíveis para essa promo (ex: Biscoitos básicos)
      // Como não temos categoria aqui fácil, vamos assumir que aplica a todos os "outros"
      // ou poderíamos filtrar por preço se soubéssemos (ex: 550).
      // Vamos aplicar a todos os 'outrosProdutos' por enquanto, como era antes.

      const qtdParaAtivar = promoBanco.condicao_minimoItens || 2;
      const precoPromo = promoBanco.acao_precoFixoEmCentavos || 1000;

      const qtd = outrosProdutos.length;
      const pares = Math.floor(qtd / qtdParaAtivar);
      const avulsos = qtd % qtdParaAtivar;

      if (pares > 0) {
        const itemPar = ItemVenda.createPromotionItem(
          uuidv4(),
          promoBanco.nome,
          pares * qtdParaAtivar,
          pares * precoPromo
        );
        itensProcessados.push(itemPar);
        totalFinalEmCentavos += itemPar.precoTotalPagoEmCentavos;
      }

      // Os avulsos sobram para o processamento padrão
      if (avulsos > 0) {
        // Pega os últimos 'avulsos' itens
        const sobrou = outrosProdutos.slice(qtd - avulsos);
        produtosParaProcessamentoPadrao.push(...sobrou);
      }
    } else {
      produtosParaProcessamentoPadrao.push(...outrosProdutos);
    }

    // --- 3. Processamento Padrão (Sem Promoção) ---
    // Agrupa por ID para não criar uma linha por item
    const mapaProdutos = new Map<string, { produto: Produto, qtd: number }>();

    for (const prod of produtosParaProcessamentoPadrao) {
      if (mapaProdutos.has(prod.id)) {
        mapaProdutos.get(prod.id)!.qtd++;
      } else {
        mapaProdutos.set(prod.id, { produto: prod, qtd: 1 });
      }
    }

    for (const [id, dados] of mapaProdutos) {
      const item = new ItemVenda(
        uuidv4(),
        id,
        dados.qtd,
        dados.produto.nome,
        dados.produto.precoVendaEmCentavos,
        dados.produto.precoVendaEmCentavos * dados.qtd
      );
      itensProcessados.push(item);
      totalFinalEmCentavos += item.precoTotalPagoEmCentavos;
    }

    return { itensProcessados, totalFinalEmCentavos };
  }
}