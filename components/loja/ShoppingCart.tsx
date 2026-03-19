'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Estabelecimento } from '@/types/models';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShoppingCartProps {
  estabelecimento: Estabelecimento;
}

export function ShoppingCart({ estabelecimento }: ShoppingCartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { items, updateQuantity, removeItem, getTotal, getItemCount, clearCart } = useCartStore();
  const itemCount = getItemCount();
  const total = getTotal();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Seu carrinho está vazio');
      return;
    }
    setIsOpen(false);
  };

  if (itemCount === 0) {
    return null;
  }

  return (
    <>
      {/* Floating Cart Button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button
            className="fixed bottom-6 right-6 z-40 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
            style={{ backgroundColor: estabelecimento.cor || '#3b82f6' }}
          >
            <div className="relative">
              <ShoppingBag className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
          </button>
        </SheetTrigger>
        
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Seu Carrinho ({itemCount})
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 flex flex-col h-[calc(100vh-200px)]">
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {items.map((item) => (
                <div
                  key={item.produto_id}
                  className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.nome}</h4>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(item.valor)} x {item.quantidade}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.produto_id, item.quantidade - 1)}
                      className="w-8 h-8 rounded-full bg-white border flex items-center justify-center hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantidade}</span>
                    <button
                      onClick={() => updateQuantity(item.produto_id, item.quantidade + 1)}
                      className="w-8 h-8 rounded-full bg-white border flex items-center justify-center hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.produto_id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            {/* Cart Footer */}
            <div className="border-t pt-4 mt-4 space-y-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              
              <Link
                href={`/loja/${estabelecimento.subdominio}/sacola`}
                onClick={handleCheckout}
              >
                <Button
                  className="w-full"
                  size="lg"
                  style={{ backgroundColor: estabelecimento.cor || '#3b82f6' }}
                >
                  Finalizar Pedido
                </Button>
              </Link>
              
              <Button
                variant="ghost"
                className="w-full text-gray-500"
                onClick={clearCart}
              >
                Limpar Carrinho
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
