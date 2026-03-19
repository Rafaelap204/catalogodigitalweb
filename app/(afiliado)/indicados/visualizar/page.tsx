import { redirect } from 'next/navigation'; import Link from 'next/link'; import { getSession } from '@/lib/session'; import { createClient } from '@/lib/supabase/server';
export default async function VisualizarIndicadoPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await getSession();
  if (!session || session.nivel !== 3) redirect('/login');
  const params = await searchParams; const id = params.id; if (!id) redirect('/indicados');
  const supabase = await createClient();
  const { data: indicado } = await (supabase.from('afiliado_indicados') as any).select('*, estabelecimento:estabelecimento_id(nome)').eq('id', id).eq('afiliado_id', session.afiliado_id).single();
  if (!indicado) return <div className="row"><div className="col-md-12"><div className="alert alert-danger">Indicado não encontrado.</div><Link href="/indicados" className="btn btn-default">Voltar</Link></div></div>;
  return (<div className="row"><div className="col-md-12"><div className="box box-white"><div className="box-header"><h3 className="box-title">Detalhes do Indicado</h3></div><div className="box-body"><div className="row"><div className="col-md-6"><p><strong>Nome:</strong> {indicado.nome}</p><p><strong>Email:</strong> {indicado.email}</p><p><strong>Telefone:</strong> {indicado.telefone || 'N/A'}</p></div><div className="col-md-6"><p><strong>Estabelecimento:</strong> {indicado.estabelecimento?.nome || 'N/A'}</p><p><strong>Data de Cadastro:</strong> {new Date(indicado.created).toLocaleString('pt-BR')}</p><p><strong>Status:</strong> <span className={`label label-${indicado.status === '1' ? 'success' : 'warning'}`}>{indicado.status === '1' ? 'Ativo' : 'Pendente'}</span></p></div></div><hr /><div className="form-group"><Link href="/indicados" className="btn btn-default"><i className="lni lni-arrow-left"></i> Voltar</Link></div></div></div></div></div>);
}
