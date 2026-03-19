import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { listarProdutos } from '@/lib/server/actions/produtos';

interface Props {
  searchParams: Promise<{ 
    pagina?: string;
    nome?: string;
    estabelecimento_id?: string;
    [key: string]: string | undefined;
  }>;
}

export default async function ProdutosPage({ searchParams }: Props) {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  const params = await searchParams;
  const pagina = parseInt(params.pagina || '1', 10);
  const nome = params.nome;
  const estabelecimento_id = params.estabelecimento_id;

  const { produtos, total, paginas, paginaAtual } = await listarProdutos({
    pagina,
    nome,
    estabelecimento_id,
  });

  return (
    <div className="row">
      <div className="col-md-12">
        {/* Header */}
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-md-8">
            <h2>
              <i className="lni lni-cart"></i> Produtos
              <small style={{ display: 'block', fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Gerencie os produtos do sistema
              </small>
            </h2>
          </div>
          <div className="col-md-4 text-right">
            <Link 
              href="/administracao/produtos/adicionar" 
              className="btn btn-success"
              style={{ marginTop: '10px' }}
            >
              <i className="lni lni-plus"></i> Adicionar Novo
            </Link>
          </div>
        </div>

        {/* Filtros */}
        <div className="box box-white" style={{ marginBottom: '20px' }}>
          <form method="GET">
            <div className="row">
              <div className="col-md-5">
                <div className="form-field">
                  <input 
                    type="text" 
                    name="nome" 
                    className="form-control"
                    placeholder="Buscar por nome..."
                    defaultValue={nome}
                  />
                </div>
              </div>
              <div className="col-md-5">
                <div className="form-field">
                  <input 
                    type="text" 
                    name="estabelecimento_id" 
                    className="form-control"
                    placeholder="ID do Estabelecimento..."
                    defaultValue={estabelecimento_id}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-primary btn-block">
                  <i className="lni lni-search"></i>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Tabela */}
        <div className="box box-white">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Imagem</th>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Status</th>
                  <th style={{ width: '150px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center">
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                ) : (
                  produtos.map((prod) => (
                    <tr key={prod.id}>
                      <td>{prod.id}</td>
                      <td>
                        {prod.imagem ? (
                          <img 
                            src={prod.imagem} 
                            alt={prod.nome}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        ) : (
                          <div style={{ 
                            width: '50px', 
                            height: '50px', 
                            background: '#f0f0f0',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <i className="lni lni-image" style={{ color: '#999' }}></i>
                          </div>
                        )}
                      </td>
                      <td>
                        <strong>{prod.nome}</strong>
                        {prod.destaque === 1 && (
                          <span className="badge badge-warning" style={{ marginLeft: '8px' }}>
                            <i className="lni lni-star"></i>
                          </span>
                        )}
                      </td>
                      <td>
                        {prod.preco_promocional ? (
                          <>
                            <span className="text-success">R$ {prod.preco_promocional.toFixed(2)}</span>
                            <br />
                            <small className="text-muted" style={{ textDecoration: 'line-through' }}>
                              R$ {prod.preco.toFixed(2)}
                            </small>
                          </>
                        ) : (
                          <span>R$ {prod.preco.toFixed(2)}</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${prod.status === 1 ? 'badge-success' : 'badge-danger'}`}>
                          {prod.status === 1 ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <Link 
                            href={`/administracao/produtos/editar?id=${prod.id}`}
                            className="btn btn-sm btn-primary"
                            title="Editar"
                          >
                            <i className="lni lni-pencil"></i>
                          </Link>
                          <Link 
                            href={`/administracao/produtos/deletar?id=${prod.id}`}
                            className="btn btn-sm btn-danger"
                            title="Deletar"
                          >
                            <i className="lni lni-trash"></i>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {paginas > 1 && (
            <div className="text-center" style={{ marginTop: '20px' }}>
              <nav>
                <ul className="pagination">
                  {paginaAtual > 1 && (
                    <li>
                      <Link href={`?pagina=${paginaAtual - 1}${nome ? `&nome=${nome}` : ''}${estabelecimento_id ? `&estabelecimento_id=${estabelecimento_id}` : ''}`}>
                        &laquo;
                      </Link>
                    </li>
                  )}
                  
                  {Array.from({ length: paginas }, (_, i) => i + 1).map((p) => (
                    <li key={p} className={p === paginaAtual ? 'active' : ''}>
                      <Link href={`?pagina=${p}${nome ? `&nome=${nome}` : ''}${estabelecimento_id ? `&estabelecimento_id=${estabelecimento_id}` : ''}`}>
                        {p}
                      </Link>
                    </li>
                  ))}
                  
                  {paginaAtual < paginas && (
                    <li>
                      <Link href={`?pagina=${paginaAtual + 1}${nome ? `&nome=${nome}` : ''}${estabelecimento_id ? `&estabelecimento_id=${estabelecimento_id}` : ''}`}>
                        &raquo;
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          )}

          <div className="text-muted" style={{ marginTop: '10px' }}>
            Mostrando {produtos.length} de {total} produtos
          </div>
        </div>
      </div>
    </div>
  );
}
