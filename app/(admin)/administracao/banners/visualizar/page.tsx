import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function VisualizarBannerPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  const params = await searchParams;
  const bannerId = params.id;
  
  if (!bannerId) {
    redirect('/administracao/banners');
  }

  const supabase = await createClient();
  
  const { data: banner } = await (supabase
    .from('banners') as any)
    .select('id, titulo, imagem, link, posicao, ordem, status, created')
    .eq('id', bannerId)
    .single();

  if (!banner) {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="alert alert-danger">Banner não encontrado.</div>
          <Link href="/administracao/banners" className="btn btn-default">Voltar</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="box box-white">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <div className="row">
              <div className="col-sm-8">
                <h2><i className="lni lni-image"></i> Banner #{banner.id}</h2>
              </div>
              <div className="col-sm-4 text-right">
                <Link href="/administracao/banners" className="btn btn-default">
                  <i className="lni lni-arrow-left"></i> Voltar
                </Link>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              {banner.imagem && (
                <div style={{ marginBottom: '20px' }}>
                  <img src={banner.imagem} alt={banner.titulo} style={{ maxWidth: '100%', borderRadius: '5px' }} />
                </div>
              )}
            </div>
            <div className="col-md-6">
              <table className="table table-striped">
                <tbody>
                  <tr><td><strong>ID:</strong></td><td>#{banner.id}</td></tr>
                  <tr><td><strong>Título:</strong></td><td>{banner.titulo}</td></tr>
                  <tr><td><strong>Link:</strong></td><td><a href={banner.link} target="_blank" rel="noopener noreferrer">{banner.link}</a></td></tr>
                  <tr><td><strong>Posição:</strong></td><td>{banner.posicao}</td></tr>
                  <tr><td><strong>Ordem:</strong></td><td>{banner.ordem}</td></tr>
                  <tr><td><strong>Status:</strong></td><td><span className={`badge ${banner.status === 'ativo' ? 'badge-success' : 'badge-danger'}`}>{banner.status === 'ativo' ? 'Ativo' : 'Inativo'}</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <hr />
          
          <div className="text-right">
            <Link href={`/administracao/banners/editar?id=${banner.id}`} className="btn btn-primary" style={{ marginRight: '5px' }}>
              <i className="lni lni-pencil"></i> Editar
            </Link>
            <Link href={`/administracao/banners/deletar?id=${banner.id}`} className="btn btn-danger">
              <i className="lni lni-trash"></i> Deletar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
