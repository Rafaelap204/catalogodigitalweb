/**
 * Server Actions para gerenciar subdomínios
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Subdominio {
  id: number;
  subdominio: string;
  tipo: number;
  rel_id: number | null;
  url: string | null;
  created_at?: string;
}

export interface ListarSubdominiosParams {
  pagina?: number;
  limite?: number;
  subdominio?: string;
  tipo?: number;
}

export interface ListarSubdominiosResult {
  subdominios: Subdominio[];
  total: number;
  paginas: number;
  paginaAtual: number;
}

const TIPOS_SUBDOMINIO: Record<number, string> = {
  1: 'Estabelecimento',
  2: 'Cidade',
  3: 'URL',
  4: 'Outro',
};

/**
 * Lista subdomínios com paginação e filtros
 */
export async function listarSubdominios(
  params: ListarSubdominiosParams = {}
): Promise<ListarSubdominiosResult> {
  try {
    const supabase = await createClient();
    
    const {
      pagina = 1,
      limite = 20,
      subdominio,
      tipo,
    } = params;

    const offset = (pagina - 1) * limite;

    let query = supabase
      .from('subdominios')
      .select('id, subdominio, tipo, rel_id, url, created_at', { count: 'exact' });

    if (subdominio) {
      query = query.ilike('subdominio', `${subdominio}%`);
    }
    
    if (tipo) {
      query = query.eq('tipo', tipo);
    }

    const { data, error, count } = await query
      .order('subdominio', { ascending: true })
      .range(offset, offset + limite - 1);

    if (error) {
      console.error('Erro ao listar subdomínios:', error);
      return {
        subdominios: [],
        total: 0,
        paginas: 0,
        paginaAtual: pagina,
      };
    }

    const total = count || 0;
    const paginas = Math.ceil(total / limite);

    return {
      subdominios: (data || []) as Subdominio[],
      total,
      paginas,
      paginaAtual: pagina,
    };
  } catch (error) {
    console.error('Erro:', error);
    return {
      subdominios: [],
      total: 0,
      paginas: 0,
      paginaAtual: 1,
    };
  }
}

/**
 * Busca um subdomínio por ID
 */
export async function buscarSubdominio(id: number): Promise<Subdominio | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('subdominios')
      .select('id, subdominio, tipo, rel_id, url, created_at')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar subdomínio:', error);
      return null;
    }

    return data as Subdominio;
  } catch (error) {
    console.error('Erro:', error);
    return null;
  }
}

/**
 * Cria um novo subdomínio
 */
export async function criarSubdominio(formData: FormData) {
  try {
    const supabase = await createClient();
    
    const subdominio = (formData.get('subdominio') as string)?.toLowerCase().trim();
    const tipo = parseInt(formData.get('tipo') as string);
    const rel_id = formData.get('rel_id') ? parseInt(formData.get('rel_id') as string) : null;
    const url = formData.get('url') as string;
    
    if (!subdominio || !tipo) {
      return { error: 'Subdomínio e tipo são obrigatórios' };
    }
    
    // Validações por tipo
    if (tipo === 1 && !rel_id) {
      return { error: 'Estabelecimento é obrigatório para tipo Estabelecimento' };
    }
    if (tipo === 2 && !rel_id) {
      return { error: 'Cidade é obrigatória para tipo Cidade' };
    }
    if ((tipo === 3 || tipo === 4) && !url) {
      return { error: 'URL é obrigatória para este tipo' };
    }

    const insertData = {
      subdominio,
      tipo,
      rel_id: tipo === 1 || tipo === 2 ? rel_id : null,
      url: tipo === 3 || tipo === 4 ? url : null,
    };

    const { data, error } = await supabase
      .from('subdominios' as any)
      .insert(insertData as any)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar subdomínio:', error);
      return { error: 'Erro ao criar subdomínio' };
    }

    revalidatePath('/administracao/subdominios');
    return { success: true, data };
  } catch (error) {
    console.error('Erro:', error);
    return { error: 'Erro ao criar subdomínio' };
  }
}

/**
 * Atualiza um subdomínio
 */
export async function atualizarSubdominio(id: number, formData: FormData) {
  try {
    const supabase = await createClient();
    
    const subdominio = (formData.get('subdominio') as string)?.toLowerCase().trim();
    const tipo = parseInt(formData.get('tipo') as string);
    const rel_id = formData.get('rel_id') ? parseInt(formData.get('rel_id') as string) : null;
    const url = formData.get('url') as string;
    
    if (!subdominio || !tipo) {
      return { error: 'Subdomínio e tipo são obrigatórios' };
    }
    
    if (tipo === 1 && !rel_id) {
      return { error: 'Estabelecimento é obrigatório para tipo Estabelecimento' };
    }
    if (tipo === 2 && !rel_id) {
      return { error: 'Cidade é obrigatória para tipo Cidade' };
    }
    if ((tipo === 3 || tipo === 4) && !url) {
      return { error: 'URL é obrigatória para este tipo' };
    }

    const updateData = {
      subdominio,
      tipo,
      rel_id: tipo === 1 || tipo === 2 ? rel_id : null,
      url: tipo === 3 || tipo === 4 ? url : null,
    };

    const { data, error } = await supabase
      .from('subdominios' as any)
      .update(updateData as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar subdomínio:', error);
      return { error: 'Erro ao atualizar subdomínio' };
    }

    revalidatePath('/administracao/subdominios');
    return { success: true, data };
  } catch (error) {
    console.error('Erro:', error);
    return { error: 'Erro ao atualizar subdomínio' };
  }
}

/**
 * Deleta um subdomínio
 */
export async function deletarSubdominio(id: number) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('subdominios')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar subdomínio:', error);
      return { error: 'Erro ao deletar subdomínio' };
    }

    revalidatePath('/administracao/subdominios');
    return { success: true };
  } catch (error) {
    console.error('Erro:', error);
    return { error: 'Erro ao deletar subdomínio' };
  }
}

/**
 * Lista todos os subdomínios (para selects)
 */
export async function listarTodosSubdominios(): Promise<Subdominio[]> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('subdominios')
      .select('id, subdominio, tipo, rel_id, url, created_at')
      .order('subdominio', { ascending: true });

    if (error) {
      console.error('Erro ao listar subdomínios:', error);
      return [];
    }

    return (data || []) as Subdominio[];
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
}

export async function getTipoSubdominioLabel(tipo: number): Promise<string> {
  return TIPOS_SUBDOMINIO[tipo] || 'Desconhecido';
}
