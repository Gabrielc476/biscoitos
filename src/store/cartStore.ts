// src/store/cartStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface ProductToAdd {
  id: string;
  nome: string;
  precoVendaEmCentavos: number;
}

export interface CartItem {
  produtoId: string;
  nome: string;
  precoVendaEmCentavos: number;
  quantidade: number;
}

export interface ActivePromotions {
  family: boolean; // Amigos e Família (5,90 -> 4,60 / 2 por 8,00)
  special: boolean; // 2 Especiais (6,50 -> 2 por 12,00)
}

export interface CartState {
  items: CartItem[];
  totalItens: number;
  totalEmCentavos: number;
  activePromotions: ActivePromotions; // [NOVO]
}

export interface CartActions {
  addItem: (product: ProductToAdd) => void;
  decrementItem: (produtoId: string) => void;
  removeItem: (produtoId: string) => void;
  updateItemPrice: (produtoId: string, newPriceInCentavos: number) => void;
  togglePromotion: (promoType: keyof ActivePromotions) => void; // [NOVO]
  clearCart: () => void;
}

const initialState: CartState = {
  items: [],
  totalItens: 0,
  totalEmCentavos: 0,
  activePromotions: {
    family: false,
    special: false,
  },
};

const calculateTotals = (
  items: CartItem[],
  promotions: ActivePromotions
): Pick<CartState, 'totalItens' | 'totalEmCentavos'> => {
  const totalItens = items.reduce((sum, item) => sum + item.quantidade, 0);

  let totalEmCentavos = 0;

  // Agrupa itens por preço para aplicar promoções em lote (se necessário)
  // Mas aqui a regra é por item específico (preço base).

  // Vamos iterar e somar, mas precisamos agrupar quantidades de itens elegíveis primeiro?
  // A regra "2 por X" geralmente se aplica a QUALQUER item daquele preço.
  // Ex: 1 Biscoito A (5.90) + 1 Biscoito B (5.90) = 2 itens = R$ 8.00.
  // Então precisamos contar o total de itens elegíveis para cada promoção.

  let qtdFamily = 0;
  let qtdSpecial = 0;

  // 1. Conta quantidades elegíveis
  for (const item of items) {
    if (promotions.family && item.precoVendaEmCentavos === 590) {
      qtdFamily += item.quantidade;
    } else if (promotions.special && item.precoVendaEmCentavos === 650) {
      qtdSpecial += item.quantidade;
    } else {
      // Itens sem promoção ou não elegíveis somam normalmente
      totalEmCentavos += item.precoVendaEmCentavos * item.quantidade;
    }
  }

  // 2. Aplica regra "Amigos e Família" (590)
  if (qtdFamily > 0) {
    const pairs = Math.floor(qtdFamily / 2);
    const remainder = qtdFamily % 2;
    // 2 por 8.00 (800), avulso 4.60 (460)
    totalEmCentavos += (pairs * 800) + (remainder * 460);
  }

  // 3. Aplica regra "2 Especiais" (650)
  if (qtdSpecial > 0) {
    const pairs = Math.floor(qtdSpecial / 2);
    const remainder = qtdSpecial % 2;
    // 2 por 12.00 (1200), avulso preço normal (650)
    totalEmCentavos += (pairs * 1200) + (remainder * 650);
  }

  return { totalItens, totalEmCentavos };
};

export const useCartStore = create<CartState & CartActions>()(
  immer((set) => ({
    ...initialState,

    addItem: (product) =>
      set((state) => {
        const existingItem = state.items.find(
          (item) => item.produtoId === product.id,
        );
        if (existingItem) {
          existingItem.quantidade += 1;
        } else {
          state.items.push({
            produtoId: product.id,
            nome: product.nome,
            precoVendaEmCentavos: product.precoVendaEmCentavos,
            quantidade: 1,
          });
        }
        const totals = calculateTotals(state.items, state.activePromotions);
        state.totalItens = totals.totalItens;
        state.totalEmCentavos = totals.totalEmCentavos;
      }),

    decrementItem: (produtoId) =>
      set((state) => {
        const itemIndex = state.items.findIndex(
          (item) => item.produtoId === produtoId,
        );
        if (itemIndex > -1) {
          const item = state.items[itemIndex];
          item.quantidade -= 1;
          if (item.quantidade <= 0) {
            state.items.splice(itemIndex, 1);
          }
          const totals = calculateTotals(state.items, state.activePromotions);
          state.totalItens = totals.totalItens;
          state.totalEmCentavos = totals.totalEmCentavos;
        }
      }),

    removeItem: (produtoId) =>
      set((state) => {
        state.items = state.items.filter(
          (item) => item.produtoId !== produtoId,
        );
        const totals = calculateTotals(state.items, state.activePromotions);
        state.totalItens = totals.totalItens;
        state.totalEmCentavos = totals.totalEmCentavos;
      }),

    updateItemPrice: (produtoId, newPrice) =>
      set((state) => {
        const item = state.items.find((i) => i.produtoId === produtoId);
        if (item) {
          item.precoVendaEmCentavos = newPrice;
        }
        const totals = calculateTotals(state.items, state.activePromotions);
        state.totalItens = totals.totalItens;
        state.totalEmCentavos = totals.totalEmCentavos;
      }),

    togglePromotion: (promoType) =>
      set((state) => {
        state.activePromotions[promoType] = !state.activePromotions[promoType];
        const totals = calculateTotals(state.items, state.activePromotions);
        state.totalItens = totals.totalItens;
        state.totalEmCentavos = totals.totalEmCentavos;
      }),

    clearCart: () => set(initialState),
  })),
);