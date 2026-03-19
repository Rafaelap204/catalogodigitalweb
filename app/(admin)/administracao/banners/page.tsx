import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { listarBanners } from '@/lib/server/actions/banners';
import { posicoesOptions } from '@/lib/helpers';

interface Props {
  searchParams: Promise<{ pagina?: string; posicao?: string }>;
}

export default async function BannersPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session || session.nivel !== 1) redirect('/login');

  const { pagina, posicao } = await searchParams;
  const page = parseInt(pagina || '1', 10);

  const { banners, total, paginas, paginaAtual } = await listarBanners({ pagina: page, posicao });

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-md-8">
            <h2><i className="lni lni-image"></i> Banners</h2>
          </div>
          <div className="col-md-4 text-right">
            <Link href="/administracao/banners/adicionar" className="btn btn-success" style={{ marginTop: '10px' }}>
              <i className="lni lni-plus"></i> Novo Banner
            </Link>
          </div>
        </div>

        <div className="box box-white" style={{ marginBottom: '20px' }}>
          <form method="GET">
            <div className="row">
              <div className="col-md-8">
                <select name="posicao" className="form-control" defaultValue={posicao}>
                  <option value="">Todas as posições</option>
                  {posicoesOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <button type="submit" className="btn btn-primary"><i className="lni lni-search"></i> Filtrar</button>
                <Link href="/administracao/banners" className="btn btn-default" style={{ marginLeft: '10px' }}><i className="lni lni-reload"></i> Limpar</Link>
              </div>
            </div>
          </form>
        </div>

        <div className="box box-white">
          <div className="row">
            {banners.length === 0 ? (
              <div className="col-md-12 text-center" style={{ padding: '40px' }}>
                <p>Nenhum banner encontrado.</p>
              </div>
            ) : (
              banners.map((banner) => (
                <div key={banner.id} className="col-md-4" style={{ marginBottom: '20px' }}>
                  <div className="thumbnail">
                    {banner.imagem ? (
                      <img src={banner.imagem} alt={banner.titulo} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '150px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="lni lni-image" style={{ fontSize: '48px', color: '#ccc' }}></i>
                      </div>
                    )}
                    <div className="caption">
                      <h4>{banner.titulo || 'Sem título'}</h4>
                      <p>
                        <small className="text-muted">{posicoesOptions.find(p => p.value === banner.posicao)?.label || banner.posicao}</small>
                      </p>
                      <p>
                        <span className={`badge ${banner.status === 1 ? 'badge-success' : 'badge-danger'}`}>
                          {banner.status === 1 ? 'Ativo' : 'Inativo'}
                        </span>
                        <span className="badge badge-default" style={{ marginLeft: '5px' }}>Ordem: {banner.ordem || 0}</span>
                      </p>
                      <p>
                        <Link href={`/administracao/banners/editar?id=${banner.id}`} className="btn btn-primary btn-sm"><i className="lni lni-pencil"></i> Editar</Link>
                        <Link href={`/administracao/banners/deletar?id=${banner.id}`} className="btn btn-danger btn-sm" style={{ marginLeft: '5px' }}><i className="lni lni-trash"></i> Deletar</Link>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {paginas > 1 && (
            <div className="text-center" style={{ marginTop: '20px' }}>
              <nav>
                <ul className="pagination">
                  {paginaAtual > 1 && <li><Link href={`?pagina=${paginaAtual - 1}${posicao ? `&posicao=${posicao}` : ''}`}>&laquo;</Link></li>}
                  {Array.from({ length: paginas }, (_, i) => i + 1).map((p) => (
                    <li key={p} className={p === paginaAtual ? 'active' : ''}><Link href={`?pagina=${p}${posicao ? `&posicao=${posicao}` : ''}`}>{p}</Link></li>
                  ))}
                  {paginaAtual < paginas && <li><Link href={`?pagina=${paginaAtual + 1}${posicao ? `&posicao=${posicao}` : ''}`}>&raquo;</Link></li>}
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
