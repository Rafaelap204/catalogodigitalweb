'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Phone,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { buscarPedidoCheckout } from '@/lib/server/actions/checkout';
import { formatCurrency } from '@/lib/utils/formatters';

interface Pedido {
  id: number;
  codigo: string;
  cliente_nome: string;
  whatsapp: string;
  v_pedido: number;
  valor_frete: number;
  valor_desconto: number;
  forma_pagamento: string;
  forma_entrega: string;
  status: number;
  endereco?: string;
  numero?: string;
  bairro?: string;
  mesa?: string;
  data: string;
  itens?: Array<{
    id: number;
    produto_nome: string;
    quantidade: number;
    valor_unitario: number;
    valor_total: number;
  }>;
}

// Loading fallback
function ObrigadoLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}

// Componente principal
function ObrigadoContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const subdominio = params.subdominio as string;
  const pedidoId = searchParams.get('pedido');
  
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarPedido = async () => {
      if (!pedidoId) {
        setError('Pedido não encontrado');
        setLoading(false);
        return;
      }

      try {
        const result = await buscarPedidoCheckout(pedidoId);
        if (result.success && result.pedido) {
          setPedido(result.pedido as unknown as Pedido);
        } else {
          setError(result.error || 'Erro ao carregar pedido');
        }
      } catch {
        setError('Erro ao carregar pedido');
      } finally {
        setLoading(false);
      }
    };

    carregarPedido();
  }, [pedidoId]);

  if (loading) {
    return <ObrigadoLoading />;
  }

  if (error || !pedido) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Pedido não encontrado
            </h1>
            <p className="text-gray-500 mb-6">
              {error || 'Não foi possível encontrar os detalhes do seu pedido.'}
            </p>
            <Link href={`/${subdominio}`}>
              <Button className="w-full">
                Voltar para a Loja
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusText = (status: number) => {
    switch (status) {
      case 1: return { text: 'Pendente', color: 'bg-yellow-100 text-yellow-800' };
      case 2: return { text: 'Aceito', color: 'bg-blue-100 text-blue-800' };
      case 3: return { text: 'Em Preparo', color: 'bg-orange-100 text-orange-800' };
      case 4: return { text: 'Pronto', color: 'bg-green-100 text-green-800' };
      case 5: return { text: 'Entregue', color: 'bg-gray-100 text-gray-800' };
      case 6: return { text: 'Cancelado', color: 'bg-red-100 text-red-800' };
      default: return { text: 'Pendente', color: 'bg-yellow-100 text-yellow-800' };
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
      case 'retirada': return 'Retirada no Local';
      case 'mesa': return 'Servir na Mesa';
      default: return forma;
    }
  };

  const status = getStatusText(pedido.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header com sucesso */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pedido Recebido!
          </h1>
          <p className="text-gray-600">
            Obrigado pela sua compra. Seu pedido foi recebido com sucesso.
          </p>
        </div>

        {/* Card do Pedido */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {/* Código e Status */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b">
              <div>
                <p className="text-sm text-gray-500 mb-1">Número do Pedido</p>
                <p className="text-2xl font-bold text-gray-900">#{pedido.codigo}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                {status.text}
              </span>
            </div>

            {/* Detalhes */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Data do Pedido</p>
                  <p className="font-medium">
                    {new Date(pedido.data).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Forma de Pagamento</p>
                  <p className="font-medium">{getFormaPagamentoText(pedido.forma_pagamento)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Forma de Entrega</p>
                  <p className="font-medium">{getFormaEntregaText(pedido.forma_entrega)}</p>
                  {pedido.forma_entrega === 'delivery' && pedido.endereco && (
                    <p className="text-sm text-gray-600 mt-1">
                      {pedido.endereco}{pedido.numero ? `, ${pedido.numero}` : ''}
                      {pedido.bairro ? ` - ${pedido.bairro}` : ''}
                    </p>
                  )}
                  {pedido.forma_entrega === 'mesa' && pedido.mesa && (
                    <p className="text-sm text-gray-600 mt-1">
                      Mesa {pedido.mesa}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Itens do Pedido */}
            <div className="border-t pt-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Itens do Pedido</h3>
              <div className="space-y-3">
                {pedido.itens?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantidade}x {item.produto_nome}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(item.valor_total)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totais */}
            <div className="border-t pt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatCurrency(pedido.v_pedido - pedido.valor_frete + (pedido.valor_desconto || 0))}</span>
              </div>
              {pedido.valor_frete > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frete</span>
                  <span>{formatCurrency(pedido.valor_frete)}</span>
                </div>
              )}
              {(pedido.valor_desconto || 0) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Desconto</span>
                  <span className="text-green-600">-{formatCurrency(pedido.valor_desconto)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(pedido.v_pedido)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações adicionais */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              E agora?
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                Seu pedido foi enviado para o estabelecimento
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                Você receberá atualizações pelo WhatsApp
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                O estabelecimento irá confirmar seu pedido em breve
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Botões */}
        <div className="space-y-3">
          <Link href={`/${subdominio}`}>
            <Button className="w-full" size="lg">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Continuar Comprando
            </Button>
          </Link>
          
          <Link href={`/${subdominio}/pedidos?telefone=${encodeURIComponent(pedido.whatsapp)}`}>
            <Button variant="outline" className="w-full" size="lg">
              Meus Pedidos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Página principal com Suspense
export default function ObrigadoPage() {
  return (
    <Suspense fallback={<ObrigadoLoading />}>
      <ObrigadoContent />
    </Suspense>
  );
}
