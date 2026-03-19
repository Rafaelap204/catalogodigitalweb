import { redirect } from 'next/navigation'; import Link from 'next/link'; import { getSession } from '@/lib/session'; import { createClient } from '@/lib/supabase/server';
export default async function TermosPage() {
  const session = await getSession();
  if (!session || session.nivel !== 1) redirect('/login');
  const supabase = await createClient();
  const { data: configs } = await (supabase.from('configuracoes') as any).select('*');
  const config = configs?.[0] || {};
  return (<div className="row"><div className="col-md-12"><div className="box box-white"><div className="box-header"><h3 className="box-title">Termos de Uso</h3></div><div className="box-body"><form action="/api/admin/termos/salvar" method="POST"><input type="hidden" name="id" value={config.id || ''} /><div className="form-group"><label>Conteúdo dos Termos de Uso</label><textarea name="termos_uso" className="form-control" rows={20} defaultValue={config.termos_uso || ''} placeholder="Digite aqui os termos de uso do sistema..." style={{ fontFamily: 'monospace' }}></textarea></div><div className="form-group"><button type="submit" className="btn btn-primary"><i className="lni lni-save"></i> Salvar Termos</button><Link href="/administracao" className="btn btn-default" style={{ marginLeft: '10px' }}>Cancelar</Link></div></form><hr /><h4>Visualização</h4><div className="well" style={{ maxHeight: '400px', overflow: 'auto' }}><div dangerouslySetInnerHTML={{ __html: config.termos_uso || '<p class="text-muted">Nenhum conteúdo definido</p>' }} /></div></div></div></div></div>);
}
