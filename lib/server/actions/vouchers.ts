/**
 * Server Actions para gerenciar vouchers
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Voucher {
  id: number;
  plano: number;
  codigo: string;
  desconto: number;
  descricao: string;
  usos: number;
  status: number;
  validade: string | null;
  created_at?: string;
}

export interface ListarVouchersParams {
  pagina?: number;
  limite?: number;
  codigo?: string;
  descricao?: string;
  status?: number;
}

export interface ListarVouchersResult {
  vouchers: Voucher[];
  total: number;
  paginas: number;
  paginaAtual: number;
}

/**
 * Lista vouchers com paginação e filtros
 */
export async function listarVouchers(
  params: ListarVouchersParams = {}
): Promise<ListarVouchersResult> {
  try {
    const supabase = await createClient();
    
    const {
      pagina = 1,
      limite = 20,
      codigo,
      descricao,
      status,
    } = params;

    const offset = (pagina - 1) * limite;

    let query = supabase
      .from('vouchers')
      .select('id, plano, codigo, desconto, descricao, usos, status, validade, created_at', { count: 'exact' });

    if (codigo) {
      query = query.eq('codigo', codigo);
    }
    
    if (descricao) {
      query = query.ilike('descricao', `${descricao}%`);
    }
    
    if (status !== undefined) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query
      .order('id', { ascending: false })
      .range(offset, offset + limite - 1);

    if (error) {
      console.error('Erro ao listar vouchers:', error);
      return {
        vouchers: [],
        total: 0,
        paginas: 0,
        paginaAtual: pagina,
      };
    }

    const total = count || 0;
    const paginas = Math.ceil(total / limite);

    return {
      vouchers: (data || []) as Voucher[],
      total,
      paginas,
      paginaAtual: pagina,
    };
  } catch (error) {
    console.error('Erro:', error);
    return {
      vouchers: [],
      total: 0,
      paginas: 0,
      paginaAtual: 1,
    };
  }
}

/**
 * Busca um voucher por ID
 */
export async function buscarVoucher(id: number): Promise<Voucher | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('vouchers')
      .select('id, plano, codigo, desconto, descricao, usos, status, validade, created_at')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar voucher:', error);
      return null;
    }

    return data as Voucher;
  } catch (error) {
    console.error('Erro:', error);
    return null;
  }
}

/**
 * Gera um código aleatório para o voucher
 */
function gerarCodigoVoucher(): string {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = '';
  for (let i = 0; i < 8; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigo;
}

/**
 * Cria um novo voucher
 */
export async function criarVoucher(formData: FormData) {
  try {
    const supabase = await createClient();
    
    const plano = parseInt(formData.get('plano') as string);
    const desconto = parseFloat(formData.get('desconto') as string) || 0;
    const descricao = formData.get('descricao') as string;
    const validade = formData.get('validade') as string;
    const codigo = gerarCodigoVoucher();
    
    if (!plano || !descricao) {
      return { error: 'Plano e descrição são obrigatórios' };
    }

    const insertData = {
      plano,
      codigo,
      desconto,
      descricao: descricao.trim(),
      usos: 0,
      status: 1,
      validade: validade || null,
    };

    const { data, error } = await supabase
      .from('vouchers' as any)
      .insert(insertData as any)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar voucher:', error);
      return { error: 'Erro ao criar voucher' };
    }

    revalidatePath('/administracao/vouchers');
    return { success: true, data };
  } catch (error) {
    console.error('Erro:', error);
    return { error: 'Erro ao criar voucher' };
  }
}

/**
 * Atualiza um voucher
 */
export async function atualizarVoucher(id: number, formData: FormData) {
  try {
    const supabase = await createClient();
    
    const plano = parseInt(formData.get('plano') as string);
    const desconto = parseFloat(formData.get('desconto') as string) || 0;
    const descricao = formData.get('descricao') as string;
    const status = parseInt(formData.get('status') as string);
    const validade = formData.get('validade') as string;
    
    if (!plano || !descricao) {
      return { error: 'Plano e descrição são obrigatórios' };
    }

    const updateData = {
      plano,
      desconto,
      descricao: descricao.trim(),
      status,
      validade: validade || null,
    };

    const { data, error } = await supabase
      .from('vouchers' as any)
      .update(updateData as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar voucher:', error);
      return { error: 'Erro ao atualizar voucher' };
    }

    revalidatePath('/administracao/vouchers');
    return { success: true, data };
  } catch (error) {
    console.error('Erro:', error);
    return { error: 'Erro ao atualizar voucher' };
  }
}

/**
 * Deleta um voucher
 */
export async function deletarVoucher(id: number) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('vouchers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar voucher:', error);
      return { error: 'Erro ao deletar voucher' };
    }

    revalidatePath('/administracao/vouchers');
    return { success: true };
  } catch (error) {
    console.error('Erro:', error);
    return { error: 'Erro ao deletar voucher' };
  }
}
