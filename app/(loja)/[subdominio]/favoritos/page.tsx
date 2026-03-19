'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Heart,
  ShoppingBag,
  Trash2,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils/formatters';
import { createClient } from '@/lib/supabase/client';

interface Produto {
  id: number;
  nome: string;
  valor: number;
  valor_promocional?: number;
  imagem?: string;
  estoque: number;
  rel_estabelecimentos_id: number;
}

interface Estabelecimento {
  id: number;
  nome: string;
  subdominio: string;
  cor: string;
}

export default function FavoritosPage() {
  const params = useParams();
  const subdominio = params.subdominio as string;
  
  const [favoritos, setFavoritos] = useState<Produto[]>([]);
  const [estabelecimento, setEstabelecimento] = useState<Estabelecimento | null>(null);
  const [loading, setLoading] = useState(true);
  const [removendo, setRemovendo] = useState<number | null>(null);

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
          
          // Buscar favoritos do localStorage (simulado)
          const favoritosSalvos = localStorage.getItem(`favoritos_${estData.id}`);
          if (favoritosSalvos) {
            const ids = JSON.parse(favoritosSalvos);
            // Buscar produtos
            const { data: produtos } = await supabase
              .from('produtos')
              .select('*')
              .in('id', ids)
              .eq('visible', true)
              .eq('status', 1);
            
            setFavoritos((produtos as Produto[]) || []);
          }
        }
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [subdominio]);

  const handleRemover = async (produtoId: number) => {
    setRemovendo(produtoId);
    
    // Simular remoção
    setTimeout(() => {
      setFavoritos(favoritos.filter(f => f.id !== produtoId));
      toast.success('Removido dos favoritos');
      setRemovendo(null);
    }, 500);
  };

  const handleAdicionarSacola = (produto: Produto) => {
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
            <h1 className="text-xl font-bold text-gray-900">Meus Favoritos</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {favoritos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum favorito ainda
              </h2>
              <p className="text-gray-500 mb-6">
                Adicione produtos aos seus favoritos para encontrá-los facilmente
              </p>
              <Link href={`/${subdominio}`}>
                <Button style={{ backgroundColor: estabelecimento?.cor || '#3b82f6' }}>
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Explorar Produtos
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoritos.map((produto) => (
              <Card key={produto.id} className="overflow-hidden group">
                <Link href={`/${subdominio}/produto/${produto.id}`}>
                  <div className="aspect-video relative bg-gray-100 overflow-hidden">
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
                
                <CardContent className="p-4">
                  <Link href={`/${subdominio}/produto/${produto.id}`}>
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {produto.nome}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(produto.valor_promocional || produto.valor)}
                    </span>
                    {produto.valor_promocional && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatCurrency(produto.valor)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      style={{ backgroundColor: estabelecimento?.cor || '#3b82f6' }}
                      onClick={() => handleAdicionarSacola(produto)}
                      disabled={produto.estoque === 0}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      {produto.estoque === 0 ? 'Esgotado' : 'Adicionar'}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemover(produto.id)}
                      disabled={removendo === produto.id}
                    >
                      {removendo === produto.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-red-500" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
