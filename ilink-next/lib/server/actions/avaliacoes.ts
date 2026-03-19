/**
 * Server Actions para gerenciar avaliações
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Avaliacao {
  id?: string | number;
  estabelecimento_id?: string | number;
  produto_id?: string | number;
  pedido_id?: string | number;
  cliente_nome?: string;
  cliente_email?: string;
  nota: number;
  comentario?: string;
  resposta?: string;
  status: number;
  created?: string;
}

export interface ListarAvaliacoesParams {
  pagina?: number;
  limite?: number;
  estabelecimento_id?: string | number;
  produto_id?: string | number;
  status?: number;
}

export interface ListarAvaliacoesResult {
  avaliacoes: Avaliacao[];
  total: number;
  paginas: number;
  paginaAtual: number;
}

export async function listarAvaliacoes(
  params: ListarAvaliacoesParams = {}
): Promise<ListarAvaliacoesResult> {
  try {
    const supabase = await createClient();
    const { pagina = 1, limite = 20, estabelecimento_id, produto_id, status } = params;
    const offset = (pagina - 1) * limite;

    let query = supabase.from('avaliacoes').select('*', { count: 'exact' });

    if (estabelecimento_id) query = query.eq('estabelecimento_id', estabelecimento_id);
    if (produto_id) query = query.eq('produto_id', produto_id);
    if (status !== undefined) query = query.eq('status', status);

    const { data, error, count } = await query.order('created', { ascending: false }).range(offset, offset + limite - 1);

    if (error) {
      console.error('Erro ao listar avaliações:', error);
      return { avaliacoes: [], total: 0, paginas: 0, paginaAtual: pagina };
    }

    return { avaliacoes: (data || []) as Avaliacao[], total: count || 0, paginas: Math.ceil((count || 0) / limite), paginaAtual: pagina };
  } catch (error) {
    console.error('Erro:', error);
    return { avaliacoes: [], total: 0, paginas: 0, paginaAtual: 1 };
  }
}

export async function buscarAvaliacao(id: string | number): Promise<Avaliacao | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('avaliacoes').select('*').eq('id', id).single();
    if (error || !data) return null;
    return data as Avaliacao;
  } catch (error) {
    console.error('Erro ao buscar avaliação:', error);
    return null;
  }
}

export async function responderAvaliacao(id: string | number, resposta: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await (supabase.from('avaliacoes') as any).update({ resposta }).eq('id', id);
    if (error) return { success: false, error: error.message };
    revalidatePath('/administracao/avaliacoes');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function atualizarStatusAvaliacao(id: string | number, status: number): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await (supabase.from('avaliacoes') as any).update({ status }).eq('id', id);
    if (error) return { success: false, error: error.message };
    revalidatePath('/administracao/avaliacoes');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletarAvaliacao(id: string | number): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('avaliacoes').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    revalidatePath('/administracao/avaliacoes');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
