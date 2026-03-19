import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  produto_id: number;
  nome: string;
  valor: number;
  quantidade: number;
  imagem?: string;
  variacao_id?: number;
  variacao_nome?: string;
}

interface CartStore {
  items: CartItem[];
  estabelecimentoId: number | null;
  estabelecimentoSubdominio: string | null;
  addItem: (item: CartItem, estabelecimentoId: number, estabelecimentoSubdominio: string) => void;
  removeItem: (produto_id: number) => void;
  updateQuantity: (produto_id: number, quantidade: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getItems: () => CartItem[];
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      estabelecimentoId: null,
      estabelecimentoSubdominio: null,

      addItem: (item, estabelecimentoId, estabelecimentoSubdominio) => {
        const { items, estabelecimentoId: currentEstId } = get();

        // Verificar se é do mesmo estabelecimento
        if (currentEstId && currentEstId !== estabelecimentoId) {
          // Limpar carrinho se mudar de loja
          set({
            items: [item],
            estabelecimentoId,
            estabelecimentoSubdominio,
          });
          return;
        }

        const existingItem = items.find(
          (i) =>
            i.produto_id === item.produto_id &&
            i.variacao_id === item.variacao_id
        );

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.produto_id === item.produto_id &&
              i.variacao_id === item.variacao_id
                ? { ...i, quantidade: i.quantidade + item.quantidade }
                : i
            ),
            estabelecimentoId,
            estabelecimentoSubdominio,
          });
        } else {
          set({
            items: [...items, item],
            estabelecimentoId,
            estabelecimentoSubdominio,
          });
        }
      },

      removeItem: (produto_id) => {
        set({
          items: get().items.filter((i) => i.produto_id !== produto_id),
        });
      },

      updateQuantity: (produto_id, quantidade) => {
        if (quantidade <= 0) {
          get().removeItem(produto_id);
          return;
        }

        set({
          items: get().items.map((i) =>
            i.produto_id === produto_id ? { ...i, quantidade } : i
          ),
        });
      },

      clearCart: () =>
        set({
          items: [],
          estabelecimentoId: null,
          estabelecimentoSubdominio: null,
        }),

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.valor * item.quantidade,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantidade, 0);
      },

      getItems: () => get().items,
    }),
    {
      name: 'cart-storage',
    }
  )
);
