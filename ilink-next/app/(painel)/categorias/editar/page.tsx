import { redirect } from 'next/navigation'; import Link from 'next/link'; import { getSession } from '@/lib/session'; import { createClient } from '@/lib/supabase/server';
import { updateCategoriaAction } from '@/lib/server/actions/categorias';
export default async function EditarCategoriaPainelPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await getSession();
  if (!session || session.nivel !== 2) redirect('/login');
  const params = await searchParams; const id = params.id; if (!id) redirect('/categorias');
  const supabase = await createClient();
  const { data: categoria } = await (supabase.from('categorias') as any).select('*').eq('id', id).eq('estabelecimento_id', session.estabelecimento_id).single();
  if (!categoria) return <div className="row"><div className="col-md-12"><div className="alert alert-danger">Categoria não encontrada.</div><Link href="/categorias" className="btn btn-default">Voltar</Link></div></div>;
  return (<div className="row"><div className="col-md-12"><div className="box box-white"><div className="box-header"><h3 className="box-title">Editar Categoria</h3></div><div className="box-body"><form action={updateCategoriaAction}><input type="hidden" name="id" value={id} /><input type="hidden" name="estabelecimento_id" value={session.estabelecimento_id || ''} /><div className="form-group"><label>Nome</label><input type="text" name="nome" className="form-control" defaultValue={categoria.nome} required /></div><div className="form-group"><label>Descrição</label><textarea name="descricao" className="form-control" rows={3} defaultValue={categoria.descricao || ''}></textarea></div><div className="form-group"><label>Status</label><select name="status" className="form-control" defaultValue={categoria.status || 1}><option value="1">Ativo</option><option value="0">Inativo</option></select></div><div className="form-group"><button type="submit" className="btn btn-primary"><i className="lni lni-save"></i> Salvar Alterações</button><Link href="/categorias" className="btn btn-default" style={{ marginLeft: '10px' }}>Cancelar</Link></div></form></div></div></div></div>);
}
