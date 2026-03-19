import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { listarUsuarios } from '@/lib/server/actions/usuarios';
import { getNivelLabel, getNivelBadgeClass } from '@/lib/helpers';

interface Props {
  searchParams: Promise<{ 
    pagina?: string;
    nome?: string;
    email?: string;
    nivel?: string;
    [key: string]: string | undefined;
  }>;
}

export default async function UsuariosPage({ searchParams }: Props) {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  const params = await searchParams;
  const pagina = parseInt(params.pagina || '1', 10);
  const nome = params.nome;
  const email = params.email;
  const nivel = params.nivel ? parseInt(params.nivel, 10) : undefined;

  const { usuarios, total, paginas, paginaAtual } = await listarUsuarios({
    pagina,
    nome,
    email,
    nivel,
  });

  const nivelOptions = [
    { value: '', label: 'Todos' },
    { value: '1', label: 'Administrador' },
    { value: '2', label: 'Estabelecimento' },
    { value: '3', label: 'Afiliado' },
    { value: '4', label: 'Cliente' },
  ];

  return (
    <div className="row">
      <div className="col-md-12">
        {/* Header */}
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-md-8">
            <h2>
              <i className="lni lni-users"></i> Usuários
              <small style={{ display: 'block', fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Gerencie os usuários do sistema
              </small>
            </h2>
          </div>
          <div className="col-md-4 text-right">
            <Link 
              href="/administracao/usuarios/adicionar" 
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
              <div className="col-md-3">
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
              <div className="col-md-3">
                <div className="form-field">
                  <input 
                    type="text" 
                    name="email" 
                    className="form-control"
                    placeholder="Buscar por email..."
                    defaultValue={email}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-field">
                  <select name="nivel" className="form-control" defaultValue={params.nivel}>
                    {nivelOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <button type="submit" className="btn btn-primary">
                  <i className="lni lni-search"></i> Filtrar
                </button>
                <Link href="/administracao/usuarios" className="btn btn-default" style={{ marginLeft: '10px' }}>
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
                  <th>Avatar</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Nível</th>
                  <th>Status</th>
                  <th>Último Acesso</th>
                  <th style={{ width: '150px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : (
                  usuarios.map((user) => (
                    <tr key={user.id}>
                      <td>
                        {user.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.nome}
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }}
                          />
                        ) : (
                          <div style={{ 
                            width: '40px', 
                            height: '40px', 
                            background: '#007bff',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 'bold'
                          }}>
                            {user.nome.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td>
                        <strong>{user.nome}</strong>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${getNivelBadgeClass(user.nivel)}`}>
                          {getNivelLabel(user.nivel)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${user.status === 1 ? 'badge-success' : 'badge-danger'}`}>
                          {user.status === 1 ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        {user.lastlogin 
                          ? new Date(user.lastlogin).toLocaleDateString('pt-BR') 
                          : 'Nunca'}
                      </td>
                      <td>
                        <div className="btn-group">
                          <Link 
                            href={`/administracao/usuarios/editar?id=${user.id}`}
                            className="btn btn-sm btn-primary"
                            title="Editar"
                          >
                            <i className="lni lni-pencil"></i>
                          </Link>
                          <Link 
                            href={`/administracao/usuarios/deletar?id=${user.id}`}
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
                      <Link href={`?pagina=${paginaAtual - 1}${nome ? `&nome=${nome}` : ''}${email ? `&email=${email}` : ''}${nivel ? `&nivel=${nivel}` : ''}`}>
                        &laquo;
                      </Link>
                    </li>
                  )}
                  
                  {Array.from({ length: paginas }, (_, i) => i + 1).map((p) => (
                    <li key={p} className={p === paginaAtual ? 'active' : ''}>
                      <Link href={`?pagina=${p}${nome ? `&nome=${nome}` : ''}${email ? `&email=${email}` : ''}${nivel ? `&nivel=${nivel}` : ''}`}>
                        {p}
                      </Link>
                    </li>
                  ))}
                  
                  {paginaAtual < paginas && (
                    <li>
                      <Link href={`?pagina=${paginaAtual + 1}${nome ? `&nome=${nome}` : ''}${email ? `&email=${email}` : ''}${nivel ? `&nivel=${nivel}` : ''}`}>
                        &raquo;
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          )}

          <div className="text-muted" style={{ marginTop: '10px' }}>
            Mostrando {usuarios.length} de {total} usuários
          </div>
        </div>
      </div>
    </div>
  );
}
