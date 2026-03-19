import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function SaquesPage() {
  const session = await getSession();
  
  if (!session || session.nivel !== 3) {
    redirect('/login');
  }

  const afiliadoId = session.afiliado_id || session.id;
  const supabase = await createClient();
  
  // Busca saques
  const { data: saques } = await (supabase
    .from('saques') as any)
    .select('id, valor, status, forma_pagamento, data_solicitacao, data_pagamento')
    .eq('afiliado_id', afiliadoId)
    .order('data_solicitacao', { ascending: false });
  
  // Total disponível para saque (comissões pendentes)
  const { data: comissoes } = await (supabase
    .from('comissoes') as any)
    .select('valor')
    .eq('afiliado_id', afiliadoId)
    .eq('status', 'pendente');
  
  const valorDisponivel = comissoes?.reduce((sum: number, c: any) => sum + (parseFloat(c.valor) || 0), 0) || 0;

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="box box-white">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <h2><i className="lni lni-wallet"></i> Saques</h2>
          </div>
          
          {/* Card de Saldo Disponível */}
          <div className="row" style={{ marginBottom: '20px' }}>
            <div className="col-md-6">
              <div className="alert alert-success">
                <h4>Saldo Disponível para Saque</h4>
                <span style={{ fontSize: '36px', fontWeight: 'bold' }}>R$ {valorDisponivel.toFixed(2)}</span>
              </div>
            </div>
            <div className="col-md-6 text-right">
              <Link href="/afiliado/saques/solicitar" className="btn btn-success btn-lg">
                <i className="lni lni-wallet"></i> Solicitar Saque
              </Link>
            </div>
          </div>
          
          <hr />
          
          <h4><i className="lni lni-list"></i> Histórico de Saques</h4>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Valor</th>
                  <th>Forma de Pagamento</th>
                  <th>Status</th>
                  <th>Data Solicitação</th>
                  <th>Data Pagamento</th>
                </tr>
              </thead>
              <tbody>
                {!saques || saques.length === 0 ? (
                  <tr><td colSpan={6} className="text-center">Nenhum saque solicitado</td></tr>
                ) : (
                  saques.map((saque: any) => (
                    <tr key={saque.id}>
                      <td>#{saque.id}</td>
                      <td>R$ {parseFloat(saque.valor || 0).toFixed(2)}</td>
                      <td>{saque.forma_pagamento || 'Pix'}</td>
                      <td>
                        <span className={`badge ${
                          saque.status === 'pago' ? 'badge-success' :
                          saque.status === 'processando' ? 'badge-info' :
                          'badge-warning'
                        }`}>
                          {saque.status === 'pago' ? 'Pago' : saque.status === 'processando' ? 'Processando' : 'Pendente'}
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
          
          {/* Informações */}
          <div className="alert alert-info">
            <h4><i className="lni lni-information"></i> Informações sobre Saques</h4>
            <ul>
              <li>O valor mínimo para saque é de R$ 50,00</li>
              <li>Os saques são processados em até 5 dias úteis</li>
              <li>O pagamento é realizado via Pix</li>
              <li>Você receberá um email quando o pagamento for processado</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
