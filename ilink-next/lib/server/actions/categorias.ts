/**
 * Server Actions para gerenciar categorias
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Categoria {
  id?: string | number;
  estabelecimento_id?: string | number;
  nome: string;
  descricao?: string;
  icone?: string;
  ordem?: number;
  status: number;
  created?: string;
}

export interface ListarCategoriasParams {
  pagina?: number;
  limite?: number;
  nome?: string;
  estabelecimento_id?: string | number;
  status?: number;
}

export interface ListarCategoriasResult {
  categorias: Categoria[];
  total: number;
  paginas: number;
  paginaAtual: number;
}

/**
 * Lista categorias com paginação e filtros
 */
export async function listarCategorias(
  params: ListarCategoriasParams = {}
): Promise<ListarCategoriasResult> {
  try {
    const supabase = await createClient();
    
    const {
      pagina = 1,
      limite = 20,
      nome,
      estabelecimento_id,
      status,
    } = params;

    // Calcular offset
    const offset = (pagina - 1) * limite;

    // Query base
    let query = supabase
      .from('categorias')
      .select('id, estabelecimento_id, nome, descricao, icone, ordem, status, created', { count: 'exact' });

    // Aplicar filtros
    if (nome) {
      query = query.ilike('nome', `%${nome}%`);
    }

    if (estabelecimento_id) {
      query = query.eq('estabelecimento_id', estabelecimento_id);
    }

    if (status !== undefined) {
      query = query.eq('status', status);
    }

    // Ordenar e paginar
    const { data, error, count } = await query
      .order('ordem', { ascending: true })
      .order('nome', { ascending: true })
      .range(offset, offset + limite - 1);

    if (error) {
      console.error('Erro ao listar categorias:', error);
      return {
        categorias: [],
        total: 0,
        paginas: 0,
        paginaAtual: pagina,
      };
    }

    const total = count || 0;
    const paginas = Math.ceil(total / limite);

    return {
      categorias: (data || []) as Categoria[],
      total,
      paginas,
      paginaAtual: pagina,
    };
  } catch (error) {
    console.error('Erro:', error);
    return {
      categorias: [],
      total: 0,
      paginas: 0,
      paginaAtual: 1,
    };
  }
}

/**
 * Busca uma categoria por ID
 */
export async function buscarCategoria(
  id: string | number
): Promise<Categoria | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Categoria;
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    return null;
  }
}

/**
 * Salva uma nova categoria
 */
export async function salvarCategoria(
  formData: FormData
): Promise<{ success: boolean; error?: string; id?: string | number }> {
  try {
    const supabase = await createClient();

    const dados = {
      estabelecimento_id: formData.get('estabelecimento_id') as string,
      nome: formData.get('nome') as string,
      descricao: formData.get('descricao') as string,
      icone: formData.get('icone') as string,
      ordem: parseInt(formData.get('ordem') as string) || 0,
      status: parseInt(formData.get('status') as string) || 1,
    };

    // Validar campos obrigatórios
    if (!dados.nome) {
      return { success: false, error: 'Nome é obrigatório' };
    }

    const { data, error } = await (supabase
      .from('categorias') as any)
      .insert([dados])
      .select('id')
      .single();

    if (error) {
      console.error('Erro ao salvar categoria:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/categorias');
    return { success: true, id: data?.id };
  } catch (error: any) {
    console.error('Erro:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Atualiza uma categoria existente
 */
export async function atualizarCategoria(
  id: string | number,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const dados = {
      estabelecimento_id: formData.get('estabelecimento_id') as string,
      nome: formData.get('nome') as string,
      descricao: formData.get('descricao') as string,
      icone: formData.get('icone') as string,
      ordem: parseInt(formData.get('ordem') as string) || 0,
      status: parseInt(formData.get('status') as string) || 1,
    };

    // Validar campos obrigatórios
    if (!dados.nome) {
      return { success: false, error: 'Nome é obrigatório' };
    }

    const { error } = await (supabase
      .from('categorias') as any)
      .update(dados)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar categoria:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/categorias');
    return { success: true };
  } catch (error: any) {
    console.error('Erro:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Deleta uma categoria
 */
export async function deletarCategoria(
  id: string | number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/categorias');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Action para atualizar categoria (usada em formulários)
 */
export async function updateCategoriaAction(
  formData: FormData
): Promise<void> {
  'use server';
  const id = formData.get('id') as string;
  await atualizarCategoria(id, formData);
}
