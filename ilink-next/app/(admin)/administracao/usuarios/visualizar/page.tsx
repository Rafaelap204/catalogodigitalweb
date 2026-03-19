import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function VisualizarUsuarioPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  const params = await searchParams;
  const usuarioId = params.id;
  
  if (!usuarioId) {
    redirect('/administracao/usuarios');
  }

  const supabase = await createClient();
  
  // Busca usuário
  const { data: usuario } = await (supabase
    .from('users') as any)
    .select('id, nome, email, telefone, whatsapp, avatar, level, status, data_cadastro, indicado_por')
    .eq('id', usuarioId)
    .single();

  // Busca assinatura ativa
  const { data: assinatura } = await (supabase
    .from('assinaturas') as any)
    .select('id, plano_id, status, data_fim, valor')
    .eq('usuario_id', usuarioId)
    .eq('status', 'ativo')
    .single();

  if (!usuario) {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="alert alert-danger">
            <i className="lni lni-close"></i> Usuário não encontrado.
          </div>
          <Link href="/administracao/usuarios" className="btn btn-default">
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
                <h2><i className="lni lni-user"></i> Usuário #{usuario.id}</h2>
              </div>
              <div className="col-sm-4 text-right">
                <Link href="/administracao/usuarios" className="btn btn-default">
                  <i className="lni lni-arrow-left"></i> Voltar
                </Link>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-4">
              <div className="text-center" style={{ marginBottom: '20px' }}>
                {usuario.avatar ? (
                  <img src={usuario.avatar} alt={usuario.nome} className="img-circle" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                    <i className="lni lni-user" style={{ fontSize: '60px', color: '#999' }}></i>
                  </div>
                )}
              </div>
              <div className="text-center">
                <h3>{usuario.nome}</h3>
                <p>
                  <span className={`badge ${usuario.level === 1 ? 'badge-danger' : usuario.level === 2 ? 'badge-success' : 'badge-info'}`}>
                    {usuario.level === 1 ? 'Admin' : usuario.level === 2 ? 'Estabelecimento' : 'Afiliado'}
                  </span>
                </p>
                <p>
                  <span className={`badge ${usuario.status == 1 ? 'badge-success' : 'badge-danger'}`}>
                    {usuario.status == 1 ? 'Ativo' : 'Inativo'}
                  </span>
                </p>
              </div>
            </div>
            <div className="col-md-8">
              <h4><i className="lni lni-information"></i> Informações do Usuário</h4>
              <table className="table table-striped">
                <tbody>
                  <tr><td><strong>ID:</strong></td><td>#{usuario.id}</td></tr>
                  <tr><td><strong>Nome:</strong></td><td>{usuario.nome}</td></tr>
                  <tr><td><strong>Email:</strong></td><td>{usuario.email}</td></tr>
                  <tr><td><strong>Telefone:</strong></td><td>{usuario.telefone || 'N/A'}</td></tr>
                  <tr><td><strong>WhatsApp:</strong></td><td>{usuario.whatsapp || 'N/A'}</td></tr>
                  <tr><td><strong>Data de Cadastro:</strong></td><td>{usuario.data_cadastro ? new Date(usuario.data_cadastro).toLocaleDateString('pt-BR') : '-'}</td></tr>
                  <tr><td><strong>Indicado por:</strong></td><td>{usuario.indicado_por ? `#${usuario.indicado_por}` : 'N/A'}</td></tr>
                </tbody>
              </table>
              
              {assinatura && (
                <>
                  <hr />
                  <h4><i className="lni lni-credit-cards"></i> Assinatura Ativa</h4>
                  <table className="table table-striped">
                    <tbody>
                      <tr><td><strong>ID:</strong></td><td>#{assinatura.id}</td></tr>
                      <tr><td><strong>Plano:</strong></td><td>#{assinatura.plano_id}</td></tr>
                      <tr><td><strong>Valor:</strong></td><td>R$ {parseFloat(assinatura.valor || 0).toFixed(2)}</td></tr>
                      <tr><td><strong>Válido até:</strong></td><td>{assinatura.data_fim ? new Date(assinatura.data_fim).toLocaleDateString('pt-BR') : '-'}</td></tr>
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
          
          <hr />
          
          <div className="text-right">
            <Link href={`/administracao/usuarios/editar?id=${usuario.id}`} className="btn btn-primary">
              <i className="lni lni-pencil"></i> Editar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
