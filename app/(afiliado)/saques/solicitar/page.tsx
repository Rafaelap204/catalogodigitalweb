import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function SolicitarSaquePage() {
  const session = await getSession();
  
  if (!session || session.nivel !== 3) {
    redirect('/login');
  }

  const afiliadoId = session.afiliado_id || session.id;
  const supabase = await createClient();
  
  // Busca saldo disponível
  const { data: comissoes } = await (supabase
    .from('comissoes') as any)
    .select('valor')
    .eq('afiliado_id', afiliadoId)
    .eq('status', 'pendente');
  
  const saldoDisponivel = comissoes?.reduce((sum: number, c: any) => sum + (parseFloat(c.valor) || 0), 0) || 0;
  
  // Busca dados bancários
  const { data: afiliado } = await (supabase
    .from('users') as any)
    .select('pix_tipo, pix_chave, banco, agencia, conta')
    .eq('id', afiliadoId)
    .single();

  const temDadosBancarios = afiliado?.pix_chave || (afiliado?.banco && afiliado?.conta);

  if (!temDadosBancarios) {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="alert alert-warning">
            <i className="lni lni-warning"></i> Você precisa configurar seus dados bancários antes de solicitar um saque.
          </div>
          <Link href="/afiliado/dados-bancarios" className="btn btn-primary">
            <i className="lni lni-bank"></i> Configurar Dados Bancários
          </Link>
        </div>
      </div>
    );
  }

  if (saldoDisponivel < 50) {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="alert alert-warning">
            <i className="lni lni-warning"></i> O valor mínimo para saque é de R$ 50,00. Seu saldo atual é de R$ {saldoDisponivel.toFixed(2)}.
          </div>
          <Link href="/afiliado/saques" className="btn btn-default">
            <i className="lni lni-arrow-left"></i> Voltar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-md-8 col-md-offset-2">
        <div className="box box-white">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <h2><i className="lni lni-wallet"></i> Solicitar Saque</h2>
          </div>
          
          <div className="alert alert-success">
            <h4>Saldo Disponível: R$ {saldoDisponivel.toFixed(2)}</h4>
          </div>
          
          <div className="alert alert-info">
            <h5><i className="lni lni-bank"></i> Dados para Pagamento</h5>
            {afiliado?.pix_chave ? (
              <p><strong>Pix ({afiliado.pix_tipo}):</strong> {afiliado.pix_chave}</p>
            ) : (
              <>
                <p><strong>Banco:</strong> {afiliado?.banco}</p>
                <p><strong>Agência:</strong> {afiliado?.agencia} <strong>Conta:</strong> {afiliado?.conta}</p>
              </>
            )}
            <Link href="/afiliado/dados-bancarios" className="btn btn-default btn-sm">
              <i className="lni lni-pencil"></i> Alterar Dados
            </Link>
          </div>
          
          <form action="/api/afiliado/saques/solicitar" method="POST">
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label>Valor do Saque *</label>
              <div className="input-group">
                <span className="input-group-addon">R$</span>
                <input 
                  type="number" 
                  name="valor" 
                  className="form-control input-lg" 
                  step="0.01" 
                  min="50" 
                  max={saldoDisponivel}
                  defaultValue={saldoDisponivel.toFixed(2)}
                  required 
                />
              </div>
              <small className="text-muted">Mínimo: R$ 50,00 | Máximo: R$ {saldoDisponivel.toFixed(2)}</small>
            </div>
            
            <div className="text-center">
              <Link href="/afiliado/saques" className="btn btn-default btn-lg" style={{ marginRight: '10px' }}>
                <i className="lni lni-close"></i> Cancelar
              </Link>
              <button type="submit" className="btn btn-success btn-lg">
                <i className="lni lni-checkmark"></i> Confirmar Saque
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
