import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function IndicadosPage({
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
  
  // Busca indicados do afiliado
  const { data: indicados } = await (supabase
    .from('users') as any)
    .select('id, nome, email, nivel, data_cadastro, status')
    .eq('indicado_por', afiliadoId)
    .order('data_cadastro', { ascending: false })
    .range(offset, offset + 19);
  
  // Totais
  const { count: totalIndicados } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('indicado_por', afiliadoId);
  
  const { count: totalPremium } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('indicado_por', afiliadoId)
    .eq('nivel', 2);

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="box box-white">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <h2><i className="lni lni-users"></i> Meus Indicados</h2>
          </div>
          
          {/* Cards de Total */}
          <div className="row" style={{ marginBottom: '20px' }}>
            <div className="col-md-6">
              <div className="alert alert-info">
                <h4>Total de Indicados</h4>
                <span style={{ fontSize: '32px' }}>{totalIndicados || 0}</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="alert alert-success">
                <h4>Indicados Assinantes</h4>
                <span style={{ fontSize: '32px' }}>{totalPremium || 0}</span>
              </div>
            </div>
          </div>
          
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Data de Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {!indicados || indicados.length === 0 ? (
                  <tr><td colSpan={5} className="text-center">Você ainda não indicou ninguém. <a href="/afiliado/link">Compartilhe seu link!</a></td></tr>
                ) : (
                  indicados.map((user: any) => (
                    <tr key={user.id}>
                      <td>{user.nome}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${user.nivel === 2 ? 'badge-success' : 'badge-default'}`}>
                          {user.nivel === 2 ? 'Assinante' : 'Usuário'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${user.status == 1 ? 'badge-success' : 'badge-danger'}`}>
                          {user.status == 1 ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>{user.data_cadastro ? new Date(user.data_cadastro).toLocaleDateString('pt-BR') : '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {(totalIndicados || 0) > 20 && (
            <div className="text-right">
              <p>Página {pagina}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
