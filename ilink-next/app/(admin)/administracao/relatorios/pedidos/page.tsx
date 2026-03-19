import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function RelatorioPedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  const params = await searchParams;
  const dataInicio = String(params.data_inicio || '');
  const dataFim = String(params.data_fim || '');
  const status = String(params.status || '');
  
  const supabase = await createClient();
  
  // Query base
  let query = (supabase.from('pedidos') as any)
    .select('id, valor_total, status, created, forma_pagamento, cliente_nome, cliente_email, cliente_telefone');
  
  if (dataInicio) {
    query = query.gte('created', dataInicio);
  }
  if (dataFim) {
    query = query.lte('created', dataFim + 'T23:59:59');
  }
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data: pedidos } = await query.order('created', { ascending: false });
  
  // Calcula totais
  const totalVendas = pedidos?.reduce((sum: number, p: any) => sum + (parseFloat(p.valor_total) || 0), 0) || 0;
  const totalPedidos = pedidos?.length || 0;
  const ticketMedio = totalPedidos > 0 ? totalVendas / totalPedidos : 0;

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="box box-white">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <div className="row">
              <div className="col-sm-8">
                <h2><i className="lni lni-delivery"></i> Relatório de Pedidos</h2>
              </div>
              <div className="col-sm-4 text-right">
                <Link href="/administracao/relatorios" className="btn btn-default">
                  <i className="lni lni-arrow-left"></i> Voltar
                </Link>
              </div>
            </div>
          </div>
          
          {/* Filtros */}
          <div className="row" style={{ marginBottom: '20px' }}>
            <div className="col-md-12">
              <form className="form-inline">
                <div className="form-group" style={{ marginRight: '10px' }}>
                  <label>De:</label>
                  <input type="date" name="data_inicio" className="form-control" defaultValue={dataInicio} />
                </div>
                <div className="form-group" style={{ marginRight: '10px' }}>
                  <label>Até:</label>
                  <input type="date" name="data_fim" className="form-control" defaultValue={dataFim} />
                </div>
                <div className="form-group" style={{ marginRight: '10px' }}>
                  <label>Status:</label>
                  <select name="status" className="form-control" defaultValue={status}>
                    <option value="">Todos</option>
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                    <option value="entregue">Entregue</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  <i className="lni lni-search"></i> Filtrar
                </button>
              </form>
            </div>
          </div>
          
          {/* Cards de Resumo */}
          <div className="row" style={{ marginBottom: '20px' }}>
            <div className="col-md-4">
              <div className="alert alert-success">
                <h4>Total em Vendas</h4>
                <span style={{ fontSize: '24px' }}>R$ {totalVendas.toFixed(2)}</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="alert alert-info">
                <h4>Total de Pedidos</h4>
                <span style={{ fontSize: '24px' }}>{totalPedidos}</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="alert alert-warning">
                <h4>Ticket Médio</h4>
                <span style={{ fontSize: '24px' }}>R$ {ticketMedio.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Tabela */}
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Telefone</th>
                  <th>Valor</th>
                  <th>Forma Pagamento</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {!pedidos || pedidos.length === 0 ? (
                  <tr><td colSpan={7} className="text-center">Nenhum pedido encontrado no período</td></tr>
                ) : (
                  pedidos.map((pedido: any) => (
                    <tr key={pedido.id}>
                      <td>#{pedido.id}</td>
                      <td>{pedido.cliente_nome || 'N/A'}<br/><small className="text-muted">{pedido.cliente_email}</small></td>
                      <td>{pedido.cliente_telefone || 'N/A'}</td>
                      <td>R$ {parseFloat(pedido.valor_total || 0).toFixed(2)}</td>
                      <td>{pedido.forma_pagamento || 'N/A'}</td>
                      <td>
                        <span className={`badge ${
                          pedido.status === 'entregue' ? 'badge-success' :
                          pedido.status === 'cancelado' ? 'badge-danger' :
                          'badge-warning'
                        }`}>
                          {pedido.status || 'Pendente'}
                        </span>
                      </td>
                      <td>{pedido.created ? new Date(pedido.created).toLocaleDateString('pt-BR') : '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
