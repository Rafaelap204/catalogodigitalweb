import { redirect } from 'next/navigation'; import Link from 'next/link'; import { getSession } from '@/lib/session'; import { createClient } from '@/lib/supabase/server';
export default async function ManutencaoPage() {
  const session = await getSession();
  if (!session || session.nivel !== 1) redirect('/login');
  const supabase = await createClient();
  const { data: configs } = await (supabase.from('configuracoes') as any).select('*');
  const config = configs?.[0] || {};
  return (<div className="row"><div className="col-md-12"><div className="box box-white"><div className="box-header"><h3 className="box-title">Modo de Manutenção</h3></div><div className="box-body"><div className="alert alert-warning"><i className="lni lni-warning"></i> <strong>Atenção:</strong> Ao ativar o modo de manutenção, apenas administradores poderão acessar o sistema.</div><form action="/api/admin/manutencao/salvar" method="POST"><input type="hidden" name="id" value={config.id || ''} /><div className="form-group"><div className="checkbox"><label><input type="checkbox" name="manutencao_ativa" defaultChecked={config.manutencao_ativa === 1} /> Ativar modo de manutenção</label></div></div><div className="form-group"><label>Mensagem de Manutenção</label><textarea name="manutencao_mensagem" className="form-control" rows={4} defaultValue={config.manutencao_mensagem || 'Estamos em manutenção. Voltaremos em breve!'} placeholder="Mensagem que será exibida para os usuários durante a manutenção"></textarea></div><div className="form-group"><button type="submit" className="btn btn-primary"><i className="lni lni-save"></i> Salvar Configurações</button><Link href="/administracao" className="btn btn-default" style={{ marginLeft: '10px' }}>Cancelar</Link></div></form></div></div></div></div>);
}
