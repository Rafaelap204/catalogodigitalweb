'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export interface CaptarEstabelecimento {
  id: number;
  nome: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  telefone?: string;
  email?: string;
  responsavel?: string;
  telefone_responsavel?: string;
  email_responsavel?: string;
  status: string;
  latitude?: number;
  longitude?: number;
  observacoes?: string;
  data_contato?: string;
  data_retorno?: string;
  created_at: string;
  updated_at: string;
}

export interface ListarCaptarResult {
  estabelecimentos: CaptarEstabelecimento[];
  total: number;
  paginas: number;
  paginaAtual: number;
}

export async function listarEstabelecimentosCaptar(
  pagina: number = 1,
  limite: number = 20,
  busca: string = '',
  status: string = ''
): Promise<ListarCaptarResult> {
  const supabase = await createClient();
  const offset = (pagina - 1) * limite;

  let query = supabase.from('captar_estabelecimentos' as any).select('*', { count: 'exact' });

  if (busca) {
    query = query.or(`nome.ilike.%${busca}%,email.ilike.%${busca}%,responsavel.ilike.%${busca}%`);
  }
  if (status) {
    query = query.eq('status', status);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limite - 1);

  if (error) {
    console.error('Erro ao listar estabelecimentos:', error);
    return { estabelecimentos: [], total: 0, paginas: 0, paginaAtual: pagina };
  }

  const total = count || 0;
  return {
    estabelecimentos: (data || []) as CaptarEstabelecimento[],
    total,
    paginas: Math.ceil(total / limite),
    paginaAtual: pagina
  };
}

export async function buscarEstabelecimentoCaptar(id: number): Promise<CaptarEstabelecimento | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('captar_estabelecimentos' as any)
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data as CaptarEstabelecimento;
}

export async function criarEstabelecimentoCaptar(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient();
  const insertData = {
    nome: formData.get('nome') as string,
    endereco: (formData.get('endereco') as string) || null,
    cidade: (formData.get('cidade') as string) || null,
    estado: (formData.get('estado') as string) || null,
    telefone: (formData.get('telefone') as string) || null,
    email: (formData.get('email') as string) || null,
    responsavel: (formData.get('responsavel') as string) || null,
    telefone_responsavel: (formData.get('telefone_responsavel') as string) || null,
    email_responsavel: (formData.get('email_responsavel') as string) || null,
    latitude: parseFloat(formData.get('latitude') as string) || null,
    longitude: parseFloat(formData.get('longitude') as string) || null,
    status: formData.get('status') as string || 'novo',
    observacoes: (formData.get('observacoes') as string) || null,
    data_contato: (formData.get('data_contato') as string) || null,
    data_retorno: (formData.get('data_retorno') as string) || null
  };

  const { error } = await supabase.from('captar_estabelecimentos' as any).insert(insertData as any);
  if (error) return { error: error.message };
  revalidatePath('/administracao/captar');
  return {};
}

export async function atualizarEstabelecimentoCaptar(id: number, formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient();
  const updateData = {
    nome: formData.get('nome') as string,
    endereco: (formData.get('endereco') as string) || null,
    cidade: (formData.get('cidade') as string) || null,
    estado: (formData.get('estado') as string) || null,
    telefone: (formData.get('telefone') as string) || null,
    email: (formData.get('email') as string) || null,
    responsavel: (formData.get('responsavel') as string) || null,
    telefone_responsavel: (formData.get('telefone_responsavel') as string) || null,
    email_responsavel: (formData.get('email_responsavel') as string) || null,
    latitude: parseFloat(formData.get('latitude') as string) || null,
    longitude: parseFloat(formData.get('longitude') as string) || null,
    status: formData.get('status') as string,
    observacoes: (formData.get('observacoes') as string) || null,
    data_contato: (formData.get('data_contato') as string) || null,
    data_retorno: (formData.get('data_retorno') as string) || null,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase.from('captar_estabelecimentos' as any).update(updateData as any).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/administracao/captar');
  return {};
}

export async function deletarEstabelecimentoCaptar(id: number): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from('captar_estabelecimentos' as any).delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/administracao/captar');
  return {};
}
