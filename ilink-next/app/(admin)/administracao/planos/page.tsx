import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { listarPlanos } from '@/lib/server/actions/planos';
import { getPeriodicidadeLabel } from '@/lib/helpers';

interface Props {
  searchParams: Promise<{ 
    pagina?: string;
    nome?: string;
    [key: string]: string | undefined;
  }>;
}

export default async function PlanosPage({ searchParams }: Props) {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  const params = await searchParams;
  const pagina = parseInt(params.pagina || '1', 10);
  const nome = params.nome;

  const { planos, total, paginas, paginaAtual } = await listarPlanos({
    pagina,
    nome,
  });

  return (
    <div className="row">
      <div className="col-md-12">
        {/* Header */}
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-md-8">
            <h2>
              <i className="lni lni-diamond"></i> Planos
              <small style={{ display: 'block', fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Gerencie os planos de assinatura
              </small>
            </h2>
          </div>
          <div className="col-md-4 text-right">
            <Link 
              href="/administracao/planos/adicionar" 
              className="btn btn-success"
              style={{ marginTop: '10px' }}
            >
              <i className="lni lni-plus"></i> Adicionar Novo
            </Link>
          </div>
        </div>

        {/* Filtros */}
        <div className="box box-white" style={{ marginBottom: '20px' }}>
          <form method="GET">
            <div className="row">
              <div className="col-md-8">
                <div className="form-field">
                  <input 
                    type="text" 
                    name="nome" 
                    className="form-control"
                    placeholder="Buscar por nome..."
                    defaultValue={nome}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <button type="submit" className="btn btn-primary">
                  <i className="lni lni-search"></i> Filtrar
                </button>
                <Link href="/administracao/planos" className="btn btn-default" style={{ marginLeft: '10px' }}>
                  <i className="lni lni-reload"></i> Limpar
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Tabela */}
        <div className="box box-white">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Ordem</th>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Periodicidade</th>
                  <th>Limites</th>
                  <th>Status</th>
                  <th style={{ width: '150px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {planos.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center">
                      Nenhum plano encontrado.
                    </td>
                  </tr>
                ) : (
                  planos.map((plano) => (
                    <tr key={plano.id}>
                      <td>{plano.ordem || 0}</td>
                      <td>
                        <strong>{plano.nome}</strong>
                        {plano.descricao && (
                          <small style={{ display: 'block', color: '#666' }}>
                            {plano.descricao.substring(0, 50)}
                            {plano.descricao.length > 50 ? '...' : ''}
                          </small>
                        )}
                      </td>
                      <td>
                        <strong className="text-success">
                          R$ {plano.preco.toFixed(2)}
                        </strong>
                      </td>
                      <td>
                        {getPeriodicidadeLabel(plano.periodicidade)}
                      </td>
                      <td>
                        <small>
                          {plano.limite_produtos !== null && (
                            <div><i className="lni lni-cart"></i> {plano.limite_produtos} produtos</div>
                          )}
                          {plano.limite_estabelecimentos !== null && (
                            <div><i className="lni lni-shop"></i> {plano.limite_estabelecimentos} estab.</div>
                          )}
                          {plano.limite_produtos === null && plano.limite_estabelecimentos === null && (
                            <span className="text-muted">Ilimitado</span>
                          )}
                        </small>
                      </td>
                      <td>
                        <span className={`badge ${plano.status === 1 ? 'badge-success' : 'badge-danger'}`}>
                          {plano.status === 1 ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <Link 
                            href={`/administracao/planos/editar?id=${plano.id}`}
                            className="btn btn-sm btn-primary"
                            title="Editar"
                          >
                            <i className="lni lni-pencil"></i>
                          </Link>
                          <Link 
                            href={`/administracao/planos/deletar?id=${plano.id}`}
                            className="btn btn-sm btn-danger"
                            title="Deletar"
                          >
                            <i className="lni lni-trash"></i>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {paginas > 1 && (
            <div className="text-center" style={{ marginTop: '20px' }}>
              <nav>
                <ul className="pagination">
                  {paginaAtual > 1 && (
                    <li>
                      <Link href={`?pagina=${paginaAtual - 1}${nome ? `&nome=${nome}` : ''}`}>
                        &laquo;
                      </Link>
                    </li>
                  )}
                  
                  {Array.from({ length: paginas }, (_, i) => i + 1).map((p) => (
                    <li key={p} className={p === paginaAtual ? 'active' : ''}>
                      <Link href={`?pagina=${p}${nome ? `&nome=${nome}` : ''}`}>
                        {p}
                      </Link>
                    </li>
                  ))}
                  
                  {paginaAtual < paginas && (
                    <li>
                      <Link href={`?pagina=${paginaAtual + 1}${nome ? `&nome=${nome}` : ''}`}>
                        &raquo;
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          )}

          <div className="text-muted" style={{ marginTop: '10px' }}>
            Mostrando {planos.length} de {total} planos
          </div>
        </div>
      </div>
    </div>
  );
}
