import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  
  if (!session || session.nivel !== 2) {
    redirect('/login');
  }

  const params = await searchParams;
  const pagina = params.pag ? parseInt(String(params.pag)) : 1;
  const status = String(params.status || '');
  const offset = (pagina - 1) * 20;
  
  const supabase = await createClient();
  const estabelecimentoId = session.estabelecimento_id || '0';
  
  // Busca pedidos do estabelecimento
  let query = (supabase
    .from('pedidos') as any)
    .select('id, cliente_nome, valor_total, status, created, forma_pagamento')
    .eq('estabelecimento_id', estabelecimentoId);
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data: pedidos, error } = await query
    .order('created', { ascending: false })
    .range(offset, offset + 19);

  if (error) {
    console.error('Erro ao listar pedidos:', error);
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="box box-white">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <div className="row">
              <div className="col-sm-8">
                <h2><i className="lni lni-delivery"></i> Meus Pedidos</h2>
              </div>
              <div className="col-sm-4 text-right">
                <Link href="/painel" className="btn btn-default">
                  <i className="lni lni-arrow-left"></i> Voltar
                </Link>
              </div>
            </div>
          </div>
          
          <div className="row" style={{ marginBottom: '20px' }}>
            <div className="col-md-12">
              <Link href="/painel/pedidos" className={`btn ${!status ? 'btn-primary' : 'btn-default'}`} style={{ marginRight: '5px' }}>
                Todos
              </Link>
              <Link href="?status=pendente" className={`btn ${status === 'pendente' ? 'btn-warning' : 'btn-default'}`} style={{ marginRight: '5px' }}>
                Pendentes
              </Link>
              <Link href="?status=pago" className={`btn ${status === 'pago' ? 'btn-info' : 'btn-default'}`} style={{ marginRight: '5px' }}>
                Pagos
              </Link>
              <Link href="?status=entregue" className={`btn ${status === 'entregue' ? 'btn-success' : 'btn-default'}`} style={{ marginRight: '5px' }}>
                Entregues
              </Link>
              <Link href="?status=cancelado" className={`btn ${status === 'cancelado' ? 'btn-danger' : 'btn-default'}`}>
                Cancelados
              </Link>
            </div>
          </div>
          
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Pagamento</th>
                  <th>Status</th>
                  <th>Data</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {!pedidos || pedidos.length === 0 ? (
                  <tr><td colSpan={7} className="text-center">Nenhum pedido encontrado</td></tr>
                ) : (
                  pedidos.map((pedido: any) => (
                    <tr key={pedido.id}>
                      <td>#{pedido.id}</td>
                      <td>{pedido.cliente_nome || 'N/A'}</td>
                      <td>R$ {pedido.valor_total?.toFixed(2)}</td>
                      <td>{pedido.forma_pagamento || 'N/A'}</td>
                      <td>
                        <span className={`badge ${
                          pedido.status === 'entregue' ? 'badge-success' :
                          pedido.status === 'cancelado' ? 'badge-danger' :
                          pedido.status === 'pendente' ? 'badge-warning' : 'badge-info'
                        }`}>
                          {pedido.status || 'Novo'}
                        </span>
                      </td>
                      <td>{pedido.created ? new Date(pedido.created).toLocaleDateString('pt-BR') : '-'}</td>
                      <td className="text-center">
                        <Link href={`/painel/pedidos/visualizar?id=${pedido.id}`} className="btn btn-default btn-sm">
                          <i className="lni lni-eye"></i> Ver
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="row">
            <div className="col-sm-6">
              <p className="text-muted">Mostrando {(pedidos as any[])?.length || 0} registros</p>
            </div>
            <div className="col-sm-6 text-right">
              {pagina > 1 && (
                <Link href={`?pag=${pagina - 1}${status ? '&status=' + status : ''}`} className="btn btn-default">
                  <i className="lni lni-chevron-left"></i> Anterior
                </Link>
              )}
              <span style={{ marginLeft: '5px', marginRight: '5px' }}>Página {pagina}</span>
              {(pedidos as any[])?.length === 20 && (
                <Link href={`?pag=${pagina + 1}${status ? '&status=' + status : ''}`} className="btn btn-default">
                  Próxima <i className="lni lni-chevron-right"></i>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
