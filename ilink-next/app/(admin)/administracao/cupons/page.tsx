import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { listarCupons } from '@/lib/server/actions/cupons';
import { getCupomTipoLabel } from '@/lib/helpers';

interface Props {
  searchParams: Promise<{ 
    pagina?: string;
    codigo?: string;
    [key: string]: string | undefined;
  }>;
}

export default async function CuponsPage({ searchParams }: Props) {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  const params = await searchParams;
  const pagina = parseInt(params.pagina || '1', 10);
  const codigo = params.codigo;

  const { cupons, total, paginas, paginaAtual } = await listarCupons({ pagina, codigo });

  return (
    <div className="row">
      <div className="col-md-12">
        {/* Header */}
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-md-8">
            <h2>
              <i className="lni lni-ticket"></i> Cupons
              <small style={{ display: 'block', fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Gerencie os cupons de desconto
              </small>
            </h2>
          </div>
          <div className="col-md-4 text-right">
            <Link href="/administracao/cupons/adicionar" className="btn btn-success" style={{ marginTop: '10px' }}>
              <i className="lni lni-plus"></i> Novo Cupom
            </Link>
          </div>
        </div>

        {/* Filtros */}
        <div className="box box-white" style={{ marginBottom: '20px' }}>
          <form method="GET">
            <div className="row">
              <div className="col-md-8">
                <div className="form-field">
                  <input type="text" name="codigo" className="form-control" placeholder="Buscar por código..." defaultValue={codigo} />
                </div>
              </div>
              <div className="col-md-4">
                <button type="submit" className="btn btn-primary"><i className="lni lni-search"></i> Filtrar</button>
                <Link href="/administracao/cupons" className="btn btn-default" style={{ marginLeft: '10px' }}><i className="lni lni-reload"></i> Limpar</Link>
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
                  <th>Código</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Mínimo</th>
                  <th>Usos</th>
                  <th>Válido até</th>
                  <th>Status</th>
                  <th style={{ width: '150px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {cupons.length === 0 ? (
                  <tr><td colSpan={8} className="text-center">Nenhum cupom encontrado.</td></tr>
                ) : (
                  cupons.map((cupom) => (
                    <tr key={cupom.id}>
                      <td><strong className="text-primary">{cupom.codigo}</strong></td>
                      <td>{getCupomTipoLabel(cupom.tipo)}</td>
                      <td>
                        {cupom.tipo === 'percentual' ? `${cupom.valor}%` : 
                         cupom.tipo === 'frete_gratis' ? 'Frete Grátis' : 
                         `R$ ${cupom.valor.toFixed(2)}`}
                      </td>
                      <td>{cupom.valor_minimo ? `R$ ${cupom.valor_minimo.toFixed(2)}` : '-'}</td>
                      <td>
                        {cupom.limite_uso ? `${cupom.usos || 0}/${cupom.limite_uso}` : cupom.usos || 0}
                      </td>
                      <td>{cupom.data_fim ? new Date(cupom.data_fim).toLocaleDateString('pt-BR') : '-'}</td>
                      <td>
                        <span className={`badge ${cupom.status === 1 ? 'badge-success' : 'badge-danger'}`}>
                          {cupom.status === 1 ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <Link href={`/administracao/cupons/editar?id=${cupom.id}`} className="btn btn-sm btn-primary" title="Editar"><i className="lni lni-pencil"></i></Link>
                          <Link href={`/administracao/cupons/deletar?id=${cupom.id}`} className="btn btn-sm btn-danger" title="Deletar"><i className="lni lni-trash"></i></Link>
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
                  {paginaAtual > 1 && <li><Link href={`?pagina=${paginaAtual - 1}${codigo ? `&codigo=${codigo}` : ''}`}>&laquo;</Link></li>}
                  {Array.from({ length: paginas }, (_, i) => i + 1).map((p) => (
                    <li key={p} className={p === paginaAtual ? 'active' : ''}><Link href={`?pagina=${p}${codigo ? `&codigo=${codigo}` : ''}`}>{p}</Link></li>
                  ))}
                  {paginaAtual < paginas && <li><Link href={`?pagina=${paginaAtual + 1}${codigo ? `&codigo=${codigo}` : ''}`}>&raquo;</Link></li>}
                </ul>
              </nav>
            </div>
          )}

          <div className="text-muted" style={{ marginTop: '10px' }}>Mostrando {cupons.length} de {total} cupons</div>
        </div>
      </div>
    </div>
  );
}
