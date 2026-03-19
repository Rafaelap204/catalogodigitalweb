import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Estabelecimento, Produto, Categoria } from '@/types/models';
import { StoreHeader } from '@/components/loja/StoreHeader';
import { ProductGrid } from '@/components/loja/ProductGrid';
import { CategoryNav } from '@/components/loja/CategoryNav';
import { ShoppingCart } from '@/components/loja/ShoppingCart';

interface LojaPageProps {
  params: {
    subdominio: string;
  };
  searchParams: {
    categoria?: string;
    busca?: string;
  };
}

export async function generateMetadata({ params }: LojaPageProps) {
  const estabelecimento = await getEstabelecimentoBySubdominio(
    params.subdominio
  );

  if (!estabelecimento) {
    return { title: 'Loja não encontrada' };
  }

  return {
    title: estabelecimento.nome,
    description: estabelecimento.descricao || `Catálogo digital de ${estabelecimento.nome}`,
    openGraph: {
      images: estabelecimento.perfil ? [estabelecimento.perfil] : undefined,
    },
  };
}

async function getEstabelecimentoBySubdominio(
  subdominio: string
): Promise<Estabelecimento | null> {
  const supabase = createClient();

  const { data } = await supabase
    .from('estabelecimentos')
    .select('*')
    .eq('subdominio', subdominio)
    .eq('excluded', false)
    .eq('status', 1)
    .single();

  return data as Estabelecimento | null;
}

async function getProdutos(
  estabelecimentoId: number,
  categoriaId?: string
): Promise<Produto[]> {
  const supabase = createClient();

  let query = supabase
    .from('produtos')
    .select('*')
    .eq('rel_estabelecimentos_id', estabelecimentoId)
    .eq('visible', true)
    .eq('status', 1)
    .order('posicao', { ascending: true });

  if (categoriaId) {
    query = query.eq('rel_categorias_id', parseInt(categoriaId));
  }

  const { data } = await query;
  return (data as Produto[]) || [];
}

async function getCategorias(estabelecimentoId: number): Promise<Categoria[]> {
  const supabase = createClient();

  const { data } = await supabase
    .from('categorias')
    .select('*')
    .eq('rel_estabelecimentos_id', estabelecimentoId)
    .eq('visible', true)
    .eq('status', 1)
    .order('ordem', { ascending: true });

  return (data as Categoria[]) || [];
}

export default async function LojaPage({
  params,
  searchParams,
}: LojaPageProps) {
  const estabelecimento = await getEstabelecimentoBySubdominio(
    params.subdominio
  );

  if (!estabelecimento) {
    notFound();
  }

  const [produtos, categorias] = await Promise.all([
    getProdutos(estabelecimento.id, searchParams.categoria),
    getCategorias(estabelecimento.id),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader estabelecimento={estabelecimento} />
      <CategoryNav
        categorias={categorias}
        estabelecimentoSubdominio={params.subdominio}
        categoriaAtiva={searchParams.categoria}
      />
      <main className="container mx-auto px-4 py-8 pb-24">
        <ProductGrid
          produtos={produtos}
          estabelecimento={estabelecimento}
        />
      </main>
      <ShoppingCart estabelecimento={estabelecimento} />
    </div>
  );
}
