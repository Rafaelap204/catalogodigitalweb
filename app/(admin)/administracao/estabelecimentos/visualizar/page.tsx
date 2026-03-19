import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function VisualizarEstabelecimentoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  const params = await searchParams;
  const estabelecimentoId = params.id;
  
  if (!estabelecimentoId) {
    redirect('/administracao/estabelecimentos');
  }

  const supabase = await createClient();
  
  // Busca estabelecimento
  const { data: estabelecimento } = await (supabase
    .from('estabelecimentos') as any)
    .select('id, nome, email, telefone, whatsapp, endereco, cidade, estado, descricao, avatar, status, data_cadastro')
    .eq('id', estabelecimentoId)
    .single();

  // Busca produtos
  const { count: totalProdutos } = await (supabase
    .from('produtos') as any)
    .select('*', { count: 'exact', head: true })
    .eq('estabelecimento_id', estabelecimentoId);

  // Busca pedidos
  const { count: totalPedidos } = await (supabase
    .from('pedidos') as any)
    .select('*', { count: 'exact', head: true })
    .eq('estabelecimento_id', estabelecimentoId);

  if (!estabelecimento) {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="alert alert-danger">
            <i className="lni lni-close"></i> Estabelecimento não encontrado.
          </div>
          <Link href="/administracao/estabelecimentos" className="btn btn-default">
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
                <h2><i className="lni lni-home"></i> Estabelecimento #{estabelecimento.id}</h2>
              </div>
              <div className="col-sm-4 text-right">
                <Link href="/administracao/estabelecimentos" className="btn btn-default">
                  <i className="lni lni-arrow-left"></i> Voltar
                </Link>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-4">
              <div className="text-center" style={{ marginBottom: '20px' }}>
                {estabelecimento.avatar ? (
                  <img src={estabelecimento.avatar} alt={estabelecimento.nome} className="img-circle" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                    <i className="lni lni-home" style={{ fontSize: '60px', color: '#999' }}></i>
                  </div>
                )}
              </div>
              <div className="text-center">
                <h3>{estabelecimento.nome}</h3>
                <p>
                  <span className={`badge ${estabelecimento.status === 'ativo' ? 'badge-success' : 'badge-danger'}`}>
                    {estabelecimento.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </span>
                </p>
              </div>
              
              <hr />
              
              <div className="row text-center">
                <div className="col-xs-6">
                  <h3>{totalProdutos || 0}</h3>
                  <p className="text-muted">Produtos</p>
                </div>
                <div className="col-xs-6">
                  <h3>{totalPedidos || 0}</h3>
                  <p className="text-muted">Pedidos</p>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <h4><i className="lni lni-information"></i> Informações do Estabelecimento</h4>
              <table className="table table-striped">
                <tbody>
                  <tr><td><strong>ID:</strong></td><td>#{estabelecimento.id}</td></tr>
                  <tr><td><strong>Nome:</strong></td><td>{estabelecimento.nome}</td></tr>
                  <tr><td><strong>Email:</strong></td><td>{estabelecimento.email || 'N/A'}</td></tr>
                  <tr><td><strong>Telefone:</strong></td><td>{estabelecimento.telefone || 'N/A'}</td></tr>
                  <tr><td><strong>WhatsApp:</strong></td><td>{estabelecimento.whatsapp || 'N/A'}</td></tr>
                  <tr><td><strong>Endereço:</strong></td><td>{estabelecimento.endereco || 'N/A'}</td></tr>
                  <tr><td><strong>Cidade:</strong></td><td>{estabelecimento.cidade || 'N/A'} {estabelecimento.estado || ''}</td></tr>
                  <tr><td><strong>Data de Cadastro:</strong></td><td>{estabelecimento.data_cadastro ? new Date(estabelecimento.data_cadastro).toLocaleDateString('pt-BR') : '-'}</td></tr>
                </tbody>
              </table>
              
              {estabelecimento.descricao && (
                <>
                  <hr />
                  <h4><i className="lni lni-text-align-left"></i> Descrição</h4>
                  <p>{estabelecimento.descricao}</p>
                </>
              )}
            </div>
          </div>
          
          <hr />
          
          <div className="text-right">
            <Link href={`/administracao/estabelecimentos/editar?id=${estabelecimento.id}`} className="btn btn-primary">
              <i className="lni lni-pencil"></i> Editar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
