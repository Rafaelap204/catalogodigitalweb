/**
 * Server Actions para gerenciar pedidos
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Pedido {
  id?: string | number;
  estabelecimento_id?: string | number;
  cliente_id?: string | number;
  cliente_nome?: string;
  cliente_telefone?: string;
  cliente_email?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  complemento?: string;
  valor_total: number;
  valor_frete?: number;
  status: string;
  forma_pagamento?: string;
  observacoes?: string;
  created?: string;
  updated?: string;
}

export interface ItemPedido {
  id?: string | number;
  pedido_id?: string | number;
  produto_id?: string | number;
  produto_nome?: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
}

export interface ListarPedidosParams {
  pagina?: number;
  limite?: number;
  cliente_nome?: string;
  estabelecimento_id?: string | number;
  status?: string;
}

export interface ListarPedidosResult {
  pedidos: Pedido[];
  total: number;
  paginas: number;
  paginaAtual: number;
}

/**
 * Lista pedidos com paginação e filtros
 */
export async function listarPedidos(
  params: ListarPedidosParams = {}
): Promise<ListarPedidosResult> {
  try {
    const supabase = await createClient();
    
    const {
      pagina = 1,
      limite = 20,
      cliente_nome,
      estabelecimento_id,
      status,
    } = params;

    // Calcular offset
    const offset = (pagina - 1) * limite;

    // Query base
    let query = supabase
      .from('pedidos')
      .select('id, estabelecimento_id, cliente_nome, cliente_telefone, valor_total, valor_frete, status, forma_pagamento, created', { count: 'exact' });

    // Aplicar filtros
    if (cliente_nome) {
      query = query.ilike('cliente_nome', `%${cliente_nome}%`);
    }

    if (estabelecimento_id) {
      query = query.eq('estabelecimento_id', estabelecimento_id);
    }

    if (status) {
      query = query.eq('status', status);
    }

    // Ordenar e paginar
    const { data, error, count } = await query
      .order('created', { ascending: false })
      .range(offset, offset + limite - 1);

    if (error) {
      console.error('Erro ao listar pedidos:', error);
      return {
        pedidos: [],
        total: 0,
        paginas: 0,
        paginaAtual: pagina,
      };
    }

    const total = count || 0;
    const paginas = Math.ceil(total / limite);

    return {
      pedidos: (data || []) as Pedido[],
      total,
      paginas,
      paginaAtual: pagina,
    };
  } catch (error) {
    console.error('Erro:', error);
    return {
      pedidos: [],
      total: 0,
      paginas: 0,
      paginaAtual: 1,
    };
  }
}

/**
 * Busca um pedido por ID
 */
export async function buscarPedido(
  id: string | number
): Promise<Pedido | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Pedido;
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    return null;
  }
}

/**
 * Busca itens de um pedido
 */
export async function buscarItensPedido(
  pedido_id: string | number
): Promise<ItemPedido[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('pedido_itens')
      .select('*')
      .eq('pedido_id', pedido_id);

    if (error) {
      console.error('Erro ao buscar itens do pedido:', error);
      return [];
    }

    return (data || []) as ItemPedido[];
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
}

/**
 * Atualiza o status de um pedido
 */
export async function atualizarStatusPedido(
  id: string | number,
  status: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await (supabase
      .from('pedidos') as any)
      .update({ status, updated: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/pedidos');
    return { success: true };
  } catch (error: any) {
    console.error('Erro:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Deleta um pedido
 */
export async function deletarPedido(
  id: string | number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('pedidos')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/pedidos');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


