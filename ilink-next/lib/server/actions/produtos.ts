/**
 * Server Actions para gerenciar produtos
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Produto {
  id?: string | number;
  estabelecimento_id?: string | number;
  categoria_id?: string | number;
  nome: string;
  descricao?: string;
  preco: number;
  preco_promocional?: number;
  imagem?: string;
  status: number;
  destaque?: number;
  ordem?: number;
  created?: string;
}

export interface ListarProdutosParams {
  pagina?: number;
  limite?: number;
  nome?: string;
  estabelecimento_id?: string | number;
  categoria_id?: string | number;
  status?: number;
}

export interface ListarProdutosResult {
  produtos: Produto[];
  total: number;
  paginas: number;
  paginaAtual: number;
}

/**
 * Lista produtos com paginação e filtros
 */
export async function listarProdutos(
  params: ListarProdutosParams = {}
): Promise<ListarProdutosResult> {
  try {
    const supabase = await createClient();
    
    const {
      pagina = 1,
      limite = 20,
      nome,
      estabelecimento_id,
      categoria_id,
      status,
    } = params;

    // Calcular offset
    const offset = (pagina - 1) * limite;

    // Query base
    let query = supabase
      .from('produtos')
      .select('id, estabelecimento_id, categoria_id, nome, preco, preco_promocional, imagem, status, destaque, created', { count: 'exact' });

    // Aplicar filtros
    if (nome) {
      query = query.ilike('nome', `%${nome}%`);
    }

    if (estabelecimento_id) {
      query = query.eq('estabelecimento_id', estabelecimento_id);
    }

    if (categoria_id) {
      query = query.eq('categoria_id', categoria_id);
    }

    if (status !== undefined) {
      query = query.eq('status', status);
    }

    // Ordenar e paginar
    const { data, error, count } = await query
      .order('created', { ascending: false })
      .range(offset, offset + limite - 1);

    if (error) {
      console.error('Erro ao listar produtos:', error);
      return {
        produtos: [],
        total: 0,
        paginas: 0,
        paginaAtual: pagina,
      };
    }

    const total = count || 0;
    const paginas = Math.ceil(total / limite);

    return {
      produtos: (data || []) as Produto[],
      total,
      paginas,
      paginaAtual: pagina,
    };
  } catch (error) {
    console.error('Erro:', error);
    return {
      produtos: [],
      total: 0,
      paginas: 0,
      paginaAtual: 1,
    };
  }
}

/**
 * Busca um produto por ID
 */
export async function buscarProduto(
  id: string | number
): Promise<Produto | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Produto;
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return null;
  }
}

/**
 * Salva um novo produto
 */
export async function salvarProduto(
  formData: FormData
): Promise<{ success: boolean; error?: string; id?: string | number }> {
  try {
    const supabase = await createClient();

    const dados = {
      estabelecimento_id: formData.get('estabelecimento_id') as string,
      categoria_id: formData.get('categoria_id') as string,
      nome: formData.get('nome') as string,
      descricao: formData.get('descricao') as string,
      preco: parseFloat(formData.get('preco') as string) || 0,
      preco_promocional: parseFloat(formData.get('preco_promocional') as string) || null,
      imagem: formData.get('imagem') as string,
      status: parseInt(formData.get('status') as string) || 1,
      destaque: parseInt(formData.get('destaque') as string) || 0,
      ordem: parseInt(formData.get('ordem') as string) || 0,
    };

    // Validar campos obrigatórios
    if (!dados.nome) {
      return { success: false, error: 'Nome é obrigatório' };
    }

    if (!dados.estabelecimento_id) {
      return { success: false, error: 'Estabelecimento é obrigatório' };
    }

    const { data, error } = await (supabase
      .from('produtos') as any)
      .insert([dados])
      .select('id')
      .single();

    if (error) {
      console.error('Erro ao salvar produto:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/produtos');
    return { success: true, id: data?.id };
  } catch (error: any) {
    console.error('Erro:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Atualiza um produto existente
 */
export async function atualizarProduto(
  id: string | number,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const dados = {
      estabelecimento_id: formData.get('estabelecimento_id') as string,
      categoria_id: formData.get('categoria_id') as string,
      nome: formData.get('nome') as string,
      descricao: formData.get('descricao') as string,
      preco: parseFloat(formData.get('preco') as string) || 0,
      preco_promocional: parseFloat(formData.get('preco_promocional') as string) || null,
      imagem: formData.get('imagem') as string,
      status: parseInt(formData.get('status') as string) || 1,
      destaque: parseInt(formData.get('destaque') as string) || 0,
      ordem: parseInt(formData.get('ordem') as string) || 0,
    };

    // Validar campos obrigatórios
    if (!dados.nome) {
      return { success: false, error: 'Nome é obrigatório' };
    }

    if (!dados.estabelecimento_id) {
      return { success: false, error: 'Estabelecimento é obrigatório' };
    }

    const { error } = await (supabase
      .from('produtos') as any)
      .update(dados)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar produto:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/produtos');
    return { success: true };
  } catch (error: any) {
    console.error('Erro:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Deleta um produto
 */
export async function deletarProduto(
  id: string | number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/produtos');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
