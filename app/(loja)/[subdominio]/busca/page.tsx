'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  ArrowLeft, 
  ShoppingBag,
  Loader2,
  Package
} from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils/formatters';
import { useCartStore } from '@/store/cartStore';

interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  valor: number;
  valor_promocional?: number;
  imagem?: string;
  estoque: number;
  rel_categorias_id: number;
}

interface Estabelecimento {
  id: number;
  nome: string;
  subdominio: string;
  cor: string;
}

// Loading fallback
function BuscaLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}

// Componente principal
function BuscaContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const subdominio = params.subdominio as string;
  const queryParam = searchParams.get('q') || '';
  
  const { addItem } = useCartStore();
  
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [estabelecimento, setEstabelecimento] = useState<Estabelecimento | null>(null);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState(queryParam);
  const [buscando, setBuscando] = useState(false);

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

        if (estDataRaw) {
          const estData = estDataRaw as unknown as Estabelecimento;
          setEstabelecimento(estData);

          // Se tiver query, buscar produtos
          if (queryParam) {
            await buscarProdutos(estData.id, queryParam);
          }
        }
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [subdominio, queryParam]);

  const buscarProdutos = async (estId: number, termo: string) => {
    setBuscando(true);
    try {
      const supabase = createClient();
      
      const { data } = await supabase
        .from('produtos')
        .select('*')
        .eq('rel_estabelecimentos_id', estId)
        .eq('visible', true)
        .eq('status', 1)
        .ilike('nome', `%${termo}%`)
        .order('nome', { ascending: true });

      setProdutos((data as Produto[]) || []);
    } catch (error) {
      console.error('Erro ao buscar:', error);
    } finally {
      setBuscando(false);
    }
  };

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!busca.trim() || !estabelecimento) return;
    
    // Atualizar URL
    const url = new URL(window.location.href);
    url.searchParams.set('q', busca);
    window.history.pushState({}, '', url);
    
    await buscarProdutos(estabelecimento.id, busca);
  };

  const handleAdicionar = (produto: Produto) => {
    if (!estabelecimento) return;
    
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
    
    toast.success(`${produto.nome} adicionado à sacola!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href={`/${subdominio}`}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            
            <form onSubmit={handleBuscar} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar produtos..."
                  className="pl-10"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Resultados */}
        {buscando ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : queryParam ? (
          <>
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900">
                Resultados para "{queryParam}"
              </h1>
              <p className="text-gray-500">
                {produtos.length} produto(s) encontrado(s)
              </p>
            </div>

            {produtos.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Nenhum produto encontrado
                  </h2>
                  <p className="text-gray-500 mb-6">
                    Tente buscar com outras palavras
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {produtos.map((produto) => (
                  <Card key={produto.id} className="overflow-hidden group">
                    <Link href={`/${subdominio}/produto/${produto.id}`}>
                      <div className="aspect-square relative bg-gray-100 overflow-hidden">
                        {produto.imagem ? (
                          <Image
                            src={produto.imagem}
                            alt={produto.nome}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-12 h-12 text-gray-300" />
                          </div>
                        )}
                        {produto.valor_promocional && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            PROMO
                          </div>
                        )}
                      </div>
                    </Link>
                    
                    <CardContent className="p-3">
                      <Link href={`/${subdominio}/produto/${produto.id}`}>
                        <h3 className="font-medium text-gray-900 line-clamp-2 text-sm mb-1">
                          {produto.nome}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-gray-900">
                          {formatCurrency(produto.valor_promocional || produto.valor)}
                        </span>
                        {produto.valor_promocional && (
                          <span className="text-xs text-gray-400 line-through">
                            {formatCurrency(produto.valor)}
                          </span>
                        )}
                      </div>
                      
                      <Button
                        size="sm"
                        className="w-full"
                        style={{ backgroundColor: estabelecimento?.cor || '#3b82f6' }}
                        onClick={() => handleAdicionar(produto)}
                        disabled={produto.estoque === 0}
                      >
                        {produto.estoque === 0 ? 'Esgotado' : 'Adicionar'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              O que você procura?
            </h2>
            <p className="text-gray-500">
              Digite o nome de um produto para buscar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Página principal com Suspense
export default function BuscaPage() {
  return (
    <Suspense fallback={<BuscaLoading />}>
      <BuscaContent />
    </Suspense>
  );
}
