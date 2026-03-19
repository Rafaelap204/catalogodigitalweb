import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function VisualizarCupomPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  const params = await searchParams;
  const cupomId = params.id;
  
  if (!cupomId) {
    redirect('/administracao/cupons');
  }

  const supabase = await createClient();
  
  const { data: cupom } = await (supabase
    .from('cupons') as any)
    .select('id, codigo, tipo, valor, valor_minimo, data_inicio, data_fim, limite_uso, uso_atual, status, created')
    .eq('id', cupomId)
    .single();

  if (!cupom) {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="alert alert-danger">Cupom não encontrado.</div>
          <Link href="/administracao/cupons" className="btn btn-default">Voltar</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="box box-white">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <div className="row">
              <div className="col-sm-8">
                <h2><i className="lni lni-ticket"></i> Cupom #{cupom.id}</h2>
              </div>
              <div className="col-sm-4 text-right">
                <Link href="/administracao/cupons" className="btn btn-default">
                  <i className="lni lni-arrow-left"></i> Voltar
                </Link>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <table className="table table-striped">
                <tbody>
                  <tr><td><strong>ID:</strong></td><td>#{cupom.id}</td></tr>
                  <tr><td><strong>Código:</strong></td><td><code style={{ fontSize: '18px', padding: '5px 10px' }}>{cupom.codigo}</code></td></tr>
                  <tr><td><strong>Tipo:</strong></td><td>{cupom.tipo === 'percentual' ? 'Percentual (%)' : 'Valor Fixo (R$)'}</td></tr>
                  <tr><td><strong>Valor:</strong></td><td>{cupom.tipo === 'percentual' ? `${cupom.valor}%` : `R$ ${parseFloat(cupom.valor).toFixed(2)}`}</td></tr>
                  <tr><td><strong>Valor Mínimo:</strong></td><td>{cupom.valor_minimo ? `R$ ${parseFloat(cupom.valor_minimo).toFixed(2)}` : 'N/A'}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <table className="table table-striped">
                <tbody>
                  <tr><td><strong>Status:</strong></td><td><span className={`badge ${cupom.status === 'ativo' ? 'badge-success' : 'badge-danger'}`}>{cupom.status === 'ativo' ? 'Ativo' : 'Inativo'}</span></td></tr>
                  <tr><td><strong>Data de Início:</strong></td><td>{cupom.data_inicio ? new Date(cupom.data_inicio).toLocaleDateString('pt-BR') : '-'}</td></tr>
                  <tr><td><strong>Data de Término:</strong></td><td>{cupom.data_fim ? new Date(cupom.data_fim).toLocaleDateString('pt-BR') : '-'}</td></tr>
                  <tr><td><strong>Limite de Uso:</strong></td><td>{cupom.limite_uso || 'Ilimitado'}</td></tr>
                  <tr><td><strong>Uso Atual:</strong></td><td>{cupom.uso_atual || 0}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <hr />
          
          <div className="text-right">
            <Link href={`/administracao/cupons/editar?id=${cupom.id}`} className="btn btn-primary" style={{ marginRight: '5px' }}>
              <i className="lni lni-pencil"></i> Editar
            </Link>
            <Link href={`/administracao/cupons/deletar?id=${cupom.id}`} className="btn btn-danger">
              <i className="lni lni-trash"></i> Deletar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
