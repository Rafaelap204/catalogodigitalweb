import { redirect } from 'next/navigation'; import Link from 'next/link'; import { getSession } from '@/lib/session'; import { createClient } from '@/lib/supabase/server';
export default async function LogsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await getSession();
  if (!session || session.nivel !== 1) redirect('/login');
  const params = await searchParams;
  const pagina = parseInt(params.pagina as string) || 1;
  const limite = 50;
  const supabase = await createClient();
  const { data: logs, count } = await (supabase.from('logs') as any).select('*', { count: 'exact' }).order('created', { ascending: false }).range((pagina - 1) * limite, pagina * limite - 1);
  const totalPaginas = Math.ceil((count || 0) / limite);
  const tipoLabels: Record<string,string> = { 'login': 'Login', 'logout': 'Logout', 'create': 'Criar', 'update': 'Atualizar', 'delete': 'Deletar', 'error': 'Erro' };
  return (<div className="row"><div className="col-md-12"><div className="box box-white"><div className="box-header"><h3 className="box-title">Logs do Sistema</h3></div><div className="box-body"><div className="table-responsive"><table className="table table-striped table-hover"><thead><tr><th>Data</th><th>Tipo</th><th>Usuário</th><th>Ação</th><th>IP</th></tr></thead><tbody>{logs && logs.length > 0 ? logs.map((log: any) => (<tr key={log.id}><td>{new Date(log.created).toLocaleString('pt-BR')}</td><td><span className={`label label-${log.tipo === 'error' ? 'danger' : log.tipo === 'delete' ? 'warning' : 'default'}`}>{tipoLabels[log.tipo] || log.tipo}</span></td><td>{log.usuario_nome || 'N/A'}</td><td>{log.acao}</td><td>{log.ip || 'N/A'}</td></tr>)) : (<tr><td colSpan={5} className="text-center">Nenhum log encontrado</td></tr>)}</tbody></table></div><nav className="text-center"><ul className="pagination"><li className={pagina === 1 ? 'disabled' : ''}><Link href={`/administracao/logs?pagina=${pagina - 1}`}>Anterior</Link></li>{Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => (<li key={p} className={pagina === p ? 'active' : ''}><Link href={`/administracao/logs?pagina=${p}`}>{p}</Link></li>))}<li className={pagina === totalPaginas ? 'disabled' : ''}><Link href={`/administracao/logs?pagina=${pagina + 1}`}>Próxima</Link></li></ul></nav></div></div></div></div>);
}
