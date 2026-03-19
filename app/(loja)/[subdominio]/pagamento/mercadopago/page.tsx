'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Loader2,
  ArrowLeft,
  ExternalLink,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { criarPreferenciaMercadoPago } from '@/lib/server/actions/pagamentos';
import { buscarPedidoCheckout } from '@/lib/server/actions/checkout';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils/formatters';

interface Pedido {
  id: number;
  codigo: string;
  cliente_nome: string;
  whatsapp: string;
  email: string;
  v_pedido: number;
  status: number;
  rel_estabelecimentos_id: number;
}

// Loading fallback
function MercadoPagoLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}

// Componente principal
function MercadoPagoContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const subdominio = params.subdominio as string;
  const pedidoId = searchParams.get('pedido');
  const status = searchParams.get('status');
  
  const { clearCart } = useCartStore();
  
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      if (!pedidoId) {
        router.push(`/${subdominio}`);
        return;
      }

      // Verificar se retornou de um pagamento
      if (status === 'approved') {
        clearCart();
        router.push(`/${subdominio}/obrigado?pedido=${pedidoId}`);
        return;
      }

      if (status === 'failure') {
        setError('O pagamento não foi concluído. Tente novamente.');
      }

      try {
        // Buscar dados do pedido
        const pedidoResult = await buscarPedidoCheckout(pedidoId);
        if (!pedidoResult.success || !pedidoResult.pedido) {
          toast.error('Pedido não encontrado');
          router.push(`/${subdominio}`);
          return;
        }

        const pedidoData = pedidoResult.pedido as unknown as Pedido;
        setPedido(pedidoData);

        // Criar preferência no Mercado Pago
        const mpResult = await criarPreferenciaMercadoPago({
          pedido_id: pedidoId,
          valor: pedidoData.v_pedido,
          descricao: `Pedido #${pedidoData.codigo}`,
          cliente_nome: pedidoData.cliente_nome,
          cliente_email: pedidoData.email || 'cliente@email.com',
          cliente_telefone: pedidoData.whatsapp,
          estabelecimento_id: pedidoData.rel_estabelecimentos_id,
        });

        if (mpResult.success && mpResult.init_point) {
          setPaymentUrl(mpResult.init_point);
        } else {
          setError(mpResult.error || 'Erro ao criar pagamento');
        }
      } catch (error) {
        console.error('Erro:', error);
        setError('Erro ao carregar pagamento');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [pedidoId, router, subdominio, status, clearCart]);

  const handleIrParaPagamento = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  };

  if (loading) {
    return <MercadoPagoLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-md">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link 
            href={`/${subdominio}/checkout`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Link>
        </div>

        <Card>
          <CardContent className="p-6">
            {/* Título */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Pagar com Mercado Pago
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Pedido #{pedido?.codigo}
              </p>
            </div>

            {/* Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-medium">Erro no pagamento</p>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Valor */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
              <p className="text-sm text-gray-500 mb-1">Valor a pagar</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(pedido?.v_pedido || 0)}
              </p>
            </div>

            {/* Informações */}
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">
                  Opções de pagamento disponíveis:
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Cartão de crédito
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Cartão de débito
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Boleto bancário
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    PIX
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Mercado Crédito
                  </li>
                </ul>
              </div>

              <div className="text-sm text-gray-500">
                <p>
                  Você será redirecionado para o site do Mercado Pago para 
                  completar o pagamento com segurança.
                </p>
              </div>
            </div>

            {/* Botão de pagamento */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleIrParaPagamento}
              disabled={!paymentUrl}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  Ir para o Mercado Pago
                  <ExternalLink className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Segurança */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Pagamento processado com segurança por Mercado Pago
          </p>
        </div>
      </div>
    </div>
  );
}

// Página principal com Suspense
export default function MercadoPagoPage() {
  return (
    <Suspense fallback={<MercadoPagoLoading />}>
      <MercadoPagoContent />
    </Suspense>
  );
}
