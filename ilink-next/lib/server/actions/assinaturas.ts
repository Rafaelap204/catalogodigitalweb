/**
 * Server Actions para gerenciar assinaturas
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Assinatura {
  id?: string | number;
  estabelecimento_id?: string | number;
  plano_id?: string | number;
  valor: number;
  status: string;
  data_inicio?: string;
  data_fim?: string;
  data_cancelamento?: string;
  forma_pagamento?: string;
  transacao_id?: string;
  renovacao_automatica?: number;
  created?: string;
}

export interface ListarAssinaturasParams {
  pagina?: number;
  limite?: number;
  estabelecimento_id?: string | number;
  plano_id?: string | number;
  status?: string;
}

export interface ListarAssinaturasResult {
  assinaturas: Assinatura[];
  total: number;
  paginas: number;
  paginaAtual: number;
}

/**
 * Lista assinaturas com paginação e filtros
 */
export async function listarAssinaturas(
  params: ListarAssinaturasParams = {}
): Promise<ListarAssinaturasResult> {
  try {
    const supabase = await createClient();
    
    const {
      pagina = 1,
      limite = 20,
      estabelecimento_id,
      plano_id,
      status,
    } = params;

    // Calcular offset
    const offset = (pagina - 1) * limite;

    // Query base
    let query = supabase
      .from('assinaturas')
      .select('id, estabelecimento_id, plano_id, valor, status, data_inicio, data_fim, data_cancelamento, forma_pagamento, renovacao_automatica, created', { count: 'exact' });

    // Aplicar filtros
    if (estabelecimento_id) {
      query = query.eq('estabelecimento_id', estabelecimento_id);
    }

    if (plano_id) {
      query = query.eq('plano_id', plano_id);
    }

    if (status) {
      query = query.eq('status', status);
    }

    // Ordenar e paginar
    const { data, error, count } = await query
      .order('created', { ascending: false })
      .range(offset, offset + limite - 1);

    if (error) {
      console.error('Erro ao listar assinaturas:', error);
      return {
        assinaturas: [],
        total: 0,
        paginas: 0,
        paginaAtual: pagina,
      };
    }

    const total = count || 0;
    const paginas = Math.ceil(total / limite);

    return {
      assinaturas: (data || []) as Assinatura[],
      total,
      paginas,
      paginaAtual: pagina,
    };
  } catch (error) {
    console.error('Erro:', error);
    return {
      assinaturas: [],
      total: 0,
      paginas: 0,
      paginaAtual: 1,
    };
  }
}

/**
 * Busca uma assinatura por ID
 */
export async function buscarAssinatura(
  id: string | number
): Promise<Assinatura | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('assinaturas')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Assinatura;
  } catch (error) {
    console.error('Erro ao buscar assinatura:', error);
    return null;
  }
}

/**
 * Salva uma nova assinatura
 */
export async function salvarAssinatura(
  formData: FormData
): Promise<{ success: boolean; error?: string; id?: string | number }> {
  try {
    const supabase = await createClient();

    const dados = {
      estabelecimento_id: formData.get('estabelecimento_id') as string,
      plano_id: formData.get('plano_id') as string,
      valor: parseFloat(formData.get('valor') as string) || 0,
      status: formData.get('status') as string,
      data_inicio: formData.get('data_inicio') as string,
      data_fim: formData.get('data_fim') as string,
      forma_pagamento: formData.get('forma_pagamento') as string,
      transacao_id: formData.get('transacao_id') as string,
      renovacao_automatica: parseInt(formData.get('renovacao_automatica') as string) || 0,
    };

    // Validar campos obrigatórios
    if (!dados.estabelecimento_id) {
      return { success: false, error: 'Estabelecimento é obrigatório' };
    }

    if (!dados.plano_id) {
      return { success: false, error: 'Plano é obrigatório' };
    }

    const { data, error } = await (supabase
      .from('assinaturas') as any)
      .insert([dados])
      .select('id')
      .single();

    if (error) {
      console.error('Erro ao salvar assinatura:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/assinaturas');
    return { success: true, id: data?.id };
  } catch (error: any) {
    console.error('Erro:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Atualiza uma assinatura existente
 */
export async function atualizarAssinatura(
  id: string | number,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const dados = {
      estabelecimento_id: formData.get('estabelecimento_id') as string,
      plano_id: formData.get('plano_id') as string,
      valor: parseFloat(formData.get('valor') as string) || 0,
      status: formData.get('status') as string,
      data_inicio: formData.get('data_inicio') as string,
      data_fim: formData.get('data_fim') as string,
      forma_pagamento: formData.get('forma_pagamento') as string,
      transacao_id: formData.get('transacao_id') as string,
      renovacao_automatica: parseInt(formData.get('renovacao_automatica') as string) || 0,
    };

    // Validar campos obrigatórios
    if (!dados.estabelecimento_id) {
      return { success: false, error: 'Estabelecimento é obrigatório' };
    }

    if (!dados.plano_id) {
      return { success: false, error: 'Plano é obrigatório' };
    }

    const { error } = await (supabase
      .from('assinaturas') as any)
      .update(dados)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar assinatura:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/assinaturas');
    return { success: true };
  } catch (error: any) {
    console.error('Erro:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Deleta uma assinatura
 */
export async function deletarAssinatura(
  id: string | number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('assinaturas')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/assinaturas');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


