/**
 * Server Actions para gerenciar estados
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Estado {
  id: number;
  nome: string;
  uf: string;
}

export interface ListarEstadosParams {
  pagina?: number;
  limite?: number;
  nome?: string;
}

export interface ListarEstadosResult {
  estados: Estado[];
  total: number;
  paginas: number;
  paginaAtual: number;
}

/**
 * Lista estados com paginação e filtros
 */
export async function listarEstados(
  params: ListarEstadosParams = {}
): Promise<ListarEstadosResult> {
  try {
    const supabase = await createClient();
    
    const {
      pagina = 1,
      limite = 20,
      nome,
    } = params;

    const offset = (pagina - 1) * limite;

    let query = supabase
      .from('estados')
      .select('id, nome, uf', { count: 'exact' });

    if (nome) {
      query = query.ilike('nome', `${nome}%`);
    }

    const { data, error, count } = await query
      .order('nome', { ascending: true })
      .range(offset, offset + limite - 1);

    if (error) {
      console.error('Erro ao listar estados:', error);
      return {
        estados: [],
        total: 0,
        paginas: 0,
        paginaAtual: pagina,
      };
    }

    const total = count || 0;
    const paginas = Math.ceil(total / limite);

    return {
      estados: (data || []) as Estado[],
      total,
      paginas,
      paginaAtual: pagina,
    };
  } catch (error) {
    console.error('Erro:', error);
    return {
      estados: [],
      total: 0,
      paginas: 0,
      paginaAtual: 1,
    };
  }
}

/**
 * Busca um estado por ID
 */
export async function buscarEstado(id: number): Promise<Estado | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('estados')
      .select('id, nome, uf')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar estado:', error);
      return null;
    }

    return data as Estado;
  } catch (error) {
    console.error('Erro:', error);
    return null;
  }
}

/**
 * Cria um novo estado
 */
export async function criarEstado(formData: FormData) {
  try {
    const supabase = await createClient();
    
    const nome = formData.get('nome') as string;
    const uf = formData.get('uf') as string;
    
    if (!nome || !uf) {
      return { error: 'Nome e UF são obrigatórios' };
    }
    
    if (uf.length !== 2) {
      return { error: 'UF deve ter 2 caracteres' };
    }

    const insertData: { nome: string; uf: string } = {
      nome: nome.trim(),
      uf: uf.toUpperCase().trim(),
    };

    const { data, error } = await supabase
      .from('estados' as any)
      .insert(insertData as any)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar estado:', error);
      return { error: 'Erro ao criar estado' };
    }

    revalidatePath('/administracao/estados');
    return { success: true, data };
  } catch (error) {
    console.error('Erro:', error);
    return { error: 'Erro ao criar estado' };
  }
}

/**
 * Atualiza um estado
 */
export async function atualizarEstado(id: number, formData: FormData) {
  try {
    const supabase = await createClient();
    
    const nome = formData.get('nome') as string;
    const uf = formData.get('uf') as string;
    
    if (!nome || !uf) {
      return { error: 'Nome e UF são obrigatórios' };
    }
    
    if (uf.length !== 2) {
      return { error: 'UF deve ter 2 caracteres' };
    }

    const updateData: { nome: string; uf: string } = {
      nome: nome.trim(),
      uf: uf.toUpperCase().trim(),
    };

    const { data, error } = await supabase
      .from('estados' as any)
      .update(updateData as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar estado:', error);
      return { error: 'Erro ao atualizar estado' };
    }

    revalidatePath('/administracao/estados');
    return { success: true, data };
  } catch (error) {
    console.error('Erro:', error);
    return { error: 'Erro ao atualizar estado' };
  }
}

/**
 * Deleta um estado
 */
export async function deletarEstado(id: number) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('estados')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar estado:', error);
      return { error: 'Erro ao deletar estado' };
    }

    revalidatePath('/administracao/estados');
    return { success: true };
  } catch (error) {
    console.error('Erro:', error);
    return { error: 'Erro ao deletar estado' };
  }
}

/**
 * Lista todos os estados (para selects)
 */
export async function listarTodosEstados(): Promise<Estado[]> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('estados')
      .select('id, nome, uf')
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao listar estados:', error);
      return [];
    }

    return (data || []) as Estado[];
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
}
