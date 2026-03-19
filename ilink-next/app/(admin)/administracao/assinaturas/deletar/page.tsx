import { redirect } from 'next/navigation'; import Link from 'next/link'; import { getSession } from '@/lib/session'; import { createClient } from '@/lib/supabase/server';
export default async function DeletarAssinaturaPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await getSession(); if (!session || session.nivel !== 1) redirect('/login');
  const params = await searchParams; const id = params.id; if (!id) redirect('/administracao/assinaturas');
  const supabase = await createClient();
  const { data: assinatura } = await (supabase.from('assinaturas') as any).select('id, codigo').eq('id', id).single();
  if (!assinatura) return <div className="row"><div className="col-md-12"><div className="alert alert-danger">Assinatura não encontrada.</div><Link href="/administracao/assinaturas" className="btn btn-default">Voltar</Link></div></div>;
  return (<div className="row"><div className="col-md-6 col-md-offset-3"><div className="box box-white"><div className="text-center" style={{ padding: '20px' }}><i className="lni lni-warning" style={{ fontSize: '64px', color: '#dc3545' }}></i><h2>Confirmar Exclusão</h2><p>Tem certeza que deseja excluir a assinatura <strong>#{assinatura.codigo}</strong>?</p><p className="text-danger">Esta ação não pode ser desfeita!</p></div><form action="/api/admin/assinaturas/deletar" method="POST" className="text-center"><input type="hidden" name="id" value={id} /><Link href="/administracao/assinaturas" className="btn btn-default btn-lg" style={{ marginRight: '10px' }}><i className="lni lni-close"></i> Cancelar</Link><button type="submit" className="btn btn-danger btn-lg"><i className="lni lni-trash"></i> Sim, Excluir</button></form></div></div></div>);
}
