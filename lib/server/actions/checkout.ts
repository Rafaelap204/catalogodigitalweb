/**
 * Server Actions para processamento de checkout e pedidos
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { FormaEntrega } from '@/types/models';

export interface CheckoutItem {
  produto_id: number;
  nome: string;
  valor: number;
  quantidade: number;
  imagem?: string;
  variacao_id?: number;
  variacao_nome?: string;
}

export interface DadosCliente {
  nome: string;
  telefone: string;
  email?: string;
  cpf?: string;
}

export interface DadosEntrega {
  forma: FormaEntrega;
  cep?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  complemento?: string;
  mesa?: string;
}

export interface DadosPagamento {
  forma: 'dinheiro' | 'cartao' | 'pix' | 'mercadopago' | 'pagseguro';
  trocoPara?: number;
  observacoes?: string;
}

export interface CheckoutData {
  estabelecimento_id: number;
  cliente: DadosCliente;
  entrega: DadosEntrega;
  pagamento: DadosPagamento;
  items: CheckoutItem[];
  cupom?: string;
  valor_desconto?: number;
  valor_frete: number;
  valor_total: number;
}

export interface PedidoResult {
  success: boolean;
  pedido_id?: string | number;
  error?: string;
}

interface PedidoData {
  id: number;
  codigo: string;
}

interface PedidoRow {
  id: number;
  codigo?: string;
  [key: string]: unknown;
}

/**
 * Processa o checkout e cria um novo pedido
 */
export async function processarCheckout(
  data: CheckoutData
): Promise<PedidoResult> {
  try {
    const supabase = await createClient();

    // Gerar código do pedido (único por estabelecimento)
    const codigo = await gerarCodigoPedido(data.estabelecimento_id);

    // Criar o pedido
    const pedidoData = {
      rel_estabelecimentos_id: data.estabelecimento_id,
      codigo,
      cliente_nome: data.cliente.nome,
      whatsapp: data.cliente.telefone,
      email: data.cliente.email || null,
      cpf: data.cliente.cpf || null,
      forma_entrega: data.entrega.forma,
      endereco: data.entrega.endereco || null,
      numero: data.entrega.numero || null,
      bairro: data.entrega.bairro || null,
      cidade: data.entrega.cidade || null,
      estado: data.entrega.estado || null,
      cep: data.entrega.cep || null,
      complemento: data.entrega.complemento || null,
      mesa: data.entrega.mesa || null,
      forma_pagamento: data.pagamento.forma,
      troco_para: data.pagamento.trocoPara || null,
      observacoes: data.pagamento.observacoes || null,
      v_pedido: data.valor_total,
      valor_frete: data.valor_frete,
      valor_desconto: data.valor_desconto || 0,
      cupom: data.cupom || null,
      status: 1, // Pendente
      data: new Date().toISOString(),
    };

    const { data: pedido, error: pedidoError } = await (supabase
      .from('pedidos') as any)
      .insert(pedidoData)
      .select('id')
      .single();

    if (pedidoError || !pedido) {
      console.error('Erro ao criar pedido:', pedidoError);
      return { success: false, error: 'Erro ao criar pedido' };
    }

    const pedidoId = (pedido as PedidoData).id;

    // Criar os itens do pedido
    const itensPedido = data.items.map((item) => ({
      rel_pedidos_id: pedidoId,
      rel_produtos_id: item.produto_id,
      produto_nome: item.nome,
      quantidade: item.quantidade,
      valor_unitario: item.valor,
      valor_total: item.valor * item.quantidade,
      variacao_id: item.variacao_id || null,
      variacao_nome: item.variacao_nome || null,
    }));

    const { error: itensError } = await (supabase
      .from('pedido_itens') as any)
      .insert(itensPedido);

    if (itensError) {
      console.error('Erro ao criar itens do pedido:', itensError);
      // TODO: Considerar rollback do pedido
      return { success: false, error: 'Erro ao criar itens do pedido' };
    }

    // Atualizar estoque dos produtos (sem usar RPC para evitar problemas de tipo)
    for (const item of data.items) {
      const { data: produto } = await supabase
        .from('produtos')
        .select('estoque')
        .eq('id', item.produto_id)
        .single();

      if (produto) {
        const estoqueAtual = (produto as { estoque: number }).estoque;
        await (supabase
          .from('produtos') as any)
          .update({ estoque: estoqueAtual - item.quantidade })
          .eq('id', item.produto_id);
      }
    }

    // Incrementar contador de uso do cupom
    if (data.cupom) {
      const { data: cupomData } = await supabase
        .from('cupons')
        .select('quantidade_usado')
        .eq('codigo', data.cupom)
        .eq('rel_estabelecimentos_id', data.estabelecimento_id)
        .single();

      if (cupomData) {
        const usadoAtual = (cupomData as { quantidade_usado: number }).quantidade_usado;
        await (supabase
          .from('cupons') as any)
          .update({ quantidade_usado: usadoAtual + 1 })
          .eq('codigo', data.cupom)
          .eq('rel_estabelecimentos_id', data.estabelecimento_id);
      }
    }

    revalidatePath(`/${data.estabelecimento_id}/pedidos`);

    return {
      success: true,
      pedido_id: pedidoId,
    };
  } catch (error) {
    console.error('Erro no checkout:', error);
    return { success: false, error: 'Erro ao processar checkout' };
  }
}

/**
 * Gera um código único para o pedido
 */
async function gerarCodigoPedido(estabelecimentoId: number): Promise<string> {
  const supabase = await createClient();
  
  // Buscar o último pedido do estabelecimento
  const { data } = await supabase
    .from('pedidos')
    .select('codigo')
    .eq('rel_estabelecimentos_id', estabelecimentoId)
    .order('id', { ascending: false })
    .limit(1)
    .single();

  let numero = 1;
  if (data) {
    const codigoAtual = (data as { codigo?: string }).codigo;
    if (codigoAtual) {
      const match = codigoAtual.match(/\d+/);
      if (match) {
        numero = parseInt(match[0], 10) + 1;
      }
    }
  }

  return `PED${String(numero).padStart(6, '0')}`;
}

/**
 * Busca um pedido pelo ID
 */
export async function buscarPedidoCheckout(
  pedidoId: string | number
): Promise<{ success: boolean; pedido?: Record<string, unknown>; error?: string }> {
  try {
    const supabase = await createClient();

    const { data: pedido, error } = await supabase
      .from('pedidos')
      .select('*')
      .eq('id', pedidoId)
      .single();

    if (error || !pedido) {
      return { success: false, error: 'Pedido não encontrado' };
    }

    const { data: itens, error: itensError } = await supabase
      .from('pedido_itens')
      .select('*')
      .eq('rel_pedidos_id', pedidoId);

    if (itensError) {
      console.error('Erro ao buscar itens:', itensError);
    }

    const pedidoRow = pedido as PedidoRow;

    return {
      success: true,
      pedido: {
        ...pedidoRow,
        itens: itens || [],
      },
    };
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    return { success: false, error: 'Erro ao buscar pedido' };
  }
}

/**
 * Busca pedidos de um cliente pelo telefone
 */
export async function buscarPedidosCliente(
  telefone: string,
  estabelecimentoId?: number
): Promise<{ success: boolean; pedidos?: unknown[]; error?: string }> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from('pedidos')
      .select('*')
      .eq('whatsapp', telefone)
      .order('data', { ascending: false });

    if (estabelecimentoId) {
      query = query.eq('rel_estabelecimentos_id', estabelecimentoId);
    }

    const { data: pedidos, error } = await query;

    if (error) {
      console.error('Erro ao buscar pedidos:', error);
      return { success: false, error: 'Erro ao buscar pedidos' };
    }

    return { success: true, pedidos: pedidos || [] };
  } catch (error) {
    console.error('Erro ao buscar pedidos do cliente:', error);
    return { success: false, error: 'Erro ao buscar pedidos' };
  }
}
