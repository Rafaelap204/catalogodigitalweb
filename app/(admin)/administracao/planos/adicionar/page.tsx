import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { salvarPlano } from '@/lib/server/actions/planos';

export default async function AdicionarPlanoPage() {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  async function handleSubmit(formData: FormData) {
    'use server';
    
    const result = await salvarPlano(formData);
    
    if (result.success) {
      redirect('/administracao/planos?success=adicionado');
    } else {
      redirect(`/administracao/planos/adicionar?error=${encodeURIComponent(result.error || 'Erro ao salvar')}`);
    }
  }

  return (
    <div className="row">
      <div className="col-md-12">
        {/* Header */}
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-md-8">
            <h2>
              <i className="lni lni-plus"></i> Adicionar Plano
              <small style={{ display: 'block', fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Cadastre um novo plano de assinatura
              </small>
            </h2>
          </div>
          <div className="col-md-4 text-right">
            <Link 
              href="/administracao/planos" 
              className="btn btn-default"
              style={{ marginTop: '10px' }}
            >
              <i className="lni lni-arrow-left"></i> Voltar
            </Link>
          </div>
        </div>

        {/* Formulário */}
        <div className="box box-white">
          <form action={handleSubmit}>
            {/* Dados Básicos */}
            <div className="row">
              <div className="col-md-12">
                <h4 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <i className="lni lni-diamond"></i> Dados do Plano
                </h4>
              </div>
            </div>

            <div className="row">
              <div className="col-md-8">
                <div className="form-field">
                  <label>Nome do Plano *</label>
                  <input 
                    type="text" 
                    name="nome" 
                    className="form-control"
                    placeholder="Ex: Plano Premium"
                    required
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-field">
                  <label>Ordem</label>
                  <input 
                    type="number" 
                    name="ordem" 
                    className="form-control"
                    placeholder="0"
                    defaultValue="0"
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="form-field">
                  <label>Descrição</label>
                  <textarea 
                    name="descricao" 
                    className="form-control"
                    rows={3}
                    placeholder="Descrição do plano..."
                  />
                </div>
              </div>
            </div>

            {/* Preço e Periodicidade */}
            <div className="row">
              <div className="col-md-12">
                <h4 style={{ margin: '30px 0 20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <i className="lni lni-coin"></i> Preço e Periodicidade
                </h4>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Preço *</label>
                  <div className="input-group">
                    <span className="input-group-addon">R$</span>
                    <input 
                      type="number" 
                      name="preco" 
                      className="form-control"
                      placeholder="0,00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Periodicidade</label>
                  <select name="periodicidade" className="form-control">
                    <option value="mensal">Mensal</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="semestral">Semestral</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Limites */}
            <div className="row">
              <div className="col-md-12">
                <h4 style={{ margin: '30px 0 20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <i className="lni lni-layers"></i> Limites do Plano
                </h4>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Limite de Produtos</label>
                  <input 
                    type="number" 
                    name="limite_produtos" 
                    className="form-control"
                    placeholder="Deixe em branco para ilimitado"
                  />
                  <small className="text-muted">Deixe em branco para ilimitado</small>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Limite de Estabelecimentos</label>
                  <input 
                    type="number" 
                    name="limite_estabelecimentos" 
                    className="form-control"
                    placeholder="Deixe em branco para ilimitado"
                  />
                  <small className="text-muted">Deixe em branco para ilimitado</small>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="form-field">
                  <label>Recursos (JSON)</label>
                  <textarea 
                    name="recursos" 
                    className="form-control"
                    rows={4}
                    placeholder='{"feature1": true, "feature2": "valor"}'
                  />
                  <small className="text-muted">JSON com recursos específicos do plano</small>
                </div>
              </div>
            </div>

            {/* Configurações */}
            <div className="row">
              <div className="col-md-12">
                <h4 style={{ margin: '30px 0 20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <i className="lni lni-cog"></i> Configurações
                </h4>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Status</label>
                  <select name="status" className="form-control">
                    <option value="1">Ativo</option>
                    <option value="0">Inativo</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="row" style={{ marginTop: '30px' }}>
              <div className="col-md-12">
                <hr />
                <button type="submit" className="btn btn-success">
                  <i className="lni lni-checkmark"></i> Salvar Plano
                </button>
                <Link href="/administracao/planos" className="btn btn-default" style={{ marginLeft: '10px' }}>
                  Cancelar
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
