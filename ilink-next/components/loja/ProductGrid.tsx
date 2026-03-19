'use client';

import Image from 'next/image';
import { Produto, Estabelecimento } from '@/types/models';
import { formatCurrency } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/button';
import { Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

interface ProductGridProps {
  produtos: Produto[];
  estabelecimento: Estabelecimento;
}

export function ProductGrid({ produtos, estabelecimento }: ProductGridProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (produto: Produto) => {
    addItem(
      {
        produto_id: produto.id,
        nome: produto.nome,
        valor: produto.valor_promocional || produto.valor,
        quantidade: 1,
        imagem: produto.imagem,
      },
      estabelecimento.id,
      estabelecimento.subdominio
    );
    toast.success(`${produto.nome} adicionado ao carrinho`);
  };

  if (produtos.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">
          Nenhum produto encontrado
        </h3>
        <p className="text-gray-500 mt-2">
          Volte mais tarde para conferir novidades
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {produtos.map((produto) => (
        <ProductCard
          key={produto.id}
          produto={produto}
          onAddToCart={() => handleAddToCart(produto)}
          cor={estabelecimento.cor}
        />
      ))}
    </div>
  );
}

interface ProductCardProps {
  produto: Produto;
  onAddToCart: () => void;
  cor?: string;
}

function ProductCard({ produto, onAddToCart, cor }: ProductCardProps) {
  const valorOriginal = produto.valor;
  const valorPromocional = produto.valor_promocional;
  const temPromocao = valorPromocional && valorPromocional < valorOriginal;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Imagem */}
      <div className="relative aspect-square bg-gray-100">
        {produto.imagem ? (
          <Image
            src={produto.imagem}
            alt={produto.nome}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {produto.destaque && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
            Destaque
          </span>
        )}
        
        {temPromocao && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Promo
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 line-clamp-2">
          {produto.nome}
        </h3>
        
        {produto.descricao && (
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
            {produto.descricao}
          </p>
        )}

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold" style={{ color: cor || '#3b82f6' }}>
            {formatCurrency(valorPromocional || valorOriginal)}
          </span>
          {temPromocao && (
            <span className="text-sm text-gray-400 line-through">
              {formatCurrency(valorOriginal)}
            </span>
          )}
        </div>

        <Button
          onClick={onAddToCart}
          className="w-full mt-3"
          size="sm"
          style={{ backgroundColor: cor || '#3b82f6' }}
        >
          <Plus className="w-4 h-4 mr-1" />
          Adicionar
        </Button>
      </div>
    </div>
  );
}
