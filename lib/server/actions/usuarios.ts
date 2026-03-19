/**
 * Server Actions para gerenciar usuários
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Usuario {
  id?: string | number;
  nome: string;
  email: string;
  telefone?: string;
  nivel: number;
  status: number;
  avatar?: string;
  estabelecimento_id?: string | number;
  afiliado_id?: string | number;
  created?: string;
  lastlogin?: string;
}

export interface ListarUsuariosParams {
  pagina?: number;
  limite?: number;
  nome?: string;
  email?: string;
  nivel?: number;
  status?: number;
}

export interface ListarUsuariosResult {
  usuarios: Usuario[];
  total: number;
  paginas: number;
  paginaAtual: number;
}

/**
 * Lista usuários com paginação e filtros
 */
export async function listarUsuarios(
  params: ListarUsuariosParams = {}
): Promise<ListarUsuariosResult> {
  try {
    const supabase = await createClient();
    
    const {
      pagina = 1,
      limite = 20,
      nome,
      email,
      nivel,
      status,
    } = params;

    // Calcular offset
    const offset = (pagina - 1) * limite;

    // Query base - REMOVIDO telefone pois coluna nao existe no banco
    let query = supabase
      .from('users')
      .select('id, nome, email, nivel, status, avatar, estabelecimento_id, afiliado_id, created, lastlogin', { count: 'exact' });

    // Aplicar filtros
    if (nome) {
      query = query.ilike('nome', `%${nome}%`);
    }

    if (email) {
      query = query.ilike('email', `%${email}%`);
    }

    if (nivel !== undefined) {
      query = query.eq('nivel', nivel);
    }

    if (status !== undefined) {
      query = query.eq('status', status);
    }

    // Ordenar e paginar
    const { data, error, count } = await query
      .order('created', { ascending: false })
      .range(offset, offset + limite - 1);

    if (error) {
      console.error('Erro ao listar usuários:', error);
      return {
        usuarios: [],
        total: 0,
        paginas: 0,
        paginaAtual: pagina,
      };
    }

    const total = count || 0;
    const paginas = Math.ceil(total / limite);

    return {
      usuarios: (data || []) as Usuario[],
      total,
      paginas,
      paginaAtual: pagina,
    };
  } catch (error) {
    console.error('Erro:', error);
    return {
      usuarios: [],
      total: 0,
      paginas: 0,
      paginaAtual: 1,
    };
  }
}

/**
 * Busca um usuário por ID
 */
export async function buscarUsuario(
  id: string | number
): Promise<Usuario | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Usuario;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
}

/**
 * Salva um novo usuário
 */
export async function salvarUsuario(
  formData: FormData
): Promise<{ success: boolean; error?: string; id?: string | number }> {
  try {
    const supabase = await createClient();

    const dados = {
      nome: formData.get('nome') as string,
      email: formData.get('email') as string,
      senha: formData.get('senha') as string, // Será tratado como MD5 no banco
      telefone: formData.get('telefone') as string,
      nivel: parseInt(formData.get('nivel') as string) || 3,
      status: parseInt(formData.get('status') as string) || 1,
      estabelecimento_id: formData.get('estabelecimento_id') as string,
      afiliado_id: formData.get('afiliado_id') as string,
      avatar: formData.get('avatar') as string,
    };

    // Validar campos obrigatórios
    if (!dados.nome) {
      return { success: false, error: 'Nome é obrigatório' };
    }

    if (!dados.email) {
      return { success: false, error: 'Email é obrigatório' };
    }

    if (!dados.senha) {
      return { success: false, error: 'Senha é obrigatória' };
    }

    const { data, error } = await (supabase
      .from('users') as any)
      .insert([dados])
      .select('id')
      .single();

    if (error) {
      console.error('Erro ao salvar usuário:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/usuarios');
    return { success: true, id: data?.id };
  } catch (error: any) {
    console.error('Erro:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Atualiza um usuário existente
 */
export async function atualizarUsuario(
  id: string | number,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const dados: any = {
      nome: formData.get('nome') as string,
      email: formData.get('email') as string,
      telefone: formData.get('telefone') as string,
      nivel: parseInt(formData.get('nivel') as string) || 3,
      status: parseInt(formData.get('status') as string) || 1,
      estabelecimento_id: formData.get('estabelecimento_id') as string,
      afiliado_id: formData.get('afiliado_id') as string,
      avatar: formData.get('avatar') as string,
    };

    // Se senha foi informada, incluir na atualização
    const senha = formData.get('senha') as string;
    if (senha) {
      dados.senha = senha;
    }

    // Validar campos obrigatórios
    if (!dados.nome) {
      return { success: false, error: 'Nome é obrigatório' };
    }

    if (!dados.email) {
      return { success: false, error: 'Email é obrigatório' };
    }

    const { error } = await (supabase
      .from('users') as any)
      .update(dados)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar usuário:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/usuarios');
    return { success: true };
  } catch (error: any) {
    console.error('Erro:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Deleta um usuário
 */
export async function deletarUsuario(
  id: string | number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/usuarios');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


