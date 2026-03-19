/**
 * Server Actions para gerenciar banners
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Banner {
  id?: string | number;
  titulo?: string;
  subtitulo?: string;
  imagem?: string;
  link?: string;
  ordem?: number;
  posicao?: string;
  status: number;
  estabelecimento_id?: string | number;
  created?: string;
}

export interface ListarBannersParams {
  pagina?: number;
  limite?: number;
  titulo?: string;
  posicao?: string;
  estabelecimento_id?: string | number;
  status?: number;
}

export interface ListarBannersResult {
  banners: Banner[];
  total: number;
  paginas: number;
  paginaAtual: number;
}

export async function listarBanners(
  params: ListarBannersParams = {}
): Promise<ListarBannersResult> {
  try {
    const supabase = await createClient();
    const { pagina = 1, limite = 20, titulo, posicao, estabelecimento_id, status } = params;
    const offset = (pagina - 1) * limite;

    let query = supabase.from('banners').select('*', { count: 'exact' });

    if (titulo) query = query.ilike('titulo', `%${titulo}%`);
    if (posicao) query = query.eq('posicao', posicao);
    if (estabelecimento_id) query = query.eq('estabelecimento_id', estabelecimento_id);
    if (status !== undefined) query = query.eq('status', status);

    const { data, error, count } = await query.order('ordem', { ascending: true }).range(offset, offset + limite - 1);

    if (error) {
      console.error('Erro ao listar banners:', error);
      return { banners: [], total: 0, paginas: 0, paginaAtual: pagina };
    }

    return { banners: (data || []) as Banner[], total: count || 0, paginas: Math.ceil((count || 0) / limite), paginaAtual: pagina };
  } catch (error) {
    console.error('Erro:', error);
    return { banners: [], total: 0, paginas: 0, paginaAtual: 1 };
  }
}

export async function buscarBanner(id: string | number): Promise<Banner | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('banners').select('*').eq('id', id).single();
    if (error || !data) return null;
    return data as Banner;
  } catch (error) {
    console.error('Erro ao buscar banner:', error);
    return null;
  }
}

export async function salvarBanner(formData: FormData): Promise<{ success: boolean; error?: string; id?: string | number }> {
  try {
    const supabase = await createClient();
    const dados = {
      titulo: formData.get('titulo') as string,
      subtitulo: formData.get('subtitulo') as string,
      imagem: formData.get('imagem') as string,
      link: formData.get('link') as string,
      ordem: parseInt(formData.get('ordem') as string) || 0,
      posicao: formData.get('posicao') as string,
      estabelecimento_id: formData.get('estabelecimento_id') as string,
      status: parseInt(formData.get('status') as string) || 1,
    };

    const { data, error } = await (supabase.from('banners') as any).insert([dados]).select('id').single();
    if (error) {
      console.error('Erro ao salvar banner:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/banners');
    return { success: true, id: data?.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function atualizarBanner(id: string | number, formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const dados = {
      titulo: formData.get('titulo') as string,
      subtitulo: formData.get('subtitulo') as string,
      imagem: formData.get('imagem') as string,
      link: formData.get('link') as string,
      ordem: parseInt(formData.get('ordem') as string) || 0,
      posicao: formData.get('posicao') as string,
      estabelecimento_id: formData.get('estabelecimento_id') as string,
      status: parseInt(formData.get('status') as string) || 1,
    };

    const { error } = await (supabase.from('banners') as any).update(dados).eq('id', id);
    if (error) {
      console.error('Erro ao atualizar banner:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/administracao/banners');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletarBanner(id: string | number): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('banners').delete().eq('id', id);
    if (error) return { success: false, error: error.message };

    revalidatePath('/administracao/banners');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


