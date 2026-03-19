/**
 * Server Actions para gerenciar cidades
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Cidade {
  id: number;
  estado: number;
  nome: string;
  estado_nome?: string;
  estado_uf?: string;
}

export interface ListarCidadesParams {
  pagina?: number;
  limite?: number;
  nome?: string;
  estado?: number;
}

export interface ListarCidadesResult {
  cidades: Cidade[];
  total: number;
  paginas: number;
  paginaAtual: number;
}

/**
 * Lista cidades com paginação e filtros
 */
export async function listarCidades(
  params: ListarCidadesParams = {}
): Promise<ListarCidadesResult> {
  try {
    const supabase = await createClient();
    
    const {
      pagina = 1,
      limite = 20,
      nome,
      estado,
    } = params;

    const offset = (pagina - 1) * limite;

    let query = supabase
      .from('cidades')
      .select('id, estado, nome, estados(nome, uf)', { count: 'exact' });

    if (nome) {
      query = query.ilike('nome', `${nome}%`);
    }
    
    if (estado) {
      query = query.eq('estado', estado);
    }

    const { data, error, count } = await query
      .order('nome', { ascending: true })
      .range(offset, offset + limite - 1);

    if (error) {
      console.error('Erro ao listar cidades:', error);
      return {
        cidades: [],
        total: 0,
        paginas: 0,
        paginaAtual: pagina,
      };
    }

    const total = count || 0;
    const paginas = Math.ceil(total / limite);
    
    // Transformar dados para incluir info do estado
    const cidades = (data || []).map((item: any) => ({
      id: item.id,
      estado: item.estado,
      nome: item.nome,
      estado_nome: item.estados?.nome,
      estado_uf: item.estados?.uf,
    }));

    return {
      cidades,
      total,
      paginas,
      paginaAtual: pagina,
    };
  } catch (error) {
    console.error('Erro:', error);
    return {
      cidades: [],
      total: 0,
      paginas: 0,
      paginaAtual: 1,
    };
  }
}

/**
 * Busca uma cidade por ID
 */
export async function buscarCidade(id: number): Promise<Cidade | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('cidades')
      .select('id, estado, nome, estados(nome, uf)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar cidade:', error);
      return null;
    }

    return {
      id: data.id,
      estado: data.estado,
      nome: data.nome,
      estado_nome: data.estados?.nome,
      estado_uf: data.estados?.uf,
    } as Cidade;
  } catch (error) {
    console.error('Erro:', error);
    return null;
  }
}

/**
 * Cria uma nova cidade
 */
export async function criarCidade(formData: FormData) {
  try {
    const supabase = await createClient();
    
    const estado = parseInt(formData.get('estado') as string);
    const nome = formData.get('nome') as string;
    
    if (!estado || !nome) {
      return { error: 'Estado e nome são obrigatórios' };
    }

    const insertData = {
      estado,
      nome: nome.trim(),
    };

    const { data, error } = await supabase
      .from('cidades' as any)
      .insert(insertData as any)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar cidade:', error);
      return { error: 'Erro ao criar cidade' };
    }

    revalidatePath('/administracao/cidades');
    return { success: true, data };
  } catch (error) {
    console.error('Erro:', error);
    return { error: 'Erro ao criar cidade' };
  }
}

/**
 * Atualiza uma cidade
 */
export async function atualizarCidade(id: number, formData: FormData) {
  try {
    const supabase = await createClient();
    
    const estado = parseInt(formData.get('estado') as string);
    const nome = formData.get('nome') as string;
    
    if (!estado || !nome) {
      return { error: 'Estado e nome são obrigatórios' };
    }

    const updateData = {
      estado,
      nome: nome.trim(),
    };

    const { data, error } = await supabase
      .from('cidades' as any)
      .update(updateData as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar cidade:', error);
      return { error: 'Erro ao atualizar cidade' };
    }

    revalidatePath('/administracao/cidades');
    return { success: true, data };
  } catch (error) {
    console.error('Erro:', error);
    return { error: 'Erro ao atualizar cidade' };
  }
}

/**
 * Deleta uma cidade
 */
export async function deletarCidade(id: number) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('cidades')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar cidade:', error);
      return { error: 'Erro ao deletar cidade' };
    }

    revalidatePath('/administracao/cidades');
    return { success: true };
  } catch (error) {
    console.error('Erro:', error);
    return { error: 'Erro ao deletar cidade' };
  }
}

/**
 * Lista todas as cidades (para selects)
 */
export async function listarTodasCidades(estadoId?: number): Promise<Cidade[]> {
  try {
    const supabase = await createClient();
    
    let query = supabase
      .from('cidades')
      .select('id, estado, nome, estados(nome, uf)')
      .order('nome', { ascending: true });
    
    if (estadoId) {
      query = query.eq('estado', estadoId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao listar cidades:', error);
      return [];
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      estado: item.estado,
      nome: item.nome,
      estado_nome: item.estados?.nome,
      estado_uf: item.estados?.uf,
    })) as Cidade[];
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
}
