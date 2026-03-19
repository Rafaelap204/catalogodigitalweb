import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function ConfiguracoesEntregaPage() {
  const session = await getSession();
  
  if (!session || session.nivel !== 2) {
    redirect('/login');
  }

  const supabase = await createClient();
  const estabelecimentoId = session.estabelecimento_id || '0';
  
  // Busca configurações de entrega
  const { data: estabelecimento } = await (supabase
    .from('estabelecimentos') as any)
    .select('id, entrega_gratis, valor_entrega, tempo_entrega, tempo_retirada, aceita_entrega, aceita_retirada, raio_entrega')
    .eq('id', estabelecimentoId)
    .single();

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="box box-white">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <div className="row">
              <div className="col-sm-8">
                <h2><i className="lni lni-delivery"></i> Configurações de Entrega</h2>
              </div>
              <div className="col-sm-4 text-right">
                <Link href="/painel" className="btn btn-default">
                  <i className="lni lni-arrow-left"></i> Voltar
                </Link>
              </div>
            </div>
          </div>
          
          <form action="/api/painel/configuracoes/entrega" method="POST" className="form-horizontal">
            <h4><i className="lni lni-truck"></i> Opções de Entrega</h4>
            <hr />
            
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-3 control-label">Aceita Entrega</label>
              <div className="col-sm-9">
                <select name="aceita_entrega" className="form-control" defaultValue={estabelecimento?.aceita_entrega !== false ? 'sim' : 'nao'}>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-3 control-label">Aceita Retirada</label>
              <div className="col-sm-9">
                <select name="aceita_retirada" className="form-control" defaultValue={estabelecimento?.aceita_retirada !== false ? 'sim' : 'nao'}>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-3 control-label">Entrega Grátis</label>
              <div className="col-sm-9">
                <select name="entrega_gratis" className="form-control" defaultValue={estabelecimento?.entrega_gratis ? 'sim' : 'nao'}>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-3 control-label">Valor da Entrega</label>
              <div className="col-sm-9">
                <div className="input-group">
                  <span className="input-group-addon">R$</span>
                  <input type="number" name="valor_entrega" step="0.01" min="0" className="form-control" defaultValue={estabelecimento?.valor_entrega || '0'} />
                </div>
                <small className="text-muted">Deixe 0 se a entrega for grátis</small>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-3 control-label">Raio de Entrega (km)</label>
              <div className="col-sm-9">
                <input type="number" name="raio_entrega" min="1" className="form-control" defaultValue={estabelecimento?.raio_entrega || '10'} />
              </div>
            </div>

            <h4><i className="lni lni-timer"></i> Tempo de Preparo</h4>
            <hr />

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-3 control-label">Tempo para Entrega</label>
              <div className="col-sm-9">
                <input type="text" name="tempo_entrega" className="form-control" placeholder="30-45 min" defaultValue={estabelecimento?.tempo_entrega || '30-45 min'} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-3 control-label">Tempo para Retirada</label>
              <div className="col-sm-9">
                <input type="text" name="tempo_retirada" className="form-control" placeholder="15-20 min" defaultValue={estabelecimento?.tempo_retirada || '15-20 min'} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <div className="col-sm-offset-3 col-sm-9">
                <button type="submit" className="btn btn-success">
                  <i className="lni lni-checkmark"></i> Salvar Configurações
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
