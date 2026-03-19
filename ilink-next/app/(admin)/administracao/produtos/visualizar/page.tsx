import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function VisualizarProdutoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  const params = await searchParams;
  const produtoId = params.id;
  
  if (!produtoId) {
    redirect('/administracao/produtos');
  }

  const supabase = await createClient();
  
  // Busca produto
  const { data: produto } = await (supabase
    .from('produtos') as any)
    .select('id, nome, preco, preco_promocional, foto, categoria, descricao, status, destaque, estabelecimento_id, created')
    .eq('id', produtoId)
    .single();

  if (!produto) {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="alert alert-danger">
            <i className="lni lni-close"></i> Produto não encontrado.
          </div>
          <Link href="/administracao/produtos" className="btn btn-default">
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
                <h2><i className="lni lni-cart"></i> Produto #{produto.id}</h2>
              </div>
              <div className="col-sm-4 text-right">
                <Link href="/administracao/produtos" className="btn btn-default">
                  <i className="lni lni-arrow-left"></i> Voltar
                </Link>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-4">
              <div className="text-center" style={{ marginBottom: '20px' }}>
                {produto.foto ? (
                  <img src={produto.foto} alt={produto.nome} style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '300px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="lni lni-image" style={{ fontSize: '60px', color: '#999' }}></i>
                  </div>
                )}
              </div>
              <div className="text-center">
                {produto.destaque && (
                  <span className="badge badge-warning" style={{ marginRight: '5px' }}>
                    <i className="lni lni-star-fill"></i> Destaque
                  </span>
                )}
                <span className={`badge ${produto.status === 'ativo' ? 'badge-success' : 'badge-danger'}`}>
                  {produto.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
            <div className="col-md-8">
              <h4><i className="lni lni-information"></i> Informações do Produto</h4>
              <table className="table table-striped">
                <tbody>
                  <tr><td><strong>ID:</strong></td><td>#{produto.id}</td></tr>
                  <tr><td><strong>Nome:</strong></td><td>{produto.nome}</td></tr>
                  <tr><td><strong>Categoria:</strong></td><td>{produto.categoria || 'N/A'}</td></tr>
                  <tr><td><strong>Preço:</strong></td><td>R$ {parseFloat(produto.preco || 0).toFixed(2)}</td></tr>
                  <tr><td><strong>Preço Promocional:</strong></td><td>{produto.preco_promocional ? `R$ ${parseFloat(produto.preco_promocional).toFixed(2)}` : '-'}</td></tr>
                  <tr><td><strong>Estabelecimento:</strong></td><td>#{produto.estabelecimento_id}</td></tr>
                  <tr><td><strong>Data de Criação:</strong></td><td>{produto.created ? new Date(produto.created).toLocaleDateString('pt-BR') : '-'}</td></tr>
                </tbody>
              </table>
              
              {produto.descricao && (
                <>
                  <hr />
                  <h4><i className="lni lni-text-align-left"></i> Descrição</h4>
                  <p>{produto.descricao}</p>
                </>
              )}
            </div>
          </div>
          
          <hr />
          
          <div className="text-right">
            <Link href={`/administracao/produtos/editar?id=${produto.id}`} className="btn btn-primary" style={{ marginRight: '5px' }}>
              <i className="lni lni-pencil"></i> Editar
            </Link>
            <Link href={`/administracao/produtos/deletar?id=${produto.id}`} className="btn btn-danger">
              <i className="lni lni-trash"></i> Deletar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
