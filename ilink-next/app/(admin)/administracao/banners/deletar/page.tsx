import { redirect } from 'next/navigation'; import Link from 'next/link'; import { getSession } from '@/lib/session'; import { createClient } from '@/lib/supabase/server';
export default async function DeletarBannerPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await getSession(); if (!session || session.nivel !== 1) redirect('/login');
  const params = await searchParams; const id = params.id; if (!id) redirect('/administracao/banners');
  const supabase = await createClient();
  const { data: banner } = await (supabase.from('banners') as any).select('id, titulo').eq('id', id).single();
  if (!banner) return <div className="row"><div className="col-md-12"><div className="alert alert-danger">Banner não encontrado.</div><Link href="/administracao/banners" className="btn btn-default">Voltar</Link></div></div>;
  return (<div className="row"><div className="col-md-6 col-md-offset-3"><div className="box box-white"><div className="text-center" style={{ padding: '20px' }}><i className="lni lni-warning" style={{ fontSize: '64px', color: '#dc3545' }}></i><h2>Confirmar Exclusão</h2><p>Tem certeza que deseja excluir o banner <strong>{banner.titulo}</strong>?</p><p className="text-danger">Esta ação não pode ser desfeita!</p></div><form action="/api/admin/banners/deletar" method="POST" className="text-center"><input type="hidden" name="id" value={id} /><Link href="/administracao/banners" className="btn btn-default btn-lg" style={{ marginRight: '10px' }}><i className="lni lni-close"></i> Cancelar</Link><button type="submit" className="btn btn-danger btn-lg"><i className="lni lni-trash"></i> Sim, Excluir</button></form></div></div></div>);
}
