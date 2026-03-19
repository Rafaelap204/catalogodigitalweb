import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function GerenciarSaquesPage() {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  const supabase = await createClient();
  
  // Busca saques pendentes
  const { data: saquesPendentes } = await (supabase
    .from('saques') as any)
    .select('id, afiliado_id, valor, status, data_solicitacao')
    .eq('status', 'pendente')
    .order('data_solicitacao', { ascending: true });
  
  // Busca todos os saques
  const { data: todosSaques } = await (supabase
    .from('saques') as any)
    .select('id, afiliado_id, valor, status, data_solicitacao, data_pagamento')
    .order('data_solicitacao', { ascending: false })
    .limit(50);
  
  // Total pendentes
  const totalPendentes = saquesPendentes?.reduce((sum: number, s: any) => sum + (parseFloat(s.valor) || 0), 0) || 0;

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="box box-white">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <h2><i className="lni lni-wallet"></i> Gerenciar Saques</h2>
          </div>
          
          {/* Alert de saques pendentes */}
          {(saquesPendentes?.length || 0) > 0 && (
            <div className="alert alert-warning">
              <h4><i className="lni lni-alarm"></i> Saques Pendentes</h4>
              <p>Existem <strong>{saquesPendentes?.length}</strong> saques pendentes no valor total de <strong>R$ {totalPendentes.toFixed(2)}</strong></p>
            </div>
          )}
          
          {/* Tabela de Saques Pendentes */}
          {(saquesPendentes?.length || 0) > 0 && (
            <>
              <h4><i className="lni lni-timer"></i> Saques Pendentes</h4>
              <div className="table-responsive" style={{ marginBottom: '30px' }}>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Afiliado</th>
                      <th>Valor</th>
                      <th>Data Solicitação</th>
                      <th className="text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {saquesPendentes?.map((saque: any) => (
                      <tr key={saque.id}>
                        <td>#{saque.id}</td>
                        <td>#{saque.afiliado_id}</td>
                        <td>R$ {parseFloat(saque.valor || 0).toFixed(2)}</td>
                        <td>{saque.data_solicitacao ? new Date(saque.data_solicitacao).toLocaleDateString('pt-BR') : '-'}</td>
                        <td className="text-center">
                          <Link href={`/administracao/saques/aprovar?id=${saque.id}`} className="btn btn-success btn-sm" style={{ marginRight: '5px' }}>
                            <i className="lni lni-checkmark"></i> Aprovar
                          </Link>
                          <Link href={`/administracao/saques/rejeitar?id=${saque.id}`} className="btn btn-danger btn-sm">
                            <i className="lni lni-close"></i> Rejeitar
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          
          {/* Todos os Saques */}
          <h4><i className="lni lni-list"></i> Histórico de Saques</h4>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Afiliado</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Data Solicitação</th>
                  <th>Data Pagamento</th>
                </tr>
              </thead>
              <tbody>
                {!todosSaques || todosSaques.length === 0 ? (
                  <tr><td colSpan={6} className="text-center">Nenhum saque registrado</td></tr>
                ) : (
                  todosSaques.map((saque: any) => (
                    <tr key={saque.id}>
                      <td>#{saque.id}</td>
                      <td>#{saque.afiliado_id}</td>
                      <td>R$ {parseFloat(saque.valor || 0).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${
                          saque.status === 'pago' ? 'badge-success' :
                          saque.status === 'rejeitado' ? 'badge-danger' :
                          'badge-warning'
                        }`}>
                          {saque.status === 'pago' ? 'Pago' : saque.status === 'rejeitado' ? 'Rejeitado' : 'Pendente'}
                        </span>
                      </td>
                      <td>{saque.data_solicitacao ? new Date(saque.data_solicitacao).toLocaleDateString('pt-BR') : '-'}</td>
                      <td>{saque.data_pagamento ? new Date(saque.data_pagamento).toLocaleDateString('pt-BR') : '-'}</td>
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
