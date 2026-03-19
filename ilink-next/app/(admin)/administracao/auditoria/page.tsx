import { redirect } from 'next/navigation'; import Link from 'next/link'; import { getSession } from '@/lib/session'; import { createClient } from '@/lib/supabase/server';
export default async function AuditoriaPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await getSession();
  if (!session || session.nivel !== 1) redirect('/login');
  const params = await searchParams;
  const pagina = parseInt(params.pagina as string) || 1;
  const limite = 50;
  const supabase = await createClient();
  const { data: auditorias, count } = await (supabase.from('auditoria') as any).select('*, usuario:usuario_id(nome,email)', { count: 'exact' }).order('created', { ascending: false }).range((pagina - 1) * limite, pagina * limite - 1);
  const totalPaginas = Math.ceil((count || 0) / limite);
  const acaoColors: Record<string,string> = { 'INSERT': 'success', 'UPDATE': 'primary', 'DELETE': 'danger', 'LOGIN': 'info', 'LOGOUT': 'default' };
  return (<div className="row"><div className="col-md-12"><div className="box box-white"><div className="box-header"><h3 className="box-title">Auditoria do Sistema</h3></div><div className="box-body"><div className="table-responsive"><table className="table table-striped table-hover"><thead><tr><th>Data/Hora</th><th>Usuário</th><th>Ação</th><th>Tabela</th><th>Registro</th><th>IP</th></tr></thead><tbody>{auditorias && auditorias.length > 0 ? auditorias.map((a: any) => (<tr key={a.id}><td>{new Date(a.created).toLocaleString('pt-BR')}</td><td>{a.usuario?.nome || 'Sistema'}</td><td><span className={`label label-${acaoColors[a.acao] || 'default'}`}>{a.acao}</span></td><td>{a.tabela}</td><td>{a.registro_id}</td><td>{a.ip || 'N/A'}</td></tr>)) : (<tr><td colSpan={6} className="text-center">Nenhum registro de auditoria encontrado</td></tr>)}</tbody></table></div><nav className="text-center"><ul className="pagination"><li className={pagina === 1 ? 'disabled' : ''}><Link href={`/administracao/auditoria?pagina=${pagina - 1}`}>Anterior</Link></li>{Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => (<li key={p} className={pagina === p ? 'active' : ''}><Link href={`/administracao/auditoria?pagina=${p}`}>{p}</Link></li>))}<li className={pagina === totalPaginas ? 'disabled' : ''}><Link href={`/administracao/auditoria?pagina=${pagina + 1}`}>Próxima</Link></li></ul></nav></div></div></div></div>);
}
