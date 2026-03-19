import { redirect } from 'next/navigation'; import Link from 'next/link'; import { getSession } from '@/lib/session'; import { createClient } from '@/lib/supabase/server';
export default async function VisualizarCategoriaPainelPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await getSession();
  if (!session || session.nivel !== 2) redirect('/login');
  const params = await searchParams; const id = params.id; if (!id) redirect('/categorias');
  const supabase = await createClient();
  const { data: categoria } = await (supabase.from('categorias') as any).select('*').eq('id', id).eq('estabelecimento_id', session.estabelecimento_id).single();
  if (!categoria) return <div className="row"><div className="col-md-12"><div className="alert alert-danger">Categoria não encontrada.</div><Link href="/categorias" className="btn btn-default">Voltar</Link></div></div>;
  return (<div className="row"><div className="col-md-12"><div className="box box-white"><div className="box-header"><h3 className="box-title">Detalhes da Categoria</h3></div><div className="box-body"><div className="row"><div className="col-md-6"><p><strong>Nome:</strong> {categoria.nome}</p><p><strong>Descrição:</strong> {categoria.descricao || 'N/A'}</p></div><div className="col-md-6"><p><strong>Status:</strong> <span className={`label label-${categoria.status === 1 ? 'success' : 'warning'}`}>{categoria.status === 1 ? 'Ativo' : 'Inativo'}</span></p><p><strong>Data de Cadastro:</strong> {new Date(categoria.created).toLocaleString('pt-BR')}</p></div></div><div className="form-group" style={{ marginTop: '20px' }}><Link href="/categorias" className="btn btn-default"><i className="lni lni-arrow-left"></i> Voltar</Link><Link href={`/categorias/editar?id=${id}`} className="btn btn-primary" style={{ marginLeft: '10px' }}><i className="lni lni-pencil"></i> Editar</Link></div></div></div></div></div>);
}
