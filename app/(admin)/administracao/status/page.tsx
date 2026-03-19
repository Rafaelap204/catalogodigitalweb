import { redirect } from 'next/navigation'; import Link from 'next/link'; import { getSession } from '@/lib/session'; import { createClient } from '@/lib/supabase/server';
export default async function StatusSistemaPage() {
  const session = await getSession();
  if (!session || session.nivel !== 1) redirect('/login');
  const supabase = await createClient();
  const [{ count: totalUsers }, { count: totalEstabelecimentos }, { count: totalPedidos }, { count: totalProdutos }] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('estabelecimentos').select('*', { count: 'exact', head: true }),
    supabase.from('pedidos').select('*', { count: 'exact', head: true }),
    supabase.from('produtos').select('*', { count: 'exact', head: true })
  ]);
  return (<div className="row"><div className="col-md-12"><div className="box box-white"><div className="box-header"><h3 className="box-title">Status do Sistema</h3></div><div className="box-body"><div className="row"><div className="col-md-3"><div className="small-box bg-aqua"><div className="inner"><h3>{totalUsers || 0}</h3><p>Usuários</p></div><div className="icon"><i className="lni lni-users"></i></div></div></div><div className="col-md-3"><div className="small-box bg-green"><div className="inner"><h3>{totalEstabelecimentos || 0}</h3><p>Estabelecimentos</p></div><div className="icon"><i className="lni lni-shop"></i></div></div></div><div className="col-md-3"><div className="small-box bg-yellow"><div className="inner"><h3>{totalProdutos || 0}</h3><p>Produtos</p></div><div className="icon"><i className="lni lni-package"></i></div></div></div><div className="col-md-3"><div className="small-box bg-red"><div className="inner"><h3>{totalPedidos || 0}</h3><p>Pedidos</p></div><div className="icon"><i className="lni lni-cart"></i></div></div></div></div><hr /><h4>Informações do Servidor</h4><table className="table table-bordered"><tbody><tr><td><strong>Node.js Version</strong></td><td>{process.version}</td></tr><tr><td><strong>Environment</strong></td><td>{process.env.NODE_ENV || 'development'}</td></tr><tr><td><strong>Plataforma</strong></td><td>{process.platform}</td></tr><tr><td><strong>Status do Banco</strong></td><td><span className="label label-success">Conectado</span></td></tr></tbody></table><div className="form-group"><Link href="/administracao" className="btn btn-default">Voltar</Link></div></div></div></div></div>);
}
