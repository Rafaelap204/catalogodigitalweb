import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function VisualizarPlanoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  const params = await searchParams;
  const planoId = params.id;
  
  if (!planoId) {
    redirect('/administracao/planos');
  }

  const supabase = await createClient();
  
  const { data: plano } = await (supabase
    .from('planos') as any)
    .select('id, nome, descricao, preco, periodicidade, recursos, status, created')
    .eq('id', planoId)
    .single();

  if (!plano) {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="alert alert-danger">Plano não encontrado.</div>
          <Link href="/administracao/planos" className="btn btn-default">Voltar</Link>
        </div>
      </div>
    );
  }

  // Parse recursos
  const recursos = plano.recursos ? JSON.parse(plano.recursos) : [];

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="box box-white">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <div className="row">
              <div className="col-sm-8">
                <h2><i className="lni lni-layers"></i> Plano #{plano.id}</h2>
              </div>
              <div className="col-sm-4 text-right">
                <Link href="/administracao/planos" className="btn btn-default">
                  <i className="lni lni-arrow-left"></i> Voltar
                </Link>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <table className="table table-striped">
                <tbody>
                  <tr><td><strong>ID:</strong></td><td>#{plano.id}</td></tr>
                  <tr><td><strong>Nome:</strong></td><td>{plano.nome}</td></tr>
                  <tr><td><strong>Preço:</strong></td><td>R$ {parseFloat(plano.preco || 0).toFixed(2)}</td></tr>
                  <tr><td><strong>Periodicidade:</strong></td><td>{plano.periodicidade === 'mensal' ? 'Mensal' : plano.periodicidade === 'anual' ? 'Anual' : plano.periodicidade}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <table className="table table-striped">
                <tbody>
                  <tr><td><strong>Status:</strong></td><td><span className={`badge ${plano.status === 'ativo' ? 'badge-success' : 'badge-danger'}`}>{plano.status === 'ativo' ? 'Ativo' : 'Inativo'}</span></td></tr>
                  <tr><td><strong>Data de Criação:</strong></td><td>{plano.created ? new Date(plano.created).toLocaleDateString('pt-BR') : '-'}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {plano.descricao && (
            <>
              <hr />
              <h4><i className="lni lni-text-align-left"></i> Descrição</h4>
              <p>{plano.descricao}</p>
            </>
          )}
          
          {recursos.length > 0 && (
            <>
              <hr />
              <h4><i className="lni lni-checkmark-circle"></i> Recursos Inclusos</h4>
              <ul>
                {recursos.map((recurso: string, index: number) => (
                  <li key={index}>{recurso}</li>
                ))}
              </ul>
            </>
          )}
          
          <hr />
          
          <div className="text-right">
            <Link href={`/administracao/planos/editar?id=${plano.id}`} className="btn btn-primary" style={{ marginRight: '5px' }}>
              <i className="lni lni-pencil"></i> Editar
            </Link>
            <Link href={`/administracao/planos/deletar?id=${plano.id}`} className="btn btn-danger">
              <i className="lni lni-trash"></i> Deletar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
