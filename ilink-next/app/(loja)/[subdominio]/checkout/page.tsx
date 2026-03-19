'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  CreditCard, 
  Truck, 
  Store, 
  Utensils,
  QrCode,
  Banknote,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { processarCheckout, CheckoutData } from '@/lib/server/actions/checkout';
import { calcularFrete } from '@/lib/server/actions/sacola';
import { FormaEntrega } from '@/types/models';

// Loading fallback para Suspense
function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}

// Componente principal do checkout
function CheckoutContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const subdominio = params.subdominio as string;
  
  const { 
    items, 
    getTotal, 
    getItemCount, 
    estabelecimentoId, 
    estabelecimentoSubdominio,
    clearCart 
  } = useCartStore();

  // Estados do formulário
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Dados do cliente
  const [cliente, setCliente] = useState({
    nome: '',
    telefone: '',
    email: '',
    cpf: '',
  });

  // Dados de entrega
  const [formaEntrega, setFormaEntrega] = useState<FormaEntrega>(FormaEntrega.DELIVERY);
  const [endereco, setEndereco] = useState({
    cep: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    complemento: '',
  });
  const [mesa, setMesa] = useState('');
  const [valorFrete, setValorFrete] = useState(0);
  const [loadingFrete, setLoadingFrete] = useState(false);

  // Dados de pagamento
  const [formaPagamento, setFormaPagamento] = useState<'dinheiro' | 'cartao' | 'pix' | 'mercadopago' | 'pagseguro'>('pix');
  const [trocoPara, setTrocoPara] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Cupom
  const [cupom, setCupom] = useState<{ codigo: string; desconto: number } | null>(null);

  useEffect(() => {
    setMounted(true);
    // Recuperar cupom do localStorage
    const cupomSalvo = localStorage.getItem('cupom_aplicado');
    if (cupomSalvo) {
      setCupom(JSON.parse(cupomSalvo));
    }
  }, []);

  // Verificar se é o mesmo estabelecimento
  useEffect(() => {
    if (mounted && estabelecimentoSubdominio && estabelecimentoSubdominio !== subdominio) {
      toast.error('Você tem itens de outra loja na sacola.');
      router.push(`/${subdominio}`);
    }
  }, [mounted, estabelecimentoSubdominio, subdominio, router]);

  // Calcular frete quando endereço mudar (para delivery)
  useEffect(() => {
    if (formaEntrega === FormaEntrega.DELIVERY && endereco.cep.length === 8 && estabelecimentoId) {
      calcularFreteValor();
    }
  }, [formaEntrega, endereco.cep, estabelecimentoId]);

  const calcularFreteValor = async () => {
    if (!estabelecimentoId) return;
    setLoadingFrete(true);
    try {
      const result = await calcularFrete(estabelecimentoId, {
        cep: endereco.cep,
        endereco: endereco.endereco,
        bairro: endereco.bairro,
      });
      if (result.success && result.valor !== undefined) {
        setValorFrete(result.valor);
      }
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
    } finally {
      setLoadingFrete(false);
    }
  };

  if (!mounted) {
    return <CheckoutLoading />;
  }

  // Redirecionar se sacola vazia
  if (items.length === 0) {
    router.push(`/${subdominio}/sacola`);
    return null;
  }

  const subtotal = getTotal();
  const desconto = cupom?.desconto || 0;
  const total = subtotal + valorFrete - desconto;

  const validateStep1 = () => {
    if (!cliente.nome.trim()) {
      toast.error('Digite seu nome');
      return false;
    }
    if (!cliente.telefone.trim() || cliente.telefone.length < 10) {
      toast.error('Digite um telefone válido');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (formaEntrega === FormaEntrega.DELIVERY) {
      if (!endereco.endereco.trim() || !endereco.numero.trim() || !endereco.bairro.trim()) {
        toast.error('Preencha todos os campos de endereço');
        return false;
      }
    }
    if (formaEntrega === FormaEntrega.MESA && !mesa.trim()) {
      toast.error('Digite o número da mesa');
      return false;
    }
    return true;
  };

  const handleFinalizarPedido = async () => {
    if (!estabelecimentoId) {
      toast.error('Erro ao identificar estabelecimento');
      return;
    }

    setLoading(true);
    try {
      const checkoutData: CheckoutData = {
        estabelecimento_id: estabelecimentoId,
        cliente: {
          nome: cliente.nome,
          telefone: cliente.telefone,
          email: cliente.email || undefined,
          cpf: cliente.cpf || undefined,
        },
        entrega: {
          forma: formaEntrega,
          ...(formaEntrega === FormaEntrega.DELIVERY && {
            cep: endereco.cep,
            endereco: endereco.endereco,
            numero: endereco.numero,
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            estado: endereco.estado,
            complemento: endereco.complemento,
          }),
          ...(formaEntrega === FormaEntrega.MESA && {
            mesa,
          }),
        },
        pagamento: {
          forma: formaPagamento,
          ...(formaPagamento === 'dinheiro' && {
            trocoPara: trocoPara ? parseFloat(trocoPara) : undefined,
          }),
          observacoes: observacoes || undefined,
        },
        items: items.map(item => ({
          produto_id: item.produto_id,
          nome: item.nome,
          valor: item.valor,
          quantidade: item.quantidade,
          imagem: item.imagem,
          variacao_id: item.variacao_id,
          variacao_nome: item.variacao_nome,
        })),
        cupom: cupom?.codigo,
        valor_desconto: desconto,
        valor_frete: valorFrete,
        valor_total: total,
      };

      const result = await processarCheckout(checkoutData);

      if (result.success && result.pedido_id) {
        // Limpar cupom do localStorage
        localStorage.removeItem('cupom_aplicado');
        
        // Redirecionar para página de obrigado ou pagamento
        if (formaPagamento === 'pix' || formaPagamento === 'mercadopago' || formaPagamento === 'pagseguro') {
          router.push(`/${subdominio}/pagamento/${formaPagamento}?pedido=${result.pedido_id}`);
        } else {
          clearCart();
          router.push(`/${subdominio}/obrigado?pedido=${result.pedido_id}`);
        }
      } else {
        toast.error(result.error || 'Erro ao processar pedido');
      }
    } catch (error) {
      console.error('Erro no checkout:', error);
      toast.error('Erro ao processar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link 
            href={`/${subdominio}/sacola`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para Sacola
          </Link>
          <h1 className="text-xl font-bold text-gray-900 ml-auto">
            Finalizar Pedido
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              <User className="w-4 h-4" />
            </div>
            <span className="ml-2 text-sm font-medium hidden sm:inline">Dados</span>
          </div>
          <div className={`w-12 h-0.5 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              <MapPin className="w-4 h-4" />
            </div>
            <span className="ml-2 text-sm font-medium hidden sm:inline">Entrega</span>
          </div>
          <div className={`w-12 h-0.5 mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="ml-2 text-sm font-medium hidden sm:inline">Pagamento</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Dados Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome completo *</Label>
                    <Input
                      id="nome"
                      value={cliente.nome}
                      onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
                    <Input
                      id="telefone"
                      value={cliente.telefone}
                      onChange={(e) => setCliente({ ...cliente, telefone: e.target.value })}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={cliente.email}
                      onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
                      placeholder="seu@email.com"
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => validateStep1() && setStep(2)}
                  >
                    Continuar
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Forma de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setFormaEntrega(FormaEntrega.DELIVERY)}
                      className={`p-4 rounded-lg border-2 text-center transition-colors ${
                        formaEntrega === FormaEntrega.DELIVERY 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Truck className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">Delivery</span>
                    </button>
                    <button
                      onClick={() => setFormaEntrega(FormaEntrega.RETIRADA)}
                      className={`p-4 rounded-lg border-2 text-center transition-colors ${
                        formaEntrega === FormaEntrega.RETIRADA 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Store className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">Retirada</span>
                    </button>
                    <button
                      onClick={() => setFormaEntrega(FormaEntrega.MESA)}
                      className={`p-4 rounded-lg border-2 text-center transition-colors ${
                        formaEntrega === FormaEntrega.MESA 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Utensils className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">Na Mesa</span>
                    </button>
                  </div>

                  {formaEntrega === FormaEntrega.DELIVERY && (
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label htmlFor="cep">CEP</Label>
                        <Input
                          id="cep"
                          value={endereco.cep}
                          onChange={(e) => setEndereco({ ...endereco, cep: e.target.value })}
                          placeholder="00000-000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="endereco">Endereço *</Label>
                        <Input
                          id="endereco"
                          value={endereco.endereco}
                          onChange={(e) => setEndereco({ ...endereco, endereco: e.target.value })}
                          placeholder="Rua, Avenida, etc."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="numero">Número *</Label>
                          <Input
                            id="numero"
                            value={endereco.numero}
                            onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })}
                            placeholder="123"
                          />
                        </div>
                        <div>
                          <Label htmlFor="complemento">Complemento</Label>
                          <Input
                            id="complemento"
                            value={endereco.complemento}
                            onChange={(e) => setEndereco({ ...endereco, complemento: e.target.value })}
                            placeholder="Apto, Bloco"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="bairro">Bairro *</Label>
                        <Input
                          id="bairro"
                          value={endereco.bairro}
                          onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })}
                          placeholder="Seu bairro"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cidade">Cidade</Label>
                          <Input
                            id="cidade"
                            value={endereco.cidade}
                            onChange={(e) => setEndereco({ ...endereco, cidade: e.target.value })}
                            placeholder="Sua cidade"
                          />
                        </div>
                        <div>
                          <Label htmlFor="estado">Estado</Label>
                          <Input
                            id="estado"
                            value={endereco.estado}
                            onChange={(e) => setEndereco({ ...endereco, estado: e.target.value })}
                            placeholder="UF"
                            maxLength={2}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {formaEntrega === FormaEntrega.MESA && (
                    <div className="pt-4">
                      <Label htmlFor="mesa">Número da Mesa *</Label>
                      <Input
                        id="mesa"
                        value={mesa}
                        onChange={(e) => setMesa(e.target.value)}
                        placeholder="Ex: 05"
                      />
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      Voltar
                    </Button>
                    <Button 
                      className="flex-1" 
                      onClick={() => validateStep2() && setStep(3)}
                    >
                      Continuar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Forma de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setFormaPagamento('pix')}
                      className={`p-4 rounded-lg border-2 text-center transition-colors ${
                        formaPagamento === 'pix' 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <QrCode className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">PIX</span>
                    </button>
                    <button
                      onClick={() => setFormaPagamento('dinheiro')}
                      className={`p-4 rounded-lg border-2 text-center transition-colors ${
                        formaPagamento === 'dinheiro' 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Banknote className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">Dinheiro</span>
                    </button>
                    <button
                      onClick={() => setFormaPagamento('cartao')}
                      className={`p-4 rounded-lg border-2 text-center transition-colors ${
                        formaPagamento === 'cartao' 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <CreditCard className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">Cartão</span>
                    </button>
                    <button
                      onClick={() => setFormaPagamento('mercadopago')}
                      className={`p-4 rounded-lg border-2 text-center transition-colors ${
                        formaPagamento === 'mercadopago' 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <CreditCard className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">Mercado Pago</span>
                    </button>
                  </div>

                  {formaPagamento === 'dinheiro' && (
                    <div className="pt-4">
                      <Label htmlFor="troco">Precisa de troco para quanto?</Label>
                      <Input
                        id="troco"
                        type="number"
                        value={trocoPara}
                        onChange={(e) => setTrocoPara(e.target.value)}
                        placeholder="0,00"
                      />
                    </div>
                  )}

                  <div className="pt-4">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      placeholder="Alguma observação sobre o pedido?"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setStep(2)}
                      className="flex-1"
                      disabled={loading}
                    >
                      Voltar
                    </Button>
                    <Button 
                      className="flex-1" 
                      onClick={handleFinalizarPedido}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        `Finalizar Pedido - ${formatCurrency(total)}`
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.produto_id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.quantidade}x {item.nome}
                      </span>
                      <span>{formatCurrency(item.valor * item.quantidade)}</span>
                    </div>
                  ))}
                </div>

                <hr className="border-gray-200" />

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                {formaEntrega === FormaEntrega.DELIVERY && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Frete</span>
                    <span>
                      {loadingFrete ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        formatCurrency(valorFrete)
                      )}
                    </span>
                  </div>
                )}

                {desconto > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Desconto</span>
                    <span className="text-green-600">-{formatCurrency(desconto)}</span>
                  </div>
                )}

                <hr className="border-gray-200" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                {desconto > 0 && (
                  <p className="text-xs text-green-600 bg-green-50 p-2 rounded flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Você economizou {formatCurrency(desconto)}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Página principal com Suspense
export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  );
}
