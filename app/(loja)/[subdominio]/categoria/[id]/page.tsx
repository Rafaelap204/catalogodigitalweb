'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
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

interface Categoria {
  id: number;
  nome: string;
  rel_estabelecimentos_id: number;
}

interface Estabelecimento {
  id: number;
  nome: string;
  subdominio: string;
  cor: string;
}

export default function CategoriaPage() {
  const params = useParams();
  const router = useRouter();
  const subdominio = params.subdominio as string;
  const categoriaId = params.id as string;
  
  const { addItem } = useCartStore();
  
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [estabelecimento, setEstabelecimento] = useState<Estabelecimento | null>(null);
  const [loading, setLoading] = useState(true);

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

        // Buscar categoria
        const { data: catData } = await supabase
          .from('categorias')
          .select('*')
          .eq('id', categoriaId)
          .eq('rel_estabelecimentos_id', estData.id)
          .eq('visible', true)
          .eq('status', 1)
          .single();

        if (!catData) {
          router.push(`/${subdominio}`);
          return;
        }

        setCategoria(catData as Categoria);

        // Buscar produtos da categoria
        const { data: prodData } = await supabase
          .from('produtos')
          .select('*')
          .eq('rel_estabelecimentos_id', estData.id)
          .eq('rel_categorias_id', categoriaId)
          .eq('visible', true)
          .eq('status', 1)
          .order('posicao', { ascending: true });

        setProdutos((prodData as Produto[]) || []);
      } catch (error) {
        console.error('Erro:', error);
        toast.error('Erro ao carregar categoria');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [subdominio, categoriaId, router]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link 
              href={`/${subdominio}`}
              className="text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">
              {categoria?.nome}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {produtos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum produto nesta categoria
              </h2>
              <p className="text-gray-500 mb-6">
                Esta categoria ainda não possui produtos cadastrados
              </p>
              <Link href={`/${subdominio}`}>
                <Button style={{ backgroundColor: estabelecimento?.cor || '#3b82f6' }}>
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Ver Todos os Produtos
                </Button>
              </Link>
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
      </div>
    </div>
  );
}
