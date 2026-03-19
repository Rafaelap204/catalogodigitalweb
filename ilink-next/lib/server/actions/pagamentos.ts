/**
 * Server Actions para processamento de pagamentos
 * Integração com PIX, Mercado Pago e PagSeguro
 */

'use server';

import { createClient } from '@/lib/supabase/server';

// ============================================
// TIPOS
// ============================================

export interface PixPaymentData {
  pedido_id: string | number;
  valor: number;
  descricao: string;
  estabelecimento_id: number;
}

export interface PixPaymentResult {
  success: boolean;
  qr_code?: string;
  qr_code_base64?: string;
  copia_e_cola?: string;
  transaction_id?: string;
  expiration?: string;
  error?: string;
}

export interface MercadoPagoData {
  pedido_id: string | number;
  valor: number;
  descricao: string;
  cliente_nome: string;
  cliente_email: string;
  cliente_telefone: string;
  estabelecimento_id: number;
}

export interface MercadoPagoResult {
  success: boolean;
  init_point?: string;
  preference_id?: string;
  error?: string;
}

export interface PagSeguroData {
  pedido_id: string | number;
  valor: number;
  descricao: string;
  cliente_nome: string;
  cliente_email: string;
  cliente_telefone: string;
  estabelecimento_id: number;
}

export interface PagSeguroResult {
  success: boolean;
  payment_url?: string;
  code?: string;
  error?: string;
}

interface EstabelecimentoCredenciais {
  chave_pix?: string;
  beneficiario_pix?: string;
  mercadopago_public_key?: string;
  mercadopago_access_token?: string;
  pagseguro_email?: string;
  pagseguro_token?: string;
}

// ============================================
// PIX
// ============================================

/**
 * Gera um pagamento PIX
 * Implementação básica - em produção, integrar com API do banco/gerencianet
 */
export async function gerarPagamentoPix(
  data: PixPaymentData
): Promise<PixPaymentResult> {
  try {
    const supabase = await createClient();

    // Buscar credenciais PIX do estabelecimento
    const { data: estabelecimento, error } = await supabase
      .from('estabelecimentos')
      .select('chave_pix, beneficiario_pix')
      .eq('id', data.estabelecimento_id)
      .single();

    if (error || !estabelecimento) {
      return { success: false, error: 'Estabelecimento não encontrado' };
    }

    const credenciais = estabelecimento as unknown as EstabelecimentoCredenciais;

    if (!credenciais.chave_pix) {
      return { success: false, error: 'PIX não configurado para este estabelecimento' };
    }

    // Gerar código de transação único
    const transactionId = `PIX${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Calcular expiração (30 minutos)
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 30);

    // Salvar transação no banco
    await (supabase.from('pagamentos') as any).insert({
      rel_pedidos_id: data.pedido_id,
      gateway: 'pix',
      gateway_transaction_id: transactionId,
      valor: data.valor,
      status: 'pending',
      dados: JSON.stringify({
        chave_pix: credenciais.chave_pix,
        beneficiario: credenciais.beneficiario_pix,
        descricao: data.descricao,
      }),
      created_at: new Date().toISOString(),
      expires_at: expiration.toISOString(),
    });

    // Gerar PIX Copia e Cola (simplificado)
    const pixCode = gerarPixCopiaECola({
      chave: credenciais.chave_pix,
      valor: data.valor,
      descricao: data.descricao,
      transactionId,
    });

    return {
      success: true,
      qr_code: pixCode,
      copia_e_cola: pixCode,
      transaction_id: transactionId,
      expiration: expiration.toISOString(),
    };
  } catch (error) {
    console.error('Erro ao gerar PIX:', error);
    return { success: false, error: 'Erro ao gerar pagamento PIX' };
  }
}

/**
 * Gera o código PIX Copia e Cola
 * Implementação simplificada do padrão EMV-QRCode
 */
function gerarPixCopiaECola(params: {
  chave: string;
  valor: number;
  descricao: string;
  transactionId: string;
}): string {
  // Esta é uma implementação simplificada
  // Em produção, deve-se usar uma biblioteca como pix-utils ou integração direta
  const { chave, valor, descricao } = params;
  
  // Formatar valor
  const valorFormatado = valor.toFixed(2);
  
  // Criar payload PIX simplificado
  let payload = '000201';
  payload += '26360014BR.GOV.BCB.PIX';
  payload += `0114${chave.length}${chave}`;
  payload += '52040000';
  payload += '5303986';
  payload += `5404${valorFormatado.length}${valorFormatado}`;
  payload += '5802BR';
  payload += `5908${descricao.slice(0, 25).length}${descricao.slice(0, 25)}`;
  payload += '6009SAO PAULO';
  payload += '62070503***';
  payload += '6304';
  
  // Em produção, calcular o CRC16 corretamente
  return payload + '0000'; // CRC placeholder
}

/**
 * Verifica o status de um pagamento PIX
 */
export async function verificarStatusPix(
  transactionId: string
): Promise<{ success: boolean; status?: string; error?: string }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('pagamentos')
      .select('status')
      .eq('gateway_transaction_id', transactionId)
      .single();

    if (error || !data) {
      return { success: false, error: 'Transação não encontrada' };
    }

    return {
      success: true,
      status: (data as { status: string }).status,
    };
  } catch (error) {
    console.error('Erro ao verificar PIX:', error);
    return { success: false, error: 'Erro ao verificar status' };
  }
}

// ============================================
// MERCADO PAGO
// ============================================

/**
 * Cria uma preferência de pagamento no Mercado Pago
 */
export async function criarPreferenciaMercadoPago(
  data: MercadoPagoData
): Promise<MercadoPagoResult> {
  try {
    const supabase = await createClient();

    // Buscar credenciais do Mercado Pago
    const { data: estabelecimento, error } = await supabase
      .from('estabelecimentos')
      .select('mercadopago_access_token')
      .eq('id', data.estabelecimento_id)
      .single();

    if (error || !estabelecimento) {
      return { success: false, error: 'Estabelecimento não encontrado' };
    }

    const credenciais = estabelecimento as unknown as EstabelecimentoCredenciais;

    if (!credenciais.mercadopago_access_token) {
      return { success: false, error: 'Mercado Pago não configurado' };
    }

    // Criar preferência via API do Mercado Pago
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credenciais.mercadopago_access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            title: data.descricao,
            quantity: 1,
            unit_price: data.valor,
            currency_id: 'BRL',
          },
        ],
        payer: {
          name: data.cliente_nome,
          email: data.cliente_email,
          phone: {
            number: data.cliente_telefone,
          },
        },
        external_reference: String(data.pedido_id),
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/loja/obrigado?pedido=${data.pedido_id}`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/loja/pagamento/mercadopago?pedido=${data.pedido_id}&status=failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/loja/pagamento/mercadopago?pedido=${data.pedido_id}&status=pending`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro Mercado Pago:', errorData);
      return { success: false, error: 'Erro ao criar preferência' };
    }

    const result = await response.json();

    // Salvar transação
    await (supabase.from('pagamentos') as any).insert({
      rel_pedidos_id: data.pedido_id,
      gateway: 'mercadopago',
      gateway_transaction_id: result.id,
      valor: data.valor,
      status: 'pending',
      dados: JSON.stringify(result),
      created_at: new Date().toISOString(),
    });

    return {
      success: true,
      init_point: result.init_point,
      preference_id: result.id,
    };
  } catch (error) {
    console.error('Erro ao criar preferência MP:', error);
    return { success: false, error: 'Erro ao criar pagamento' };
  }
}

// ============================================
// PAGSEGURO
// ============================================

/**
 * Cria uma transação no PagSeguro
 */
export async function criarTransacaoPagSeguro(
  data: PagSeguroData
): Promise<PagSeguroResult> {
  try {
    const supabase = await createClient();

    // Buscar credenciais do PagSeguro
    const { data: estabelecimento, error } = await supabase
      .from('estabelecimentos')
      .select('pagseguro_email, pagseguro_token')
      .eq('id', data.estabelecimento_id)
      .single();

    if (error || !estabelecimento) {
      return { success: false, error: 'Estabelecimento não encontrado' };
    }

    const credenciais = estabelecimento as unknown as EstabelecimentoCredenciais;

    if (!credenciais.pagseguro_email || !credenciais.pagseguro_token) {
      return { success: false, error: 'PagSeguro não configurado' };
    }

    // Criar checkout via API do PagSeguro
    const formData = new URLSearchParams();
    formData.append('email', credenciais.pagseguro_email);
    formData.append('token', credenciais.pagseguro_token);
    formData.append('currency', 'BRL');
    formData.append('itemId1', String(data.pedido_id));
    formData.append('itemDescription1', data.descricao);
    formData.append('itemAmount1', data.valor.toFixed(2));
    formData.append('itemQuantity1', '1');
    formData.append('reference', String(data.pedido_id));
    formData.append('senderName', data.cliente_nome);
    formData.append('senderEmail', data.cliente_email);
    formData.append('senderPhone', data.cliente_telefone);
    formData.append('redirectURL', `${process.env.NEXT_PUBLIC_APP_URL}/loja/obrigado?pedido=${data.pedido_id}`);
    formData.append('notificationURL', `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/pagseguro`);

    const response = await fetch('https://ws.pagseguro.uol.com.br/v2/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: formData,
    });

    if (!response.ok) {
      console.error('Erro PagSeguro:', await response.text());
      return { success: false, error: 'Erro ao criar transação' };
    }

    // Parse XML response
    const xmlText = await response.text();
    const codeMatch = xmlText.match(/<code>([^<]+)<\/code>/);

    if (!codeMatch) {
      return { success: false, error: 'Erro ao processar resposta' };
    }

    const code = codeMatch[1];

    // Salvar transação
    await (supabase.from('pagamentos') as any).insert({
      rel_pedidos_id: data.pedido_id,
      gateway: 'pagseguro',
      gateway_transaction_id: code,
      valor: data.valor,
      status: 'pending',
      dados: JSON.stringify({ code }),
      created_at: new Date().toISOString(),
    });

    return {
      success: true,
      code,
      payment_url: `https://pagseguro.uol.com.br/v2/checkout/payment.html?code=${code}`,
    };
  } catch (error) {
    console.error('Erro ao criar transação PagSeguro:', error);
    return { success: false, error: 'Erro ao criar pagamento' };
  }
}

/**
 * Webhook para receber notificações de pagamento
 */
export async function processarWebhook(
  gateway: 'mercadopago' | 'pagseguro',
  payload: Record<string, unknown>
): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient();

    // Processar webhook baseado no gateway
    if (gateway === 'mercadopago') {
      const { data } = payload;
      if (data && typeof data === 'object') {
        const mpData = data as { id?: string; external_reference?: string; status?: string };
        if (mpData.id && mpData.external_reference) {
          await (supabase.from('pagamentos') as any)
            .update({
              status: mpData.status || 'unknown',
              dados: JSON.stringify(payload),
              updated_at: new Date().toISOString(),
            })
            .eq('gateway_transaction_id', mpData.id);

          // Atualizar status do pedido se pago
          if (mpData.status === 'approved') {
            await (supabase.from('pedidos') as any)
              .update({ status: 2 }) // Aceito/Pago
              .eq('id', mpData.external_reference);
          }
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Erro no webhook:', error);
    return { success: false };
  }
}
