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

export interface CartState {
  items: CartItem[];
  totalItens: number;
  totalEmCentavos: number;
}

export interface CartActions {
  addItem: (product: ProductToAdd) => void;
  decrementItem: (produtoId: string) => void;
  removeItem: (produtoId: string) => void;
  // [NOVO] Ação para editar o preço manualmente
  updateItemPrice: (produtoId: string, newPriceInCentavos: number) => void;
  clearCart: () => void;
}

const initialState: CartState = {
  items: [],
  totalItens: 0,
  totalEmCentavos: 0,
};

const calculateTotals = (items: CartItem[]): Pick<CartState, 'totalItens' | 'totalEmCentavos'> => {
  const totalItens = items.reduce((sum, item) => sum + item.quantidade, 0);
  const totalEmCentavos = items.reduce(
    (sum, item) => sum + item.precoVendaEmCentavos * item.quantidade,
    0,
  );
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
        const totals = calculateTotals(state.items);
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
          const totals = calculateTotals(state.items);
          state.totalItens = totals.totalItens;
          state.totalEmCentavos = totals.totalEmCentavos;
        }
      }),

    removeItem: (produtoId) =>
      set((state) => {
        state.items = state.items.filter(
          (item) => item.produtoId !== produtoId,
        );
        const totals = calculateTotals(state.items);
        state.totalItens = totals.totalItens;
        state.totalEmCentavos = totals.totalEmCentavos;
      }),

    // [NOVO] Implementação da edição de preço
    updateItemPrice: (produtoId, newPrice) => 
      set((state) => {
        const item = state.items.find((i) => i.produtoId === produtoId);
        if (item) {
          item.precoVendaEmCentavos = newPrice;
        }
        const totals = calculateTotals(state.items);
        state.totalItens = totals.totalItens;
        state.totalEmCentavos = totals.totalEmCentavos;
      }),

    clearCart: () => set(initialState),
  })),
);