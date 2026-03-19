import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function VisualizarAssinaturaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  const params = await searchParams;
  const assinaturaId = params.id;
  
  if (!assinaturaId) {
    redirect('/administracao/assinaturas');
  }

  const supabase = await createClient();
  
  // Busca assinatura
  const { data: assinatura } = await (supabase
    .from('assinaturas') as any)
    .select('id, usuario_id, plano_id, status, data_inicio, data_fim, valor, forma_pagamento, created')
    .eq('id', assinaturaId)
    .single();

  // Busca dados do usuário
  const { data: usuario } = await (supabase
    .from('users') as any)
    .select('nome, email')
    .eq('id', assinatura?.usuario_id)
    .single();

  // Busca dados do plano
  const { data: plano } = await (supabase
    .from('planos') as any)
    .select('nome, descricao')
    .eq('id', assinatura?.plano_id)
    .single();

  if (!assinatura) {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="alert alert-danger">
            <i className="lni lni-close"></i> Assinatura não encontrada.
          </div>
          <Link href="/administracao/assinaturas" className="btn btn-default">
            <i className="lni lni-arrow-left"></i> Voltar
          </Link>
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
                <h2><i className="lni lni-credit-cards"></i> Assinatura #{assinatura.id}</h2>
              </div>
              <div className="col-sm-4 text-right">
                <Link href="/administracao/assinaturas" className="btn btn-default">
                  <i className="lni lni-arrow-left"></i> Voltar
                </Link>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <h4><i className="lni lni-user"></i> Dados do Usuário</h4>
              <table className="table table-striped">
                <tbody>
                  <tr><td><strong>ID:</strong></td><td>#{assinatura.usuario_id}</td></tr>
                  <tr><td><strong>Nome:</strong></td><td>{usuario?.nome || 'N/A'}</td></tr>
                  <tr><td><strong>Email:</strong></td><td>{usuario?.email || 'N/A'}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <h4><i className="lni lni-layers"></i> Dados do Plano</h4>
              <table className="table table-striped">
                <tbody>
                  <tr><td><strong>ID:</strong></td><td>#{assinatura.plano_id}</td></tr>
                  <tr><td><strong>Nome:</strong></td><td>{plano?.nome || 'N/A'}</td></tr>
                  <tr><td><strong>Descrição:</strong></td><td>{plano?.descricao || 'N/A'}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <hr />
          
          <h4><i className="lni lni-credit-cards"></i> Dados da Assinatura</h4>
          <div className="row">
            <div className="col-md-6">
              <table className="table table-striped">
                <tbody>
                  <tr><td><strong>ID:</strong></td><td>#{assinatura.id}</td></tr>
                  <tr><td><strong>Valor:</strong></td><td>R$ {parseFloat(assinatura.valor || 0).toFixed(2)}</td></tr>
                  <tr><td><strong>Forma de Pagamento:</strong></td><td>{assinatura.forma_pagamento || 'N/A'}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <table className="table table-striped">
                <tbody>
                  <tr><td><strong>Status:</strong></td><td><span className={`badge ${assinatura.status === 'ativo' ? 'badge-success' : assinatura.status === 'cancelado' ? 'badge-danger' : 'badge-warning'}`}>{assinatura.status || 'N/A'}</span></td></tr>
                  <tr><td><strong>Data de Início:</strong></td><td>{assinatura.data_inicio ? new Date(assinatura.data_inicio).toLocaleDateString('pt-BR') : '-'}</td></tr>
                  <tr><td><strong>Data de Término:</strong></td><td>{assinatura.data_fim ? new Date(assinatura.data_fim).toLocaleDateString('pt-BR') : '-'}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <hr />
          
          <div className="text-right">
            <Link href={`/administracao/assinaturas/editar?id=${assinatura.id}`} className="btn btn-primary">
              <i className="lni lni-pencil"></i> Editar Assinatura
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
