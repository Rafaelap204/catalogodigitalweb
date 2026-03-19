import { redirect } from 'next/navigation'; import Link from 'next/link'; import { getSession } from '@/lib/session'; import { createClient } from '@/lib/supabase/server';
export default async function PrivacidadePage() {
  const session = await getSession();
  if (!session || session.nivel !== 1) redirect('/login');
  const supabase = await createClient();
  const { data: configs } = await (supabase.from('configuracoes') as any).select('*');
  const config = configs?.[0] || {};
  return (<div className="row"><div className="col-md-12"><div className="box box-white"><div className="box-header"><h3 className="box-title">Política de Privacidade</h3></div><div className="box-body"><form action="/api/admin/privacidade/salvar" method="POST"><input type="hidden" name="id" value={config.id || ''} /><div className="form-group"><label>Conteúdo da Política de Privacidade</label><textarea name="politica_privacidade" className="form-control" rows={20} defaultValue={config.politica_privacidade || ''} placeholder="Digite aqui a política de privacidade..." style={{ fontFamily: 'monospace' }}></textarea></div><div className="form-group"><button type="submit" className="btn btn-primary"><i className="lni lni-save"></i> Salvar Política</button><Link href="/administracao" className="btn btn-default" style={{ marginLeft: '10px' }}>Cancelar</Link></div></form><hr /><h4>Visualização</h4><div className="well" style={{ maxHeight: '400px', overflow: 'auto' }}><div dangerouslySetInnerHTML={{ __html: config.politica_privacidade || '<p class="text-muted">Nenhum conteúdo definido</p>' }} /></div></div></div></div></div>);
}
