import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

// Componente Card para o dashboard
function DashboardCard({ icon, title, value, link, color }: { icon: string; title: string; value: string | number; link: string; color: string }) {
  return (
    <div className="col-md-3" style={{ marginBottom: '20px' }}>
      <Link href={link} className="text-decoration-none">
        <div className="box box-white" style={{ borderLeft: `4px solid ${color}`, padding: '20px', display: 'block', textDecoration: 'none' }}>
          <div className="row">
            <div className="col-xs-3">
              <i className={`lni ${icon}`} style={{ fontSize: '48px', color }}></i>
            </div>
            <div className="col-xs-9 text-right">
              <div style={{ fontSize: '32px', fontWeight: 'bold', color }}>{value}</div>
              <div style={{ color: '#666' }}>{title}</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default async function PainelPage() {
  const session = await getSession();
  
  if (!session || session.nivel !== 2) {
    redirect('/login');
  }

  const supabase = await createClient();
  
  // Buscar estatísticas do estabelecimento
  const { count: totalProdutos } = await supabase
    .from('produtos')
    .select('*', { count: 'exact', head: true })
    .eq('estabelecimento_id', session.estabelecimento_id);

  const { count: totalPedidosHoje } = await supabase
    .from('pedidos')
    .select('*', { count: 'exact', head: true })
    .eq('estabelecimento_id', session.estabelecimento_id)
    .gte('created', new Date().toISOString().split('T')[0]);

  const { count: totalPedidosPendentes } = await supabase
    .from('pedidos')
    .select('*', { count: 'exact', head: true })
    .eq('estabelecimento_id', session.estabelecimento_id)
    .eq('status', 'pendente');

  const { data: pedidosRecentes } = await supabase
    .from('pedidos')
    .select('id, cliente_nome, valor_total, status, created')
    .eq('estabelecimento_id', session.estabelecimento_id)
    .order('created', { ascending: false })
    .limit(5);

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-md-8">
            <h2><i className="lni lni-dashboard"></i> Dashboard</h2>
            <p className="text-muted">Bem-vindo ao painel do estabelecimento</p>
          </div>
        </div>

        {/* Cards */}
        <div className="row">
          <DashboardCard icon="lni-cart" title="Produtos" value={totalProdutos || 0} link="/painel/produtos" color="#28a745" />
          <DashboardCard icon="lni-delivery" title="Pedidos Hoje" value={totalPedidosHoje || 0} link="/painel/pedidos" color="#007bff" />
          <DashboardCard icon="lni-alarm" title="Pendentes" value={totalPedidosPendentes || 0} link="/painel/pedidos?status=pendente" color="#ffc107" />
          <DashboardCard icon="lni-star" title="Avaliações" value="0" link="/painel/avaliacoes" color="#17a2b8" />
        </div>

        {/* Pedidos Recentes */}
        <div className="row" style={{ marginTop: '20px' }}>
          <div className="col-md-12">
            <div className="box box-white">
              <h4 style={{ marginBottom: '20px' }}><i className="lni lni-time"></i> Pedidos Recentes</h4>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Pedido</th>
                      <th>Cliente</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!pedidosRecentes || pedidosRecentes.length === 0 ? (
                      <tr><td colSpan={5} className="text-center">Nenhum pedido recente</td></tr>
                    ) : (
                      pedidosRecentes.map((pedido) => (
                        <tr key={pedido.id}>
                          <td><Link href={`/painel/pedidos/visualizar?id=${pedido.id}`}>#{pedido.id}</Link></td>
                          <td>{pedido.cliente_nome || 'N/A'}</td>
                          <td>R$ {pedido.valor_total?.toFixed(2)}</td>
                          <td>
                            <span className={`badge ${
                              pedido.status === 'entregue' ? 'badge-success' :
                              pedido.status === 'cancelado' ? 'badge-danger' :
                              pedido.status === 'pendente' ? 'badge-warning' : 'badge-info'
                            }`}>
                              {pedido.status}
                            </span>
                          </td>
                          <td>{pedido.created ? new Date(pedido.created).toLocaleDateString('pt-BR') : '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="text-right">
                <Link href="/painel/pedidos" className="btn btn-default btn-sm">Ver Todos</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
