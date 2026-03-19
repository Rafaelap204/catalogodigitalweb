import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { listarCategorias } from '@/lib/server/actions/categorias';

interface Props {
  searchParams: Promise<{ 
    pagina?: string;
    nome?: string;
    estabelecimento_id?: string;
    [key: string]: string | undefined;
  }>;
}

export default async function CategoriasPage({ searchParams }: Props) {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  const params = await searchParams;
  const pagina = parseInt(params.pagina || '1', 10);
  const nome = params.nome;
  const estabelecimento_id = params.estabelecimento_id;

  const { categorias, total, paginas, paginaAtual } = await listarCategorias({
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
              <i className="lni lni-tag"></i> Categorias
              <small style={{ display: 'block', fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Gerencie as categorias de produtos
              </small>
            </h2>
          </div>
          <div className="col-md-4 text-right">
            <Link 
              href="/administracao/categorias/adicionar" 
              className="btn btn-success"
              style={{ marginTop: '10px' }}
            >
              <i className="lni lni-plus"></i> Adicionar Nova
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
                  <th>Ordem</th>
                  <th>Ícone</th>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Status</th>
                  <th style={{ width: '150px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {categorias.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center">
                      Nenhuma categoria encontrada.
                    </td>
                  </tr>
                ) : (
                  categorias.map((cat) => (
                    <tr key={cat.id}>
                      <td>{cat.ordem || 0}</td>
                      <td>
                        {cat.icone ? (
                          <i className={`lni lni-${cat.icone}`} style={{ fontSize: '24px' }}></i>
                        ) : (
                          <i className="lni lni-tag" style={{ fontSize: '24px', color: '#999' }}></i>
                        )}
                      </td>
                      <td>
                        <strong>{cat.nome}</strong>
                      </td>
                      <td>
                        {cat.descricao || '-'}
                      </td>
                      <td>
                        <span className={`badge ${cat.status === 1 ? 'badge-success' : 'badge-danger'}`}>
                          {cat.status === 1 ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <Link 
                            href={`/administracao/categorias/editar?id=${cat.id}`}
                            className="btn btn-sm btn-primary"
                            title="Editar"
                          >
                            <i className="lni lni-pencil"></i>
                          </Link>
                          <Link 
                            href={`/administracao/categorias/deletar?id=${cat.id}`}
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
            Mostrando {categorias.length} de {total} categorias
          </div>
        </div>
      </div>
    </div>
  );
}
