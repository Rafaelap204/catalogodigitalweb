import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function RelatorioAssinaturasPage() {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  const supabase = await createClient();
  
  // Busca assinaturas
  const { data: assinaturas } = await (supabase
    .from('assinaturas') as any)
    .select('id, usuario_id, plano_id, status, data_inicio, data_fim, valor')
    .order('created', { ascending: false });
  
  // Totais
  const totalAtivos = assinaturas?.filter((a: any) => a.status === 'ativo').length || 0;
  const totalCancelados = assinaturas?.filter((a: any) => a.status === 'cancelado').length || 0;
  const totalVencidos = assinaturas?.filter((a: any) => a.status === 'vencido').length || 0;
  const receitaMensal = assinaturas?.filter((a: any) => a.status === 'ativo').reduce((sum: number, a: any) => sum + (parseFloat(a.valor) || 0), 0) || 0;

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="box box-white">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <div className="row">
              <div className="col-sm-8">
                <h2><i className="lni lni-credit-cards"></i> Relatório de Assinaturas</h2>
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
            <div className="col-md-3">
              <div className="alert alert-success">
                <h4>Assinaturas Ativas</h4>
                <span style={{ fontSize: '24px' }}>{totalAtivos}</span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="alert alert-danger">
                <h4>Canceladas</h4>
                <span style={{ fontSize: '24px' }}>{totalCancelados}</span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="alert alert-warning">
                <h4>Vencidas</h4>
                <span style={{ fontSize: '24px' }}>{totalVencidos}</span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="alert alert-info">
                <h4>Receita Mensal</h4>
                <span style={{ fontSize: '24px' }}>R$ {receitaMensal.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Tabela */}
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuário</th>
                  <th>Plano</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Início</th>
                  <th>Término</th>
                </tr>
              </thead>
              <tbody>
                {!assinaturas || assinaturas.length === 0 ? (
                  <tr><td colSpan={7} className="text-center">Nenhuma assinatura encontrada</td></tr>
                ) : (
                  assinaturas.map((assinatura: any) => (
                    <tr key={assinatura.id}>
                      <td>#{assinatura.id}</td>
                      <td>#{assinatura.usuario_id}</td>
                      <td>#{assinatura.plano_id}</td>
                      <td>R$ {parseFloat(assinatura.valor || 0).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${
                          assinatura.status === 'ativo' ? 'badge-success' :
                          assinatura.status === 'cancelado' ? 'badge-danger' :
                          'badge-warning'
                        }`}>
                          {assinatura.status || 'N/A'}
                        </span>
                      </td>
                      <td>{assinatura.data_inicio ? new Date(assinatura.data_inicio).toLocaleDateString('pt-BR') : '-'}</td>
                      <td>{assinatura.data_fim ? new Date(assinatura.data_fim).toLocaleDateString('pt-BR') : '-'}</td>
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
