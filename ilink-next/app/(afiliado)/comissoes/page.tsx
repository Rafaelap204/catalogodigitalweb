import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function ComissoesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  
  if (!session || session.nivel !== 3) {
    redirect('/login');
  }

  const params = await searchParams;
  const pagina = params.pag ? parseInt(String(params.pag)) : 1;
  const offset = (pagina - 1) * 20;
  
  const afiliadoId = session.afiliado_id || session.id;
  const supabase = await createClient();
  
  // Busca comissões do afiliado
  const { data: comissoes } = await (supabase
    .from('comissoes') as any)
    .select('id, valor, status, data_pedido, descricao, created')
    .eq('afiliado_id', afiliadoId)
    .order('created', { ascending: false })
    .range(offset, offset + 19);
  
  // Totais
  const { data: todasComissoes } = await (supabase
    .from('comissoes') as any)
    .select('valor, status')
    .eq('afiliado_id', afiliadoId);
  
  const totalGeral = todasComissoes?.reduce((sum: number, c: any) => sum + (parseFloat(c.valor) || 0), 0) || 0;
  const totalPago = todasComissoes?.filter((c: any) => c.status === 'pago').reduce((sum: number, c: any) => sum + (parseFloat(c.valor) || 0), 0) || 0;
  const totalPendente = todasComissoes?.filter((c: any) => c.status === 'pendente').reduce((sum: number, c: any) => sum + (parseFloat(c.valor) || 0), 0) || 0;

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="box box-white">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <h2><i className="lni lni-coin"></i> Minhas Comissões</h2>
          </div>
          
          {/* Cards de Total */}
          <div className="row" style={{ marginBottom: '20px' }}>
            <div className="col-md-4">
              <div className="alert alert-info">
                <strong>Total em Comissões:</strong><br />
                <span style={{ fontSize: '24px' }}>R$ {totalGeral.toFixed(2)}</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="alert alert-success">
                <strong>Comissões Pagas:</strong><br />
                <span style={{ fontSize: '24px' }}>R$ {totalPago.toFixed(2)}</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="alert alert-warning">
                <strong>Comissões Pendentes:</strong><br />
                <span style={{ fontSize: '24px' }}>R$ {totalPendente.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {!comissoes || comissoes.length === 0 ? (
                  <tr><td colSpan={5} className="text-center">Nenhuma comissão registrada</td></tr>
                ) : (
                  comissoes.map((comissao: any) => (
                    <tr key={comissao.id}>
                      <td>#{comissao.id}</td>
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
