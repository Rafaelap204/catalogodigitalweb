/**
 * Server Actions para gerenciar segmentos
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Segmento {
  id: number;
  nome: string;
  icone: string | null;
  status: number;
}

export interface ListarSegmentosParams {
  pagina?: number;
  limite?: number;
  nome?: string;
}

export interface ListarSegmentosResult {
  segmentos: Segmento[];
  total: number;
  paginas: number;
  paginaAtual: number;
}

/**
 * Lista segmentos com paginação e filtros
 */
export async function listarSegmentos(
  params: ListarSegmentosParams = {}
): Promise<ListarSegmentosResult> {
  try {
    const supabase = await createClient();
    
    const {
      pagina = 1,
      limite = 20,
      nome,
    } = params;

    const offset = (pagina - 1) * limite;

    let query = supabase
      .from('segmentos')
      .select('id, nome, icone, status', { count: 'exact' });

    if (nome) {
      query = query.ilike('nome', `${nome}%`);
    }

    const { data, error, count } = await query
      .order('nome', { ascending: true })
      .range(offset, offset + limite - 1);

    if (error) {
      console.error('Erro ao listar segmentos:', error);
      return {
        segmentos: [],
        total: 0,
        paginas: 0,
        paginaAtual: pagina,
      };
    }

    const total = count || 0;
    const paginas = Math.ceil(total / limite);

    return {
      segmentos: (data || []) as Segmento[],
      total,
      paginas,
      paginaAtual: pagina,
    };
  } catch (error) {
    console.error('Erro:', error);
    return {
      segmentos: [],
      total: 0,
      paginas: 0,
      paginaAtual: 1,
    };
  }
}

/**
 * Busca um segmento por ID
 */
export async function buscarSegmento(id: number): Promise<Segmento | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('segmentos')
      .select('id, nome, icone, status')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar segmento:', error);
      return null;
    }

    return data as Segmento;
  } catch (error) {
    console.error('Erro:', error);
    return null;
  }
}

/**
 * Cria um novo segmento
 */
export async function criarSegmento(formData: FormData) {
  try {
    const supabase = await createClient();
    
    const nome = formData.get('nome') as string;
    const icone = formData.get('icone') as string;
    
    if (!nome) {
      return { error: 'Nome é obrigatório' };
    }

    const insertData = {
      nome: nome.trim(),
      icone: icone || null,
      status: 1,
    };

    const { data, error } = await supabase
      .from('segmentos' as any)
      .insert(insertData as any)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar segmento:', error);
      return { error: 'Erro ao criar segmento' };
    }

    revalidatePath('/administracao/segmentos');
    return { success: true, data };
  } catch (error) {
    console.error('Erro:', error);
    return { error: 'Erro ao criar segmento' };
  }
}

/**
 * Atualiza um segmento
 */
export async function atualizarSegmento(id: number, formData: FormData) {
  try {
    const supabase = await createClient();
    
    const nome = formData.get('nome') as string;
    const icone = formData.get('icone') as string;
    const status = parseInt(formData.get('status') as string) || 1;
    
    if (!nome) {
      return { error: 'Nome é obrigatório' };
    }

    const updateData = {
      nome: nome.trim(),
      icone: icone || null,
      status,
    };

    const { data, error } = await supabase
      .from('segmentos' as any)
      .update(updateData as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar segmento:', error);
      return { error: 'Erro ao atualizar segmento' };
    }

    revalidatePath('/administracao/segmentos');
    return { success: true, data };
  } catch (error) {
    console.error('Erro:', error);
    return { error: 'Erro ao atualizar segmento' };
  }
}

/**
 * Deleta um segmento
 */
export async function deletarSegmento(id: number) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('segmentos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar segmento:', error);
      return { error: 'Erro ao deletar segmento' };
    }

    revalidatePath('/administracao/segmentos');
    return { success: true };
  } catch (error) {
    console.error('Erro:', error);
    return { error: 'Erro ao deletar segmento' };
  }
}

/**
 * Lista todos os segmentos (para selects)
 */
export async function listarTodosSegmentos(): Promise<Segmento[]> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('segmentos')
      .select('id, nome, icone, status')
      .eq('status', 1)
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao listar segmentos:', error);
      return [];
    }

    return (data || []) as Segmento[];
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
}
