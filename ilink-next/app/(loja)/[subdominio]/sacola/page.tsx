'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ShoppingBag, Minus, Plus, Trash2, ArrowLeft, Tag, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { aplicarCupom, ItemSacola } from '@/lib/server/actions/sacola';

export default function SacolaPage() {
  const params = useParams();
  const router = useRouter();
  const subdominio = params.subdominio as string;
  
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getTotal, 
    getItemCount, 
    clearCart,
    estabelecimentoId,
    estabelecimentoSubdominio 
  } = useCartStore();
  
  const [cupomCode, setCupomCode] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState<{ codigo: string; desconto: number; tipo: string; valor: number } | null>(null);
  const [loadingCupom, setLoadingCupom] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Verificar se é o mesmo estabelecimento
  useEffect(() => {
    if (mounted && estabelecimentoSubdominio && estabelecimentoSubdominio !== subdominio) {
      toast.error('Você tem itens de outra loja na sacola. A sacola será limpa.');
      clearCart();
    }
  }, [mounted, estabelecimentoSubdominio, subdominio, clearCart]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Redirecionar se sacola vazia
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Link 
            href={`/${subdominio}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a loja
          </Link>
          
          <Card className="max-w-md mx-auto text-center py-12">
            <CardContent>
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Sua sacola está vazia
              </h2>
              <p className="text-gray-500 mb-6">
                Adicione produtos para fazer um pedido
              </p>
              <Link href={`/${subdominio}`}>
                <Button className="w-full">
                  Continuar Comprando
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const subtotal = getTotal();
  const desconto = cupomAplicado?.desconto || 0;
  const total = subtotal - desconto;

  const handleAplicarCupom = async () => {
    if (!cupomCode.trim()) {
      toast.error('Digite um código de cupom');
      return;
    }

    if (!estabelecimentoId) {
      toast.error('Erro ao identificar estabelecimento');
      return;
    }

    setLoadingCupom(true);
    try {
      const result = await aplicarCupom(cupomCode, estabelecimentoId, subtotal);
      if (result.success && result.cupom) {
        setCupomAplicado(result.cupom);
        toast.success(`Cupom ${result.cupom.codigo} aplicado!`);
      } else {
        toast.error(result.error || 'Erro ao aplicar cupom');
      }
    } catch {
      toast.error('Erro ao aplicar cupom');
    } finally {
      setLoadingCupom(false);
    }
  };

  const handleRemoverCupom = () => {
    setCupomAplicado(null);
    setCupomCode('');
    toast.success('Cupom removido');
  };

  const handleContinuar = () => {
    // Salvar informações do cupom no localStorage para uso no checkout
    if (cupomAplicado) {
      localStorage.setItem('cupom_aplicado', JSON.stringify(cupomAplicado));
    }
    router.push(`/${subdominio}/checkout`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link 
            href={`/${subdominio}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Continuar comprando</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 ml-auto flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Minha Sacola
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Produtos */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">
                  Produtos ({getItemCount()})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div 
                    key={`${item.produto_id}-${item.variacao_id || ''}`}
                    className="flex gap-4 py-4 border-b last:border-0"
                  >
                    {/* Imagem */}
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.imagem ? (
                        <Image
                          src={item.imagem}
                          alt={item.nome}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.nome}
                      </h3>
                      {item.variacao_nome && (
                        <p className="text-sm text-gray-500">
                          {item.variacao_nome}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        {formatCurrency(item.valor)} un.
                      </p>
                    </div>

                    {/* Controles */}
                    <div className="flex flex-col items-end gap-2">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.valor * item.quantidade)}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.produto_id, item.quantidade - 1)}
                          className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantidade}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.produto_id, item.quantidade + 1)}
                          className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.produto_id)}
                        className="text-red-500 hover:text-red-700 text-sm flex items-center mt-1"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Cupom de Desconto */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Cupom de Desconto
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cupomAplicado ? (
                  <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800">
                        Cupom {cupomAplicado.codigo} aplicado!
                      </p>
                      <p className="text-sm text-green-600">
                        Desconto: {formatCurrency(cupomAplicado.desconto)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoverCupom}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remover
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite o código do cupom"
                      value={cupomCode}
                      onChange={(e) => setCupomCode(e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && handleAplicarCupom()}
                    />
                    <Button
                      onClick={handleAplicarCupom}
                      disabled={loadingCupom}
                      variant="outline"
                    >
                      {loadingCupom ? 'Aplicando...' : 'Aplicar'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                
                {desconto > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Desconto</span>
                    <span className="text-green-600">-{formatCurrency(desconto)}</span>
                  </div>
                )}

                <hr className="border-gray-200" />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                {desconto > 0 && (
                  <p className="text-xs text-green-600 bg-green-50 p-2 rounded flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Você economizou {formatCurrency(desconto)}
                  </p>
                )}

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleContinuar}
                >
                  Continuar para Checkout
                </Button>

                <Button 
                  variant="ghost" 
                  className="w-full text-gray-500"
                  onClick={clearCart}
                >
                  Limpar Sacola
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
