import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { listarEstabelecimentos } from '@/lib/server/actions/estabelecimentos';

interface Props {
  searchParams: Promise<{ 
    pagina?: string;
    nome?: string;
    subdominio?: string;
    [key: string]: string | undefined;
  }>;
}

export default async function EstabelecimentosPage({ searchParams }: Props) {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  const params = await searchParams;
  const pagina = parseInt(params.pagina || '1', 10);
  const nome = params.nome;
  const subdominio = params.subdominio;

  const { estabelecimentos, total, paginas, paginaAtual } = await listarEstabelecimentos({
    pagina,
    nome,
    subdominio,
  });

  return (
    <div className="row">
      <div className="col-md-12">
        {/* Header */}
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-md-8">
            <h2>
              <i className="lni lni-shop"></i> Estabelecimentos
              <small style={{ display: 'block', fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Gerencie os estabelecimentos do sistema
              </small>
            </h2>
          </div>
          <div className="col-md-4 text-right">
            <Link 
              href="/administracao/estabelecimentos/adicionar" 
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
              <div className="col-md-4">
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
              <div className="col-md-4">
                <div className="form-field">
                  <input 
                    type="text" 
                    name="subdominio" 
                    className="form-control"
                    placeholder="Buscar por subdomínio..."
                    defaultValue={subdominio}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <button type="submit" className="btn btn-primary">
                  <i className="lni lni-search"></i> Filtrar
                </button>
                <Link href="/administracao/estabelecimentos" className="btn btn-default" style={{ marginLeft: '10px' }}>
                  <i className="lni lni-reload"></i> Limpar
                </Link>
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
                  <th>Nome</th>
                  <th>Subdomínio</th>
                  <th>Cidade/UF</th>
                  <th>Status</th>
                  <th style={{ width: '150px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {estabelecimentos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center">
                      Nenhum estabelecimento encontrado.
                    </td>
                  </tr>
                ) : (
                  estabelecimentos.map((est) => (
                    <tr key={est.id}>
                      <td>{est.id}</td>
                      <td>
                        <strong>{est.nome}</strong>
                        {est.perfil && (
                          <small style={{ display: 'block', color: '#666' }}>
                            {est.perfil}
                          </small>
                        )}
                      </td>
                      <td>
                        {est.subdominio ? (
                          <a 
                            href={`https://${est.subdominio}.catalogodigitalweb.com.br`}
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            {est.subdominio}
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        {est.cidade && est.estado ? `${est.cidade}/${est.estado}` : '-'}
                      </td>
                      <td>
                        <span className={`badge ${est.status === 1 ? 'badge-success' : 'badge-danger'}`}>
                          {est.status === 1 ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <Link 
                            href={`/administracao/estabelecimentos/editar?id=${est.id}`}
                            className="btn btn-sm btn-primary"
                            title="Editar"
                          >
                            <i className="lni lni-pencil"></i>
                          </Link>
                          <Link 
                            href={`/administracao/estabelecimentos/gerenciar?id=${est.id}`}
                            className="btn btn-sm btn-info"
                            title="Gerenciar"
                          >
                            <i className="lni lni-cog"></i>
                          </Link>
                          <Link 
                            href={`/administracao/estabelecimentos/deletar?id=${est.id}`}
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
                      <Link href={`?pagina=${paginaAtual - 1}${nome ? `&nome=${nome}` : ''}${subdominio ? `&subdominio=${subdominio}` : ''}`}>
                        &laquo;
                      </Link>
                    </li>
                  )}
                  
                  {Array.from({ length: paginas }, (_, i) => i + 1).map((p) => (
                    <li key={p} className={p === paginaAtual ? 'active' : ''}>
                      <Link href={`?pagina=${p}${nome ? `&nome=${nome}` : ''}${subdominio ? `&subdominio=${subdominio}` : ''}`}>
                        {p}
                      </Link>
                    </li>
                  ))}
                  
                  {paginaAtual < paginas && (
                    <li>
                      <Link href={`?pagina=${paginaAtual + 1}${nome ? `&nome=${nome}` : ''}${subdominio ? `&subdominio=${subdominio}` : ''}`}>
                        &raquo;
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          )}

          <div className="text-muted" style={{ marginTop: '10px' }}>
            Mostrando {estabelecimentos.length} de {total} estabelecimentos
          </div>
        </div>
      </div>
    </div>
  );
}
