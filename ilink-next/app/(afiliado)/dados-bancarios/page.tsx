import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function DadosBancariosPage() {
  const session = await getSession();
  
  if (!session || session.nivel !== 3) {
    redirect('/login');
  }

  const afiliadoId = session.afiliado_id || session.id;
  const supabase = await createClient();
  
  // Busca dados bancários
  const { data: afiliado } = await (supabase
    .from('users') as any)
    .select('id, nome, banco, agencia, conta, tipo_conta, pix_tipo, pix_chave')
    .eq('id', afiliadoId)
    .single();

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="box box-white">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <div className="row">
              <div className="col-sm-8">
                <h2><i className="lni lni-bank"></i> Dados Bancários</h2>
              </div>
              <div className="col-sm-4 text-right">
                <Link href="/afiliado" className="btn btn-default">
                  <i className="lni lni-arrow-left"></i> Voltar
                </Link>
              </div>
            </div>
          </div>
          
          <div className="alert alert-info">
            <i className="lni lni-information"></i> Configure seus dados bancários para receber seus saques.
          </div>
          
          <form action="/api/afiliado/dados-bancarios" method="POST" className="form-horizontal">
            <h4><i className="lni lni-credit-cards"></i> Dados da Conta Bancária</h4>
            <hr />
            
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-3 control-label">Banco</label>
              <div className="col-sm-9">
                <input type="text" name="banco" className="form-control" placeholder="Nome do banco" defaultValue={afiliado?.banco || ''} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-3 control-label">Agência</label>
              <div className="col-sm-9">
                <input type="text" name="agencia" className="form-control" placeholder="0000" defaultValue={afiliado?.agencia || ''} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-3 control-label">Conta</label>
              <div className="col-sm-9">
                <input type="text" name="conta" className="form-control" placeholder="00000-0" defaultValue={afiliado?.conta || ''} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-3 control-label">Tipo de Conta</label>
              <div className="col-sm-9">
                <select name="tipo_conta" className="form-control" defaultValue={afiliado?.tipo_conta || 'corrente'}>
                  <option value="corrente">Corrente</option>
                  <option value="poupanca">Poupança</option>
                </select>
              </div>
            </div>

            <h4><i className="lni lni-qr-code"></i> Pix</h4>
            <hr />

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-3 control-label">Tipo de Chave Pix</label>
              <div className="col-sm-9">
                <select name="pix_tipo" className="form-control" defaultValue={afiliado?.pix_tipo || 'cpf'}>
                  <option value="cpf">CPF</option>
                  <option value="cnpj">CNPJ</option>
                  <option value="email">Email</option>
                  <option value="telefone">Telefone</option>
                  <option value="aleatoria">Chave Aleatória</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-3 control-label">Chave Pix</label>
              <div className="col-sm-9">
                <input type="text" name="pix_chave" className="form-control" placeholder="Sua chave Pix" defaultValue={afiliado?.pix_chave || ''} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <div className="col-sm-offset-3 col-sm-9">
                <button type="submit" className="btn btn-success">
                  <i className="lni lni-checkmark"></i> Salvar Dados
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
