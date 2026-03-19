import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function RelatorioComissoesPage() {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  const supabase = await createClient();
  
  // Busca comissões
  const { data: comissoes } = await (supabase
    .from('comissoes') as any)
    .select('id, afiliado_id, valor, status, data_pedido, descricao, created')
    .order('created', { ascending: false });
  
  // Totais
  const totalGeral = comissoes?.reduce((sum: number, c: any) => sum + (parseFloat(c.valor) || 0), 0) || 0;
  const totalPago = comissoes?.filter((c: any) => c.status === 'pago').reduce((sum: number, c: any) => sum + (parseFloat(c.valor) || 0), 0) || 0;
  const totalPendente = comissoes?.filter((c: any) => c.status === 'pendente').reduce((sum: number, c: any) => sum + (parseFloat(c.valor) || 0), 0) || 0;

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="box box-white">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <div className="row">
              <div className="col-sm-8">
                <h2><i className="lni lni-coin"></i> Relatório de Comissões</h2>
              </div>
              <div className="col-sm-4 text-right">
                <Link href="/administracao/relatorios" className="btn btn-default">
                  <i className="lni lni-arrow-left"></i> Voltar
                </Link>
              </div>
            </div>
          </div>
          
          {/* Cards de Resumo */}
          <div className="row" style={{ marginBottom: '20px' }}>
            <div className="col-md-4">
              <div className="alert alert-info">
                <h4>Total em Comissões</h4>
                <span style={{ fontSize: '24px' }}>R$ {totalGeral.toFixed(2)}</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="alert alert-success">
                <h4>Comissões Pagas</h4>
                <span style={{ fontSize: '24px' }}>R$ {totalPago.toFixed(2)}</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="alert alert-warning">
                <h4>Comissões Pendentes</h4>
                <span style={{ fontSize: '24px' }}>R$ {totalPendente.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Tabela */}
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Afiliado</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {!comissoes || comissoes.length === 0 ? (
                  <tr><td colSpan={6} className="text-center">Nenhuma comissão encontrada</td></tr>
                ) : (
                  comissoes.map((comissao: any) => (
                    <tr key={comissao.id}>
                      <td>#{comissao.id}</td>
                      <td>#{comissao.afiliado_id}</td>
                      <td>{comissao.descricao || 'Comissão'}</td>
                      <td>R$ {parseFloat(comissao.valor || 0).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${comissao.status === 'pago' ? 'badge-success' : 'badge-warning'}`}>
                          {comissao.status === 'pago' ? 'Pago' : 'Pendente'}
                        </span>
                      </td>
                      <td>{comissao.created ? new Date(comissao.created).toLocaleDateString('pt-BR') : '-'}</td>
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
