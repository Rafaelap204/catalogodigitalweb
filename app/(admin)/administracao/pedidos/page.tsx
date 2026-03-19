import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { listarPedidos } from '@/lib/server/actions/pedidos';
import { getPedidoStatusLabel } from '@/lib/helpers';

interface Props {
  searchParams: Promise<{ 
    pagina?: string;
    cliente_nome?: string;
    status?: string;
    [key: string]: string | undefined;
  }>;
}

export default async function PedidosPage({ searchParams }: Props) {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  const params = await searchParams;
  const pagina = parseInt(params.pagina || '1', 10);
  const cliente_nome = params.cliente_nome;
  const status = params.status;

  const { pedidos, total, paginas, paginaAtual } = await listarPedidos({
    pagina,
    cliente_nome,
    status,
  });

  const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'pendente', label: 'Pendente' },
    { value: 'pago', label: 'Pago' },
    { value: 'processando', label: 'Processando' },
    { value: 'enviado', label: 'Enviado' },
    { value: 'entregue', label: 'Entregue' },
    { value: 'cancelado', label: 'Cancelado' },
  ];

  return (
    <div className="row">
      <div className="col-md-12">
        {/* Header */}
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-md-8">
            <h2>
              <i className="lni lni-delivery"></i> Pedidos
              <small style={{ display: 'block', fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Gerencie os pedidos do sistema
              </small>
            </h2>
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
                    name="cliente_nome" 
                    className="form-control"
                    placeholder="Buscar por cliente..."
                    defaultValue={cliente_nome}
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
                <Link href="/administracao/pedidos" className="btn btn-default" style={{ marginLeft: '10px' }}>
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
                  <th>Pedido #</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Data</th>
                  <th style={{ width: '150px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center">
                      Nenhum pedido encontrado.
                    </td>
                  </tr>
                ) : (
                  pedidos.map((pedido) => {
                    const statusInfo = getPedidoStatusLabel(pedido.status);
                    return (
                      <tr key={pedido.id}>
                        <td>
                          <strong>#{pedido.id}</strong>
                        </td>
                        <td>
                          <strong>{pedido.cliente_nome || 'N/A'}</strong>
                          {pedido.cliente_telefone && (
                            <small style={{ display: 'block', color: '#666' }}>
                              {pedido.cliente_telefone}
                            </small>
                          )}
                        </td>
                        <td>
                          <strong>R$ {pedido.valor_total.toFixed(2)}</strong>
                          {pedido.valor_frete && pedido.valor_frete > 0 && (
                            <small style={{ display: 'block', color: '#666' }}>
                              Frete: R$ {pedido.valor_frete.toFixed(2)}
                            </small>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${statusInfo.className}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td>
                          {pedido.created ? new Date(pedido.created).toLocaleDateString('pt-BR') : '-'}
                        </td>
                        <td>
                          <div className="btn-group">
                            <Link 
                              href={`/administracao/pedidos/visualizar?id=${pedido.id}`}
                              className="btn btn-sm btn-info"
                              title="Visualizar"
                            >
                              <i className="lni lni-eye"></i>
                            </Link>
                            <Link 
                              href={`/administracao/pedidos/deletar?id=${pedido.id}`}
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
                      <Link href={`?pagina=${paginaAtual - 1}${cliente_nome ? `&cliente_nome=${cliente_nome}` : ''}${status ? `&status=${status}` : ''}`}>
                        &laquo;
                      </Link>
                    </li>
                  )}
                  
                  {Array.from({ length: paginas }, (_, i) => i + 1).map((p) => (
                    <li key={p} className={p === paginaAtual ? 'active' : ''}>
                      <Link href={`?pagina=${p}${cliente_nome ? `&cliente_nome=${cliente_nome}` : ''}${status ? `&status=${status}` : ''}`}>
                        {p}
                      </Link>
                    </li>
                  ))}
                  
                  {paginaAtual < paginas && (
                    <li>
                      <Link href={`?pagina=${paginaAtual + 1}${cliente_nome ? `&cliente_nome=${cliente_nome}` : ''}${status ? `&status=${status}` : ''}`}>
                        &raquo;
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          )}

          <div className="text-muted" style={{ marginTop: '10px' }}>
            Mostrando {pedidos.length} de {total} pedidos
          </div>
        </div>
      </div>
    </div>
  );
}
