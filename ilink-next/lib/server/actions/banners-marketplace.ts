/**
 * Server Actions para gerenciar banners do marketplace
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface BannerMarketplace {
  id: number;
  titulo: string;
  desktop: string;
  mobile: string | null;
  video_link: string | null;
  link: string;
  status: number;
  rel_estabelecimentos_id: number;
  created_at?: string;
}

export interface ListarBannersParams {
  pagina?: number;
  limite?: number;
  titulo?: string;
  status?: number;
}

export interface ListarBannersResult {
  banners: BannerMarketplace[];
  total: number;
  paginas: number;
  paginaAtual: number;
}

export async function listarBanners(params: ListarBannersParams = {}): Promise<ListarBannersResult> {
  try {
    const supabase = await createClient();
    const { pagina = 1, limite = 20, titulo, status } = params;
    const offset = (pagina - 1) * limite;

    let query = supabase.from('banners_marketplace').select('*', { count: 'exact' });
    if (titulo) query = query.ilike('titulo', `${titulo}%`);
    if (status !== undefined) query = query.eq('status', status);

    const { data, error, count } = await query.order('id', { ascending: false }).range(offset, offset + limite - 1);
    if (error) throw error;

    return { banners: (data || []) as BannerMarketplace[], total: count || 0, paginas: Math.ceil((count || 0) / limite), paginaAtual: pagina };
  } catch (error) {
    console.error('Erro ao listar banners:', error);
    return { banners: [], total: 0, paginas: 0, paginaAtual: 1 };
  }
}

export async function buscarBanner(id: number): Promise<BannerMarketplace | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('banners_marketplace').select('*').eq('id', id).single();
    if (error) throw error;
    return data as BannerMarketplace;
  } catch (error) {
    console.error('Erro:', error);
    return null;
  }
}

export async function criarBanner(formData: FormData) {
  try {
    const supabase = await createClient();
    const titulo = formData.get('titulo') as string;
    const desktop = formData.get('desktop') as string;
    const mobile = formData.get('mobile') as string;
    const video_link = formData.get('video_link') as string;
    const link = formData.get('link') as string;
    const status = parseInt(formData.get('status') as string) || 1;
    
    if (!titulo || !desktop) return { error: 'Título e imagem desktop são obrigatórios' };

    const { data, error } = await supabase.from('banners_marketplace' as any).insert({
      titulo: titulo.trim(), desktop, mobile: mobile || null, video_link: video_link || null, link: link || null, status, rel_estabelecimentos_id: 1
    } as any).select().single();
    
    if (error) throw error;
    revalidatePath('/administracao/banners_marketplace');
    return { success: true, data };
  } catch (error) {
    console.error('Erro:', error);
    return { error: 'Erro ao criar banner' };
  }
}

export async function atualizarBanner(id: number, formData: FormData) {
  try {
    const supabase = await createClient();
    const titulo = formData.get('titulo') as string;
    const desktop = formData.get('desktop') as string;
    const mobile = formData.get('mobile') as string;
    const video_link = formData.get('video_link') as string;
    const link = formData.get('link') as string;
    const status = parseInt(formData.get('status') as string);
    
    if (!titulo || !desktop) return { error: 'Título e imagem desktop são obrigatórios' };

    const { data, error } = await supabase.from('banners_marketplace' as any).update({
      titulo: titulo.trim(), desktop, mobile: mobile || null, video_link: video_link || null, link: link || null, status
    } as any).eq('id', id).select().single();
    
    if (error) throw error;
    revalidatePath('/administracao/banners_marketplace');
    return { success: true, data };
  } catch (error) {
    console.error('Erro:', error);
    return { error: 'Erro ao atualizar banner' };
  }
}

export async function deletarBanner(id: number) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('banners_marketplace').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/administracao/banners_marketplace');
    return { success: true };
  } catch (error) {
    console.error('Erro:', error);
    return { error: 'Erro ao deletar banner' };
  }
}
