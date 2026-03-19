import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { buscarPlano, atualizarPlano } from '@/lib/server/actions/planos';

interface Props {
  searchParams: Promise<{ 
    id?: string;
    [key: string]: string | undefined;
  }>;
}

export default async function EditarPlanoPage({ searchParams }: Props) {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  const params = await searchParams;
  const id = params.id;

  if (!id) {
    redirect('/administracao/planos');
  }

  const plano = await buscarPlano(id);

  if (!plano) {
    redirect('/administracao/planos?error=nao_encontrado');
  }

  async function handleSubmit(formData: FormData) {
    'use server';
    
    const result = await atualizarPlano(id!, formData);
    
    if (result.success) {
      redirect('/administracao/planos?success=atualizado');
    } else {
      redirect(`/administracao/planos/editar?id=${id}&error=${encodeURIComponent(result.error || 'Erro ao atualizar')}`);
    }
  }

  return (
    <div className="row">
      <div className="col-md-12">
        {/* Header */}
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-md-8">
            <h2>
              <i className="lni lni-pencil"></i> Editar Plano
              <small style={{ display: 'block', fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Edite as informações do plano
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
                    defaultValue={plano.nome}
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
                    defaultValue={plano.ordem || 0}
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
                    defaultValue={plano.descricao || ''}
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
                      defaultValue={plano.preco}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Periodicidade</label>
                  <select name="periodicidade" className="form-control" defaultValue={plano.periodicidade || 'mensal'}>
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
                    defaultValue={plano.limite_produtos || ''}
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
                    defaultValue={plano.limite_estabelecimentos || ''}
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
                    defaultValue={plano.recursos || ''}
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
                  <select name="status" className="form-control" defaultValue={plano.status}>
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
                  <i className="lni lni-checkmark"></i> Atualizar Plano
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
