import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function RelatoriosPage() {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const supabase = await createClient();
  
  // Busca estatísticas gerais
  const { count: totalEstabelecimentos } = await supabase
    .from('estabelecimentos')
    .select('*', { count: 'exact', head: true });
  
  const { count: totalProdutos } = await supabase
    .from('produtos')
    .select('*', { count: 'exact', head: true });
  
  const { count: totalUsuarios } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });
  
  const { count: totalPedidos } = await supabase
    .from('pedidos')
    .select('*', { count: 'exact', head: true });
  
  const { count: totalAfiliados } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('level', 3);

  // Vendas do mês
  const hoje = new Date();
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString();
  
  const { data: vendasMes } = await (supabase
    .from('pedidos') as any)
    .select('valor_total')
    .gte('created', inicioMes)
    .eq('status', 'entregue');
  
  const totalVendasMes = vendasMes?.reduce((sum: number, p: any) => sum + (parseFloat(p.valor_total) || 0), 0) || 0;

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="box box-white">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <h2><i className="lni lni-bar-chart"></i> Relatórios</h2>
          </div>
          
          {/* Cards de Resumo */}
          <div className="row" style={{ marginBottom: '30px' }}>
            <div className="col-md-4" style={{ marginBottom: '20px' }}>
              <div className="alert alert-info">
                <div className="row">
                  <div className="col-xs-3">
                    <i className="lni lni-home" style={{ fontSize: '36px' }}></i>
                  </div>
                  <div className="col-xs-9 text-right">
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{totalEstabelecimentos || 0}</div>
                    <div>Estabelecimentos</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4" style={{ marginBottom: '20px' }}>
              <div className="alert alert-success">
                <div className="row">
                  <div className="col-xs-3">
                    <i className="lni lni-cart" style={{ fontSize: '36px' }}></i>
                  </div>
                  <div className="col-xs-9 text-right">
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{totalProdutos || 0}</div>
                    <div>Produtos</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4" style={{ marginBottom: '20px' }}>
              <div className="alert alert-warning">
                <div className="row">
                  <div className="col-xs-3">
                    <i className="lni lni-users" style={{ fontSize: '36px' }}></i>
                  </div>
                  <div className="col-xs-9 text-right">
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{totalUsuarios || 0}</div>
                    <div>Usuários</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row" style={{ marginBottom: '30px' }}>
            <div className="col-md-4" style={{ marginBottom: '20px' }}>
              <div className="alert alert-primary" style={{ backgroundColor: '#007bff', color: 'white' }}>
                <div className="row">
                  <div className="col-xs-3">
                    <i className="lni lni-delivery" style={{ fontSize: '36px' }}></i>
                  </div>
                  <div className="col-xs-9 text-right">
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{totalPedidos || 0}</div>
                    <div>Pedidos</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4" style={{ marginBottom: '20px' }}>
              <div className="alert alert-danger">
                <div className="row">
                  <div className="col-xs-3">
                    <i className="lni lni-handshake" style={{ fontSize: '36px' }}></i>
                  </div>
                  <div className="col-xs-9 text-right">
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{totalAfiliados || 0}</div>
                    <div>Afiliados</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4" style={{ marginBottom: '20px' }}>
              <div className="alert alert-success" style={{ backgroundColor: '#28a745', color: 'white' }}>
                <div className="row">
                  <div className="col-xs-3">
                    <i className="lni lni-coin" style={{ fontSize: '36px' }}></i>
                  </div>
                  <div className="col-xs-9 text-right">
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>R$ {totalVendasMes.toFixed(2)}</div>
                    <div>Vendas do Mês</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Links para Relatórios Detalhados */}
          <div className="row">
            <div className="col-md-6">
              <div className="box box-white" style={{ background: '#f9f9f9' }}>
                <h4><i className="lni lni-dollar"></i> Relatórios Financeiros</h4>
                <hr />
                <ul className="list-unstyled">
                  <li style={{ marginBottom: '10px' }}>
                    <Link href="/administracao/relatorios/vendas" className="btn btn-default btn-block text-left">
                      <i className="lni lni-cart"></i> Relatório de Vendas
                    </Link>
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <Link href="/administracao/relatorios/assinaturas" className="btn btn-default btn-block text-left">
                      <i className="lni lni-credit-cards"></i> Relatório de Assinaturas
                    </Link>
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <Link href="/administracao/relatorios/comissoes" className="btn btn-default btn-block text-left">
                      <i className="lni lni-coin"></i> Relatório de Comissões
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-6">
              <div className="box box-white" style={{ background: '#f9f9f9' }}>
                <h4><i className="lni lni-bar-chart"></i> Relatórios Operacionais</h4>
                <hr />
                <ul className="list-unstyled">
                  <li style={{ marginBottom: '10px' }}>
                    <Link href="/administracao/relatorios/pedidos" className="btn btn-default btn-block text-left">
                      <i className="lni lni-delivery"></i> Relatório de Pedidos
                    </Link>
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <Link href="/administracao/relatorios/estabelecimentos" className="btn btn-default btn-block text-left">
                      <i className="lni lni-home"></i> Relatório de Estabelecimentos
                    </Link>
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <Link href="/administracao/relatorios/usuarios" className="btn btn-default btn-block text-left">
                      <i className="lni lni-users"></i> Relatório de Usuários
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
