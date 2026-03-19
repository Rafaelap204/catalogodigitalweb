'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  QrCode, 
  Copy, 
  CheckCircle, 
  Clock, 
  Loader2,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { gerarPagamentoPix, verificarStatusPix } from '@/lib/server/actions/pagamentos';
import { buscarPedidoCheckout } from '@/lib/server/actions/checkout';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils/formatters';

interface Pedido {
  id: number;
  codigo: string;
  v_pedido: number;
  status: number;
  rel_estabelecimentos_id: number;
}

// Loading fallback
function PixLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}

// Componente principal
function PixContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const subdominio = params.subdominio as string;
  const pedidoId = searchParams.get('pedido');
  
  const { clearCart } = useCartStore();
  
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [pixCode, setPixCode] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<'pending' | 'approved' | 'expired'>('pending');
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutos em segundos

  useEffect(() => {
    const init = async () => {
      if (!pedidoId) {
        router.push(`/${subdominio}`);
        return;
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

        // Gerar PIX
        const pixResult = await gerarPagamentoPix({
          pedido_id: pedidoId,
          valor: pedidoData.v_pedido,
          descricao: `Pedido #${pedidoData.codigo}`,
          estabelecimento_id: pedidoData.rel_estabelecimentos_id,
        });

        if (pixResult.success && pixResult.copia_e_cola) {
          setPixCode(pixResult.copia_e_cola);
          setTransactionId(pixResult.transaction_id || '');
        } else {
          toast.error(pixResult.error || 'Erro ao gerar PIX');
        }
      } catch (error) {
        console.error('Erro:', error);
        toast.error('Erro ao carregar pagamento');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [pedidoId, router, subdominio]);

  // Timer para expiração
  useEffect(() => {
    if (timeLeft <= 0) {
      setStatus('expired');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Verificar status do pagamento
  useEffect(() => {
    if (!transactionId || status !== 'pending') return;

    const checkStatus = async () => {
      try {
        const result = await verificarStatusPix(transactionId);
        if (result.success && result.status === 'approved') {
          setStatus('approved');
          clearCart();
          // Redirecionar para página de obrigado
          setTimeout(() => {
            router.push(`/${subdominio}/obrigado?pedido=${pedidoId}`);
          }, 2000);
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
      }
    };

    const interval = setInterval(checkStatus, 10000); // Verificar a cada 10 segundos
    return () => clearInterval(interval);
  }, [transactionId, status, pedidoId, router, subdominio, clearCart]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      toast.success('Código PIX copiado!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Erro ao copiar código');
    }
  };

  if (loading) {
    return <PixLoading />;
  }

  if (status === 'approved') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Pagamento Confirmado!
            </h1>
            <p className="text-gray-500 mb-6">
              Seu pagamento foi processado com sucesso.
            </p>
            <Link href={`/${subdominio}/obrigado?pedido=${pedidoId}`}>
              <Button className="w-full">
                Ver Pedido
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              PIX Expirado
            </h1>
            <p className="text-gray-500 mb-6">
              O tempo para pagamento expirou. Por favor, tente novamente.
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
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Pague com PIX
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Pedido #{pedido?.codigo}
              </p>
            </div>

            {/* Valor */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
              <p className="text-sm text-gray-500 mb-1">Valor a pagar</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(pedido?.v_pedido || 0)}
              </p>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-center gap-2 text-sm text-orange-600 mb-6">
              <Clock className="w-4 h-4" />
              <span>Expira em {formatTime(timeLeft)}</span>
            </div>

            {/* QR Code Placeholder */}
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6">
              <div className="aspect-square max-w-[200px] mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                <QrCode className="w-24 h-24 text-gray-400" />
              </div>
              <p className="text-center text-sm text-gray-500 mt-4">
                Escaneie o QR Code com seu aplicativo bancário
              </p>
            </div>

            {/* Código Copia e Cola */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Ou copie o código PIX:</p>
              <div className="flex gap-2">
                <div className="flex-1 bg-gray-100 rounded-lg p-3 text-xs text-gray-600 break-all font-mono">
                  {pixCode.slice(0, 50)}...
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="flex-shrink-0"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Instruções */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-900 mb-2">
                Como pagar com PIX:
              </h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Abra o aplicativo do seu banco</li>
                <li>Escolha a opção PIX</li>
                <li>Escaneie o QR Code ou cole o código</li>
                <li>Confirme o pagamento</li>
              </ol>
            </div>

            {/* Botão de verificação manual */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Já paguei, verificar status
            </Button>
          </CardContent>
        </Card>

        {/* Ajuda */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Problemas com o pagamento?{' '}
          <Link href={`/${subdominio}`} className="text-blue-600 hover:underline">
            Entre em contato
          </Link>
        </p>
      </div>
    </div>
  );
}

// Página principal com Suspense
export default function PixPage() {
  return (
    <Suspense fallback={<PixLoading />}>
      <PixContent />
    </Suspense>
  );
}
