import { redirect } from 'next/navigation'; import Link from 'next/link'; import { getSession } from '@/lib/session'; import { createClient } from '@/lib/supabase/server';
export default async function VisualizarComissaoPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await getSession();
  if (!session || session.nivel !== 3) redirect('/login');
  const params = await searchParams; const id = params.id; if (!id) redirect('/comissoes');
  const supabase = await createClient();
  const { data: comissao } = await (supabase.from('comissoes') as any).select('*, indicado:indicado_id(nome,email), estabelecimento:estabelecimento_id(nome)').eq('id', id).eq('afiliado_id', session.afiliado_id).single();
  if (!comissao) return <div className="row"><div className="col-md-12"><div className="alert alert-danger">Comissão não encontrada.</div><Link href="/comissoes" className="btn btn-default">Voltar</Link></div></div>;
  const statusLabels: Record<string,string> = { '0': 'Pendente', '1': 'Paga', '2': 'Cancelada' };
  const statusColors: Record<string,string> = { '0': 'warning', '1': 'success', '2': 'danger' };
  return (<div className="row"><div className="col-md-12"><div className="box box-white"><div className="box-header"><h3 className="box-title">Detalhes da Comissão</h3></div><div className="box-body"><div className="row"><div className="col-md-6"><p><strong>ID:</strong> #{comissao.id}</p><p><strong>Indicado:</strong> {comissao.indicado?.nome || 'N/A'}</p><p><strong>Email do Indicado:</strong> {comissao.indicado?.email || 'N/A'}</p><p><strong>Estabelecimento:</strong> {comissao.estabelecimento?.nome || 'N/A'}</p></div><div className="col-md-6"><p><strong>Valor:</strong> R$ {parseFloat(comissao.valor).toFixed(2)}</p><p><strong>Status:</strong> <span className={`label label-${statusColors[comissao.status] || 'default'}`}>{statusLabels[comissao.status] || comissao.status}</span></p><p><strong>Data:</strong> {new Date(comissao.created).toLocaleString('pt-BR')}</p></div></div><hr /><div className="form-group"><Link href="/comissoes" className="btn btn-default"><i className="lni lni-arrow-left"></i> Voltar</Link></div></div></div></div></div>);
}
