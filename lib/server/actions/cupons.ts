/**
 * Server Actions para gerenciar cupons
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Cupom {
  id?: string | number;
  codigo: string;
  tipo: string;
  valor: number;
  valor_minimo?: number;
  limite_uso?: number;
  usos?: number;
  data_inicio?: string;
  data_fim?: string;
  estabelecimento_id?: string | number;
  status: number;
  created?: string;
}

export interface ListarCuponsParams {
  pagina?: number;
  limite?: number;
  codigo?: string;
  estabelecimento_id?: string | number;
  status?: number;
}

export interface ListarCuponsResult {
  cupons: Cupom[];
  total: number;
  paginas: number;
  paginaAtual: number;
}

/**
 * Lista cupons com paginação e filtros
 */
export async function listarCupons(
  params: ListarCuponsParams = {}
): Promise<ListarCuponsResult> {
  try {
    const supabase = await createClient();
    
    const {
      pagina = 1,
      limite = 20,
      codigo,
      estabelecimento_id,
      status,
    } = params;

    const offset = (pagina - 1) * limite;

    let query = supabase
      .from('cupons')
      .select('id, codigo, tipo, valor, valor_minimo, limite_uso, usos, data_inicio, data_fim, estabelecimento_id, status, created', { count: 'exact' });

    if (codigo) {
      query = query.ilike('codigo', `%${codigo}%`);
    }

    if (estabelecimento_id) {
      query = query.eq('estabelecimento_id', estabelecimento_id);
    }

    if (status !== undefined) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query
      .order('created', { ascending: false })
      .range(offset, offset + limite - 1);

    if (error) {
      console.error('Erro ao listar cupons:', error);
      return { cupons: [], total: 0, paginas: 0, paginaAtual: pagina };
    }

    const total = count || 0;
    const paginas = Math.ceil(total / limite);

    return {
      cupons: (data || []) as Cupom[],
      total,
      paginas,
      paginaAtual: pagina,
    };
  } catch (error) {
    console.error('Erro:', error);
    return { cupons: [], total: 0, paginas: 0, paginaAtual: 1 };
  }
}

/**
 * Busca um cupom por ID
 */
export async function buscarCupom(id: string | number): Promise<Cupom | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('cupons').select('*').eq('id', id).single();
    if (error || !data) return null;
    return data as Cupom;
  } catch (error) {
    console.error('Erro ao buscar cupom:', error);
    return null;
  }
}

/**
 * Busca um cupom por código
 */
export async function buscarCupomPorCodigo(codigo: string): Promise<Cupom | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('cupons').select('*').eq('codigo', codigo).single();
    if (error || !data) return null;
    return data as Cupom;
  } catch (error) {
    console.error('Erro ao buscar cupom:', error);
    return null;
  }
}

/**
 * Salva um novo cupom
 */
export async function salvarCupom(formData: FormData): Promise<{ success: boolean; error?: string; id?: string | number }> {
  try {
    const supabase = await createClient();

    const dados = {
      codigo: (formData.get('codigo') as string).toUpperCase(),
      tipo: formData.get('tipo') as string,
      valor: parseFloat(formData.get('valor') as string) || 0,
      valor_minimo: parseFloat(formData.get('valor_minimo') as string) || null,
      limite_uso: parseInt(formData.get('limite_uso') as string) || null,
      usos: 0,
      data_inicio: formData.get('data_inicio') as string,
      data_fim: formData.get('data_fim') as string,
      estabelecimento_id: formData.get('estabelecimento_id') as string,
      status: parseInt(formData.get('status') as string) || 1,
    };

    if (!dados.codigo) {
      return { success: false, error: 'Código é obrigatório' };
    }

    // Verificar se código já existe
    const existente = await buscarCupomPorCodigo(dados.codigo);
    if (existente) {
      return { success: false, error: 'Código já cadastrado' };
    }

    const { data, error } = await (supabase.from('cupons') as any).insert([dados]).select('id').single();

    if (error) {
      console.error('Erro ao salvar cupom:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/cupons');
    return { success: true, id: data?.id };
  } catch (error: any) {
    console.error('Erro:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Atualiza um cupom existente
 */
export async function atualizarCupom(id: string | number, formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const dados = {
      codigo: (formData.get('codigo') as string).toUpperCase(),
      tipo: formData.get('tipo') as string,
      valor: parseFloat(formData.get('valor') as string) || 0,
      valor_minimo: parseFloat(formData.get('valor_minimo') as string) || null,
      limite_uso: parseInt(formData.get('limite_uso') as string) || null,
      data_inicio: formData.get('data_inicio') as string,
      data_fim: formData.get('data_fim') as string,
      estabelecimento_id: formData.get('estabelecimento_id') as string,
      status: parseInt(formData.get('status') as string) || 1,
    };

    if (!dados.codigo) {
      return { success: false, error: 'Código é obrigatório' };
    }

    const { error } = await (supabase.from('cupons') as any).update(dados).eq('id', id);

    if (error) {
      console.error('Erro ao atualizar cupom:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/cupons');
    return { success: true };
  } catch (error: any) {
    console.error('Erro:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Deleta um cupom
 */
export async function deletarCupom(id: string | number): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('cupons').delete().eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/cupons');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


