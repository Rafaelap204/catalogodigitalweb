import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { listarAssinaturas } from '@/lib/server/actions/assinaturas';
import { getAssinaturaStatusLabel } from '@/lib/helpers';

interface Props {
  searchParams: Promise<{ 
    pagina?: string;
    estabelecimento_id?: string;
    status?: string;
    [key: string]: string | undefined;
  }>;
}

export default async function AssinaturasPage({ searchParams }: Props) {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  const params = await searchParams;
  const pagina = parseInt(params.pagina || '1', 10);
  const estabelecimento_id = params.estabelecimento_id;
  const status = params.status;

  const { assinaturas, total, paginas, paginaAtual } = await listarAssinaturas({
    pagina,
    estabelecimento_id,
    status,
  });

  const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'ativa', label: 'Ativa' },
    { value: 'pendente', label: 'Pendente' },
    { value: 'cancelada', label: 'Cancelada' },
    { value: 'expirada', label: 'Expirada' },
    { value: 'suspensa', label: 'Suspensa' },
  ];

  return (
    <div className="row">
      <div className="col-md-12">
        {/* Header */}
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-md-8">
            <h2>
              <i className="lni lni-crown"></i> Assinaturas
              <small style={{ display: 'block', fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Gerencie as assinaturas dos estabelecimentos
              </small>
            </h2>
          </div>
          <div className="col-md-4 text-right">
            <Link 
              href="/administracao/assinaturas/adicionar" 
              className="btn btn-success"
              style={{ marginTop: '10px' }}
            >
              <i className="lni lni-plus"></i> Nova Assinatura
            </Link>
          </div>
        </div>

        {/* Filtros */}
        <div className="box box-white" style={{ marginBottom: '20px' }}>
          <form method="GET">
            <div className="row">
              <div className="col-md-4">
                <div className="form-field">
                  <input 
                    type="text" 
                    name="estabelecimento_id" 
                    className="form-control"
                    placeholder="ID do Estabelecimento..."
                    defaultValue={estabelecimento_id}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-field">
                  <select name="status" className="form-control" defaultValue={status}>
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <button type="submit" className="btn btn-primary">
                  <i className="lni lni-search"></i> Filtrar
                </button>
                <Link href="/administracao/assinaturas" className="btn btn-default" style={{ marginLeft: '10px' }}>
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
                  <th>ID</th>
                  <th>Estabelecimento</th>
                  <th>Plano</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Vencimento</th>
                  <th style={{ width: '150px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {assinaturas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center">
                      Nenhuma assinatura encontrada.
                    </td>
                  </tr>
                ) : (
                  assinaturas.map((assinatura) => {
                    const statusInfo = getAssinaturaStatusLabel(assinatura.status);
                    return (
                      <tr key={assinatura.id}>
                        <td>#{assinatura.id}</td>
                        <td>
                          {assinatura.estabelecimento_id 
                            ? `Estabelecimento #${assinatura.estabelecimento_id}` 
                            : '-'}
                        </td>
                        <td>
                          {assinatura.plano_id 
                            ? `Plano #${assinatura.plano_id}` 
                            : '-'}
                        </td>
                        <td>
                          <strong>R$ {assinatura.valor.toFixed(2)}</strong>
                        </td>
                        <td>
                          <span className={`badge ${statusInfo.className}`}>
                            {statusInfo.label}
                          </span>
                          {assinatura.renovacao_automatica === 1 && (
                            <span className="badge badge-info" style={{ marginLeft: '5px' }}>
                              <i className="lni lni-reload"></i> Auto
                            </span>
                          )}
                        </td>
                        <td>
                          {assinatura.data_fim 
                            ? new Date(assinatura.data_fim).toLocaleDateString('pt-BR')
                            : '-'}
                        </td>
                        <td>
                          <div className="btn-group">
                            <Link 
                              href={`/administracao/assinaturas/editar?id=${assinatura.id}`}
                              className="btn btn-sm btn-primary"
                              title="Editar"
                            >
                              <i className="lni lni-pencil"></i>
                            </Link>
                            <Link 
                              href={`/administracao/assinaturas/deletar?id=${assinatura.id}`}
                              className="btn btn-sm btn-danger"
                              title="Deletar"
                            >
                              <i className="lni lni-trash"></i>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
                      <Link href={`?pagina=${paginaAtual - 1}${estabelecimento_id ? `&estabelecimento_id=${estabelecimento_id}` : ''}${status ? `&status=${status}` : ''}`}>
                        &laquo;
                      </Link>
                    </li>
                  )}
                  
                  {Array.from({ length: paginas }, (_, i) => i + 1).map((p) => (
                    <li key={p} className={p === paginaAtual ? 'active' : ''}>
                      <Link href={`?pagina=${p}${estabelecimento_id ? `&estabelecimento_id=${estabelecimento_id}` : ''}${status ? `&status=${status}` : ''}`}>
                        {p}
                      </Link>
                    </li>
                  ))}
                  
                  {paginaAtual < paginas && (
                    <li>
                      <Link href={`?pagina=${paginaAtual + 1}${estabelecimento_id ? `&estabelecimento_id=${estabelecimento_id}` : ''}${status ? `&status=${status}` : ''}`}>
                        &raquo;
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          )}

          <div className="text-muted" style={{ marginTop: '10px' }}>
            Mostrando {assinaturas.length} de {total} assinaturas
          </div>
        </div>
      </div>
    </div>
  );
}
