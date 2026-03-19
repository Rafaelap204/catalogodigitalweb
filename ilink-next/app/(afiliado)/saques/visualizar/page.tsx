import { redirect } from 'next/navigation'; import Link from 'next/link'; import { getSession } from '@/lib/session'; import { createClient } from '@/lib/supabase/server';
export default async function VisualizarSaquePage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await getSession();
  if (!session || session.nivel !== 3) redirect('/login');
  const params = await searchParams; const id = params.id; if (!id) redirect('/saques');
  const supabase = await createClient();
  const { data: saque } = await (supabase.from('saques') as any).select('*').eq('id', id).eq('afiliado_id', session.afiliado_id).single();
  if (!saque) return <div className="row"><div className="col-md-12"><div className="alert alert-danger">Saque não encontrado.</div><Link href="/saques" className="btn btn-default">Voltar</Link></div></div>;
  const statusLabels: Record<string,string> = { '0': 'Pendente', '1': 'Processando', '2': 'Concluído', '3': 'Cancelado' };
  const statusColors: Record<string,string> = { '0': 'warning', '1': 'info', '2': 'success', '3': 'danger' };
  return (<div className="row"><div className="col-md-12"><div className="box box-white"><div className="box-header"><h3 className="box-title">Detalhes do Saque</h3></div><div className="box-body"><div className="row"><div className="col-md-6"><p><strong>ID:</strong> #{saque.id}</p><p><strong>Valor:</strong> R$ {parseFloat(saque.valor).toFixed(2)}</p><p><strong>Taxa:</strong> R$ {parseFloat(saque.taxa || 0).toFixed(2)}</p><p><strong>Valor Líquido:</strong> R$ {parseFloat(saque.valor_liquido || saque.valor).toFixed(2)}</p></div><div className="col-md-6"><p><strong>Status:</strong> <span className={`label label-${statusColors[saque.status] || 'default'}`}>{statusLabels[saque.status] || saque.status}</span></p><p><strong>Data da Solicitação:</strong> {new Date(saque.created).toLocaleString('pt-BR')}</p><p><strong>Data de Pagamento:</strong> {saque.data_pagamento ? new Date(saque.data_pagamento).toLocaleString('pt-BR') : '-'}</p></div></div><hr /><div className="form-group"><Link href="/saques" className="btn btn-default"><i className="lni lni-arrow-left"></i> Voltar</Link></div></div></div></div></div>);
}
