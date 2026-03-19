import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function CategoriasPage() {
  const session = await getSession();
  
  if (!session || session.nivel !== 2) {
    redirect('/login');
  }

  const supabase = await createClient();
  
  // Busca categorias
  const { data: categorias, error } = await (supabase
    .from('categorias') as any)
    .select('id, nome, icone, status')
    .order('nome');

  if (error) {
    console.error('Erro ao listar categorias:', error);
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="box box-white">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <div className="row">
              <div className="col-sm-8">
                <h2><i className="lni lni-tag"></i> Minhas Categorias</h2>
              </div>
              <div className="col-sm-4 text-right">
                <Link href="/painel/categorias/adicionar" className="btn btn-primary">
                  <i className="lni lni-plus"></i> Adicionar Categoria
                </Link>
              </div>
            </div>
          </div>
          
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Ícone</th>
                  <th>Status</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {!categorias || categorias.length === 0 ? (
                  <tr><td colSpan={5} className="text-center">Nenhuma categoria encontrada. <Link href="/painel/categorias/adicionar">Adicione sua primeira categoria!</Link></td></tr>
                ) : (
                  categorias.map((categoria: any) => (
                    <tr key={categoria.id}>
                      <td>#{categoria.id}</td>
                      <td>{categoria.nome}</td>
                      <td><i className={`lni ${categoria.icone || 'lni-tag'}`}></i></td>
                      <td>
                        <span className={`badge ${categoria.status === 'ativo' ? 'badge-success' : 'badge-danger'}`}>
                          {categoria.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="text-center">
                        <Link href={`/painel/categorias/editar?id=${categoria.id}`} className="btn btn-default btn-sm" style={{ marginRight: '5px' }}>
                          <i className="lni lni-pencil"></i> Editar
                        </Link>
                        <Link href={`/painel/categorias/deletar?id=${categoria.id}`} className="btn btn-danger btn-sm">
                          <i className="lni lni-trash"></i> Deletar
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
