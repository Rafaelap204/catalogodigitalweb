import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { listarAvaliacoes, atualizarStatusAvaliacao } from '@/lib/server/actions/avaliacoes';
import { renderStars } from '@/lib/helpers';

interface Props {
  searchParams: Promise<{ pagina?: string; status?: string }>;
}

export default async function AvaliacoesPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session || session.nivel !== 1) redirect('/login');

  const params = await searchParams;
  const pagina = parseInt(params.pagina || '1', 10);
  const status = params.status ? parseInt(params.status, 10) : undefined;

  const { avaliacoes, total, paginas, paginaAtual } = await listarAvaliacoes({ pagina, status });

  async function handleStatusUpdate(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const novoStatus = parseInt(formData.get('status') as string);
    await atualizarStatusAvaliacao(id, novoStatus);
    redirect('/administracao/avaliacoes');
  }

  const statusOptions = [
    { value: '', label: 'Todas' },
    { value: '1', label: 'Aprovadas' },
    { value: '0', label: 'Pendentes' },
  ];

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-md-8">
            <h2><i className="lni lni-star"></i> Avaliações</h2>
          </div>
        </div>

        <div className="box box-white" style={{ marginBottom: '20px' }}>
          <form method="GET">
            <div className="row">
              <div className="col-md-4">
                <select name="status" className="form-control" defaultValue={params.status}>
                  {statusOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="col-md-8">
                <button type="submit" className="btn btn-primary"><i className="lni lni-search"></i> Filtrar</button>
                <Link href="/administracao/avaliacoes" className="btn btn-default" style={{ marginLeft: '10px' }}><i className="lni lni-reload"></i> Limpar</Link>
              </div>
            </div>
          </form>
        </div>

        <div className="box box-white">
          {avaliacoes.length === 0 ? (
            <div className="text-center" style={{ padding: '40px' }}><p>Nenhuma avaliação encontrada.</p></div>
          ) : (
            avaliacoes.map((avaliacao) => (
              <div key={avaliacao.id} className="media" style={{ borderBottom: '1px solid #eee', padding: '20px 0' }}>
                <div className="media-left">
                  <div style={{ width: '50px', height: '50px', background: '#007bff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px' }}>
                    <i className="lni lni-user"></i>
                  </div>
                </div>
                <div className="media-body">
                  <div className="row">
                    <div className="col-md-8">
                      <h4 className="media-heading">
                        {avaliacao.cliente_nome || 'Anônimo'}
                        <span style={{ marginLeft: '10px', color: '#ffc107', fontSize: '16px' }}>{renderStars(avaliacao.nota)}</span>
                      </h4>
                      <p>{avaliacao.comentario}</p>
                      {avaliacao.resposta && (
                        <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '4px', marginTop: '10px' }}>
                          <strong><i className="lni lni-reply"></i> Resposta:</strong> {avaliacao.resposta}
                        </div>
                      )}
                    </div>
                    <div className="col-md-4">
                      <div className="text-right">
                        <span className={`badge ${avaliacao.status === 1 ? 'badge-success' : 'badge-warning'}`}>
                          {avaliacao.status === 1 ? 'Aprovada' : 'Pendente'}
                        </span>
                        <p className="text-muted" style={{ marginTop: '5px' }}>
                          <small>{avaliacao.created ? new Date(avaliacao.created).toLocaleDateString('pt-BR') : '-'}</small>
                        </p>
                        <form action={handleStatusUpdate} style={{ marginTop: '10px' }}>
                          <input type="hidden" name="id" value={avaliacao.id} />
                          <input type="hidden" name="status" value={avaliacao.status === 1 ? 0 : 1} />
                          <button type="submit" className={`btn btn-sm ${avaliacao.status === 1 ? 'btn-warning' : 'btn-success'}`}>
                            {avaliacao.status === 1 ? 'Reprovar' : 'Aprovar'}
                          </button>
                          <Link href={`/administracao/avaliacoes/responder?id=${avaliacao.id}`} className="btn btn-sm btn-primary" style={{ marginLeft: '5px' }}>
                            <i className="lni lni-reply"></i> Responder
                          </Link>
                          <Link href={`/administracao/avaliacoes/deletar?id=${avaliacao.id}`} className="btn btn-sm btn-danger" style={{ marginLeft: '5px' }}>
                            <i className="lni lni-trash"></i>
                          </Link>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {paginas > 1 && (
            <div className="text-center" style={{ marginTop: '20px' }}>
              <nav>
                <ul className="pagination">
                  {paginaAtual > 1 && <li><Link href={`?pagina=${paginaAtual - 1}${status !== undefined ? `&status=${status}` : ''}`}>&laquo;</Link></li>}
                  {Array.from({ length: paginas }, (_, i) => i + 1).map((p) => (
                    <li key={p} className={p === paginaAtual ? 'active' : ''}><Link href={`?pagina=${p}${status !== undefined ? `&status=${status}` : ''}`}>{p}</Link></li>
                  ))}
                  {paginaAtual < paginas && <li><Link href={`?pagina=${paginaAtual + 1}${status !== undefined ? `&status=${status}` : ''}`}>&raquo;</Link></li>}
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
