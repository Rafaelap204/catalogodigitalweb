'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Minus, 
  Plus, 
  ShoppingBag,
  Heart,
  Share2,
  Truck,
  Store,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils/formatters';
import { createClient } from '@/lib/supabase/client';

interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  valor: number;
  valor_promocional?: number;
  imagem?: string;
  estoque: number;
  rel_estabelecimentos_id: number;
  rel_categorias_id: number;
}

interface Estabelecimento {
  id: number;
  nome: string;
  subdominio: string;
  cor: string;
}

export default function ProdutoPage() {
  const params = useParams();
  const router = useRouter();
  const subdominio = params.subdominio as string;
  const produtoId = params.id as string;
  
  const { addItem, estabelecimentoId: cartEstId, estabelecimentoSubdominio } = useCartStore();
  
  const [produto, setProduto] = useState<Produto | null>(null);
  const [estabelecimento, setEstabelecimento] = useState<Estabelecimento | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantidade, setQuantidade] = useState(1);
  const [adicionando, setAdicionando] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const supabase = createClient();

        // Buscar estabelecimento
        const { data: estDataRaw } = await supabase
          .from('estabelecimentos')
          .select('id, nome, subdominio, cor')
          .eq('subdominio', subdominio)
          .single();

        if (!estDataRaw) {
          router.push('/');
          return;
        }

        const estData = estDataRaw as unknown as Estabelecimento;
        setEstabelecimento(estData);

        // Buscar produto
        const { data: prodData } = await supabase
          .from('produtos')
          .select('*')
          .eq('id', produtoId)
          .eq('rel_estabelecimentos_id', estData.id)
          .eq('visible', true)
          .eq('status', 1)
          .single();

        if (!prodData) {
          router.push(`/${subdominio}`);
          return;
        }

        setProduto(prodData as Produto);
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
        toast.error('Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [subdominio, produtoId, router]);

  const handleAdicionar = async () => {
    if (!produto || !estabelecimento) return;

    // Verificar se está adicionando de outro estabelecimento
    if (cartEstId && cartEstId !== estabelecimento.id) {
      const confirmar = window.confirm(
        'Você tem itens de outra loja na sacola. Deseja limpar e adicionar este produto?'
      );
      if (!confirmar) return;
    }

    setAdicionando(true);

    addItem(
      {
        produto_id: produto.id,
        nome: produto.nome,
        valor: produto.valor_promocional || produto.valor,
        quantidade,
        imagem: produto.imagem,
      },
      estabelecimento.id,
      estabelecimento.subdominio
    );

    toast.success(`${produto.nome} adicionado à sacola!`, {
      action: {
        label: 'Ver Sacola',
        onClick: () => router.push(`/${subdominio}/sacola`),
      },
    });

    setAdicionando(false);
  };

  const valorAtual = produto?.valor_promocional || produto?.valor || 0;
  const valorOriginal = produto?.valor || 0;
  const temPromocao = produto?.valor_promocional && produto.valor_promocional < produto.valor;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!produto || !estabelecimento) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link 
            href={`/${subdominio}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Voltar</span>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900 ml-4 truncate">
            {produto.nome}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Imagem */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="aspect-square relative bg-gray-100">
              {produto.imagem ? (
                <Image
                  src={produto.imagem}
                  alt={produto.nome}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-24 h-24 text-gray-300" />
                </div>
              )}
              
              {temPromocao && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  PROMOÇÃO
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {produto.nome}
              </h1>
              
              {produto.descricao && (
                <p className="text-gray-600 leading-relaxed">
                  {produto.descricao}
                </p>
              )}
            </div>

            {/* Preço */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(valorAtual)}
                </span>
                {temPromocao && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatCurrency(valorOriginal)}
                  </span>
                )}
              </div>
              
              {temPromocao && (
                <p className="text-sm text-green-600 mt-1">
                  Economize {formatCurrency(valorOriginal - valorAtual)}
                </p>
              )}
            </div>

            {/* Quantidade */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quantidade
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                  className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-semibold w-12 text-center">
                  {quantidade}
                </span>
                <button
                  onClick={() => setQuantidade(Math.min(produto.estoque, quantidade + 1))}
                  className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-50"
                  disabled={quantidade >= produto.estoque}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {produto.estoque} unidades disponíveis
              </p>
            </div>

            {/* Ações */}
            <div className="space-y-3">
              <Button
                className="w-full py-6 text-lg"
                style={{ backgroundColor: estabelecimento.cor }}
                onClick={handleAdicionar}
                disabled={adicionando || produto.estoque === 0}
              >
                {adicionando ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2" />
                    Adicionando...
                  </>
                ) : produto.estoque === 0 ? (
                  'Produto Indisponível'
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Adicionar à Sacola
                  </>
                )}
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Heart className="w-5 h-5 mr-2" />
                  Favoritar
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="w-5 h-5 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>

            {/* Info de entrega */}
            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Delivery disponível</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Store className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Retirada no local disponível</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">Pedido mínimo pode ser aplicado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão flutuante mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:hidden">
        <Button
          className="w-full"
          style={{ backgroundColor: estabelecimento.cor }}
          onClick={handleAdicionar}
          disabled={adicionando || produto.estoque === 0}
        >
          {adicionando ? (
            'Adicionando...'
          ) : produto.estoque === 0 ? (
            'Indisponível'
          ) : (
            <>
              Adicionar - {formatCurrency(valorAtual * quantidade)}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
