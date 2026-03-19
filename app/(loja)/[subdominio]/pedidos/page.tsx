'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  XCircle,
  Truck,
  Loader2,
  ArrowLeft,
  Search,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { buscarPedidosCliente } from '@/lib/server/actions/checkout';
import { formatCurrency } from '@/lib/utils/formatters';

interface Pedido {
  id: number;
  codigo: string;
  cliente_nome: string;
  whatsapp: string;
  v_pedido: number;
  forma_pagamento: string;
  forma_entrega: string;
  status: number;
  data: string;
}

// Loading fallback
function PedidosLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}

// Componente principal
function PedidosContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const subdominio = params.subdominio as string;
  const telefoneParam = searchParams.get('telefone');
  
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [telefone, setTelefone] = useState(telefoneParam || '');
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    if (telefoneParam) {
      carregarPedidos(telefoneParam);
    } else {
      setLoading(false);
    }
  }, [telefoneParam]);

  const carregarPedidos = async (tel: string) => {
    setLoading(true);
    try {
      const result = await buscarPedidosCliente(tel);
      if (result.success && result.pedidos) {
        setPedidos(result.pedidos as Pedido[]);
      } else {
        toast.error(result.error || 'Erro ao buscar pedidos');
      }
    } catch {
      toast.error('Erro ao buscar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = async () => {
    if (!telefone.trim()) {
      toast.error('Digite um telefone');
      return;
    }
    setBuscando(true);
    await carregarPedidos(telefone);
    setBuscando(false);
  };

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 1: return <Clock className="w-5 h-5 text-yellow-600" />;
      case 2: return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 3: return <Truck className="w-5 h-5 text-orange-600" />;
      case 4: return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 5: return <CheckCircle className="w-5 h-5 text-gray-600" />;
      case 6: return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 1: return 'Pendente';
      case 2: return 'Aceito';
      case 3: return 'Em Preparo';
      case 4: return 'Pronto';
      case 5: return 'Entregue';
      case 6: return 'Cancelado';
      default: return 'Pendente';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: return 'bg-yellow-100 text-yellow-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-orange-100 text-orange-800';
      case 4: return 'bg-green-100 text-green-800';
      case 5: return 'bg-gray-100 text-gray-800';
      case 6: return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getFormaPagamentoText = (forma: string) => {
    switch (forma) {
      case 'dinheiro': return 'Dinheiro';
      case 'cartao': return 'Cartão';
      case 'pix': return 'PIX';
      case 'mercadopago': return 'Mercado Pago';
      case 'pagseguro': return 'PagSeguro';
      default: return forma;
    }
  };

  const getFormaEntregaText = (forma: string) => {
    switch (forma) {
      case 'delivery': return 'Delivery';
      case 'retirada': return 'Retirada';
      case 'mesa': return 'Na Mesa';
      default: return forma;
    }
  };

  // Se não tiver telefone, mostrar formulário de busca
  if (!telefoneParam && pedidos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-md">
          <Link 
            href={`/${subdominio}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para a Loja
          </Link>

          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  Meus Pedidos
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Digite seu telefone para ver seus pedidos
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="(00) 00000-0000"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleBuscar}
                  disabled={buscando}
                >
                  {buscando ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Buscar Pedidos
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link 
            href={`/${subdominio}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Link>
          <h1 className="text-xl font-bold text-gray-900 ml-auto">
            Meus Pedidos
          </h1>
        </div>

        {/* Buscar outro telefone */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Buscar por outro telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
              />
              <Button 
                onClick={handleBuscar}
                disabled={buscando}
                variant="outline"
              >
                {buscando ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Pedidos */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : pedidos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum pedido encontrado
              </h2>
              <p className="text-gray-500 mb-6">
                Não encontramos pedidos para este telefone
              </p>
              <Link href={`/${subdominio}`}>
                <Button>
                  Fazer um Pedido
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <Card key={pedido.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Header do pedido */}
                  <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Pedido #{pedido.codigo}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(pedido.data).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pedido.status)}`}>
                      {getStatusIcon(pedido.status)}
                      <span>{getStatusText(pedido.status)}</span>
                    </div>
                  </div>

                  {/* Detalhes */}
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Forma de Entrega</span>
                      <span className="font-medium">{getFormaEntregaText(pedido.forma_entrega)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Forma de Pagamento</span>
                      <span className="font-medium">{getFormaPagamentoText(pedido.forma_pagamento)}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span className="text-gray-900 font-medium">Total</span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(pedido.v_pedido)}
                      </span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="p-4 border-t bg-gray-50">
                    <Link href={`/${subdominio}/pedidos/${pedido.id}`}>
                      <Button variant="outline" className="w-full">
                        Ver Detalhes
                      </Button>
                    </Link>
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

// Página principal com Suspense
export default function PedidosPage() {
  return (
    <Suspense fallback={<PedidosLoading />}>
      <PedidosContent />
    </Suspense>
  );
}
