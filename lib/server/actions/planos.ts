/**
 * Server Actions para gerenciar planos
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Plano {
  id?: string | number;
  nome: string;
  descricao?: string;
  preco: number;
  periodicidade?: string;
  recursos?: string;
  limite_produtos?: number;
  limite_estabelecimentos?: number;
  status: number;
  ordem?: number;
  created?: string;
}

export interface ListarPlanosParams {
  pagina?: number;
  limite?: number;
  nome?: string;
  status?: number;
}

export interface ListarPlanosResult {
  planos: Plano[];
  total: number;
  paginas: number;
  paginaAtual: number;
}

/**
 * Lista planos com paginação e filtros
 */
export async function listarPlanos(
  params: ListarPlanosParams = {}
): Promise<ListarPlanosResult> {
  try {
    const supabase = await createClient();
    
    const {
      pagina = 1,
      limite = 20,
      nome,
      status,
    } = params;

    // Calcular offset
    const offset = (pagina - 1) * limite;

    // Query base
    let query = supabase
      .from('planos')
      .select('id, nome, descricao, preco, periodicidade, limite_produtos, limite_estabelecimentos, status, ordem, created', { count: 'exact' });

    // Aplicar filtros
    if (nome) {
      query = query.ilike('nome', `%${nome}%`);
    }

    if (status !== undefined) {
      query = query.eq('status', status);
    }

    // Ordenar e paginar
    const { data, error, count } = await query
      .order('ordem', { ascending: true })
      .order('preco', { ascending: true })
      .range(offset, offset + limite - 1);

    if (error) {
      console.error('Erro ao listar planos:', error);
      return {
        planos: [],
        total: 0,
        paginas: 0,
        paginaAtual: pagina,
      };
    }

    const total = count || 0;
    const paginas = Math.ceil(total / limite);

    return {
      planos: (data || []) as Plano[],
      total,
      paginas,
      paginaAtual: pagina,
    };
  } catch (error) {
    console.error('Erro:', error);
    return {
      planos: [],
      total: 0,
      paginas: 0,
      paginaAtual: 1,
    };
  }
}

/**
 * Busca um plano por ID
 */
export async function buscarPlano(
  id: string | number
): Promise<Plano | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('planos')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Plano;
  } catch (error) {
    console.error('Erro ao buscar plano:', error);
    return null;
  }
}

/**
 * Salva um novo plano
 */
export async function salvarPlano(
  formData: FormData
): Promise<{ success: boolean; error?: string; id?: string | number }> {
  try {
    const supabase = await createClient();

    const dados = {
      nome: formData.get('nome') as string,
      descricao: formData.get('descricao') as string,
      preco: parseFloat(formData.get('preco') as string) || 0,
      periodicidade: formData.get('periodicidade') as string,
      recursos: formData.get('recursos') as string,
      limite_produtos: parseInt(formData.get('limite_produtos') as string) || null,
      limite_estabelecimentos: parseInt(formData.get('limite_estabelecimentos') as string) || null,
      status: parseInt(formData.get('status') as string) || 1,
      ordem: parseInt(formData.get('ordem') as string) || 0,
    };

    // Validar campos obrigatórios
    if (!dados.nome) {
      return { success: false, error: 'Nome é obrigatório' };
    }

    const { data, error } = await (supabase
      .from('planos') as any)
      .insert([dados])
      .select('id')
      .single();

    if (error) {
      console.error('Erro ao salvar plano:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/planos');
    return { success: true, id: data?.id };
  } catch (error: any) {
    console.error('Erro:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Atualiza um plano existente
 */
export async function atualizarPlano(
  id: string | number,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const dados = {
      nome: formData.get('nome') as string,
      descricao: formData.get('descricao') as string,
      preco: parseFloat(formData.get('preco') as string) || 0,
      periodicidade: formData.get('periodicidade') as string,
      recursos: formData.get('recursos') as string,
      limite_produtos: parseInt(formData.get('limite_produtos') as string) || null,
      limite_estabelecimentos: parseInt(formData.get('limite_estabelecimentos') as string) || null,
      status: parseInt(formData.get('status') as string) || 1,
      ordem: parseInt(formData.get('ordem') as string) || 0,
    };

    // Validar campos obrigatórios
    if (!dados.nome) {
      return { success: false, error: 'Nome é obrigatório' };
    }

    const { error } = await (supabase
      .from('planos') as any)
      .update(dados)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar plano:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/planos');
    return { success: true };
  } catch (error: any) {
    console.error('Erro:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Deleta um plano
 */
export async function deletarPlano(
  id: string | number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('planos')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/planos');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


