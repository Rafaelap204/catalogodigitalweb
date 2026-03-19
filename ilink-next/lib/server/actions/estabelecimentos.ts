/**
 * Server Actions para gerenciar estabelecimentos
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Estabelecimento {
  id?: string | number;
  nome: string;
  perfil?: string;
  descricao?: string;
  cidade?: string;
  estado?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cep?: string;
  telefone?: string;
  email?: string;
  subdominio?: string;
  logo?: string;
  capa?: string;
  cor_primaria?: string;
  cor_secundaria?: string;
  afiliado?: string;
  status: number;
  excluded?: number;
  created?: string;
}

export interface ListarEstabelecimentosParams {
  pagina?: number;
  limite?: number;
  nome?: string;
  subdominio?: string;
  estado?: string;
  cidade?: string;
  afiliado?: string;
  excluded?: string;
}

export interface ListarEstabelecimentosResult {
  estabelecimentos: Estabelecimento[];
  total: number;
  paginas: number;
  paginaAtual: number;
}

/**
 * Lista estabelecimentos com paginação e filtros
 */
export async function listarEstabelecimentos(
  params: ListarEstabelecimentosParams = {}
): Promise<ListarEstabelecimentosResult> {
  try {
    const supabase = await createClient();
    
    const {
      pagina = 1,
      limite = 20,
      nome,
      subdominio,
      estado,
      cidade,
      afiliado,
      excluded,
    } = params;

    // Calcular offset
    const offset = (pagina - 1) * limite;

    // Query base
    let query = supabase
      .from('estabelecimentos')
      .select('id, nome, perfil, cidade, estado, status, excluded, subdominio, afiliado, created', { count: 'exact' });

    // Aplicar filtros
    if (nome) {
      query = query.ilike('nome', `%${nome}%`);
    }

    if (subdominio) {
      query = query.ilike('subdominio', `%${subdominio}%`);
    }

    if (estado) {
      query = query.eq('estado', estado);
    }

    if (cidade) {
      query = query.eq('cidade', cidade);
    }

    if (afiliado) {
      query = query.eq('afiliado', afiliado);
    }

    if (excluded) {
      query = query.eq('excluded', excluded);
    } else {
      query = query.neq('excluded', 1);
    }

    // Ordenar e paginar
    const { data, error, count } = await query
      .order('created', { ascending: false })
      .range(offset, offset + limite - 1);

    if (error) {
      console.error('Erro ao listar estabelecimentos:', error);
      return {
        estabelecimentos: [],
        total: 0,
        paginas: 0,
        paginaAtual: pagina,
      };
    }

    const total = count || 0;
    const paginas = Math.ceil(total / limite);

    return {
      estabelecimentos: (data || []) as Estabelecimento[],
      total,
      paginas,
      paginaAtual: pagina,
    };
  } catch (error) {
    console.error('Erro:', error);
    return {
      estabelecimentos: [],
      total: 0,
      paginas: 0,
      paginaAtual: 1,
    };
  }
}

/**
 * Busca um estabelecimento por ID
 */
export async function buscarEstabelecimento(
  id: string | number
): Promise<Estabelecimento | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('estabelecimentos')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Estabelecimento;
  } catch (error) {
    console.error('Erro ao buscar estabelecimento:', error);
    return null;
  }
}

/**
 * Salva um novo estabelecimento
 */
export async function salvarEstabelecimento(
  formData: FormData
): Promise<{ success: boolean; error?: string; id?: string | number }> {
  try {
    const supabase = await createClient();

    const dados = {
      nome: formData.get('nome') as string,
      perfil: formData.get('perfil') as string,
      descricao: formData.get('descricao') as string,
      cidade: formData.get('cidade') as string,
      estado: formData.get('estado') as string,
      endereco: formData.get('endereco') as string,
      numero: formData.get('numero') as string,
      complemento: formData.get('complemento') as string,
      bairro: formData.get('bairro') as string,
      cep: formData.get('cep') as string,
      telefone: formData.get('telefone') as string,
      email: formData.get('email') as string,
      subdominio: formData.get('subdominio') as string,
      afiliado: formData.get('afiliado') as string,
      cor_primaria: formData.get('cor_primaria') as string,
      cor_secundaria: formData.get('cor_secundaria') as string,
      status: parseInt(formData.get('status') as string) || 1,
    };

    // Validar campos obrigatórios
    if (!dados.nome) {
      return { success: false, error: 'Nome é obrigatório' };
    }

    const { data, error } = await (supabase
      .from('estabelecimentos') as any)
      .insert([dados])
      .select('id')
      .single();

    if (error) {
      console.error('Erro ao salvar estabelecimento:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/estabelecimentos');
    return { success: true, id: data?.id };
  } catch (error: any) {
    console.error('Erro:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Atualiza um estabelecimento existente
 */
export async function atualizarEstabelecimento(
  id: string | number,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const dados = {
      nome: formData.get('nome') as string,
      perfil: formData.get('perfil') as string,
      descricao: formData.get('descricao') as string,
      cidade: formData.get('cidade') as string,
      estado: formData.get('estado') as string,
      endereco: formData.get('endereco') as string,
      numero: formData.get('numero') as string,
      complemento: formData.get('complemento') as string,
      bairro: formData.get('bairro') as string,
      cep: formData.get('cep') as string,
      telefone: formData.get('telefone') as string,
      email: formData.get('email') as string,
      subdominio: formData.get('subdominio') as string,
      afiliado: formData.get('afiliado') as string,
      cor_primaria: formData.get('cor_primaria') as string,
      cor_secundaria: formData.get('cor_secundaria') as string,
      status: parseInt(formData.get('status') as string) || 1,
    };

    // Validar campos obrigatórios
    if (!dados.nome) {
      return { success: false, error: 'Nome é obrigatório' };
    }

    const { error } = await (supabase
      .from('estabelecimentos') as any)
      .update(dados)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar estabelecimento:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/estabelecimentos');
    revalidatePath(`/administracao/estabelecimentos/editar?id=${id}`);
    return { success: true };
  } catch (error: any) {
    console.error('Erro:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Deleta um estabelecimento
 */
export async function deletarEstabelecimento(
  id: string | number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('estabelecimentos')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/estabelecimentos');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
