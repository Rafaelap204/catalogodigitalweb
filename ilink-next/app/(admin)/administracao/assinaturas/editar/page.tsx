import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { buscarAssinatura, atualizarAssinatura } from '@/lib/server/actions/assinaturas';
import { listarEstabelecimentos } from '@/lib/server/actions/estabelecimentos';
import { listarPlanos } from '@/lib/server/actions/planos';

interface Props {
  searchParams: Promise<{ 
    id?: string;
    [key: string]: string | undefined;
  }>;
}

export default async function EditarAssinaturaPage({ searchParams }: Props) {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  const params = await searchParams;
  const id = params.id;

  if (!id) {
    redirect('/administracao/assinaturas');
  }

  const assinatura = await buscarAssinatura(id);

  if (!assinatura) {
    redirect('/administracao/assinaturas?error=nao_encontrada');
  }

  // Buscar estabelecimentos e planos para os selects
  const { estabelecimentos } = await listarEstabelecimentos({ limite: 100 });
  const { planos } = await listarPlanos({ limite: 100 });

  async function handleSubmit(formData: FormData) {
    'use server';
    
    const result = await atualizarAssinatura(id!, formData);
    
    if (result.success) {
      redirect('/administracao/assinaturas?success=atualizada');
    } else {
      redirect(`/administracao/assinaturas/editar?id=${id}&error=${encodeURIComponent(result.error || 'Erro ao atualizar')}`);
    }
  }

  return (
    <div className="row">
      <div className="col-md-12">
        {/* Header */}
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-md-8">
            <h2>
              <i className="lni lni-pencil"></i> Editar Assinatura
              <small style={{ display: 'block', fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Edite as informações da assinatura
              </small>
            </h2>
          </div>
          <div className="col-md-4 text-right">
            <Link 
              href="/administracao/assinaturas" 
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
            {/* Vinculação */}
            <div className="row">
              <div className="col-md-12">
                <h4 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <i className="lni lni-link"></i> Vinculação
                </h4>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Estabelecimento *</label>
                  <select 
                    name="estabelecimento_id" 
                    className="form-control" 
                    required
                    defaultValue={assinatura.estabelecimento_id}
                  >
                    <option value="">Selecione...</option>
                    {estabelecimentos.map((est) => (
                      <option key={est.id} value={est.id}>
                        {est.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Plano *</label>
                  <select 
                    name="plano_id" 
                    className="form-control" 
                    required
                    defaultValue={assinatura.plano_id}
                  >
                    <option value="">Selecione...</option>
                    {planos.map((plano) => (
                      <option key={plano.id} value={plano.id}>
                        {plano.nome} - R$ {plano.preco.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Período */}
            <div className="row">
              <div className="col-md-12">
                <h4 style={{ margin: '30px 0 20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <i className="lni lni-calendar"></i> Período
                </h4>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Data de Início *</label>
                  <input 
                    type="date" 
                    name="data_inicio" 
                    className="form-control"
                    defaultValue={assinatura.data_inicio?.split('T')[0]}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Data de Término *</label>
                  <input 
                    type="date" 
                    name="data_fim" 
                    className="form-control"
                    defaultValue={assinatura.data_fim?.split('T')[0]}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Pagamento */}
            <div className="row">
              <div className="col-md-12">
                <h4 style={{ margin: '30px 0 20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <i className="lni lni-coin"></i> Pagamento
                </h4>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Valor *</label>
                  <div className="input-group">
                    <span className="input-group-addon">R$</span>
                    <input 
                      type="number" 
                      name="valor" 
                      className="form-control"
                      placeholder="0,00"
                      step="0.01"
                      min="0"
                      defaultValue={assinatura.valor}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Forma de Pagamento</label>
                  <select name="forma_pagamento" className="form-control" defaultValue={assinatura.forma_pagamento}>
                    <option value="">Selecione...</option>
                    <option value="cartao_credito">Cartão de Crédito</option>
                    <option value="cartao_debito">Cartão de Débito</option>
                    <option value="boleto">Boleto</option>
                    <option value="pix">PIX</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="gratuito">Gratuito</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>ID da Transação</label>
                  <input 
                    type="text" 
                    name="transacao_id" 
                    className="form-control"
                    placeholder="ID da transação no gateway"
                    defaultValue={assinatura.transacao_id || ''}
                  />
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
                  <select name="status" className="form-control" defaultValue={assinatura.status}>
                    <option value="ativa">Ativa</option>
                    <option value="pendente">Pendente</option>
                    <option value="cancelada">Cancelada</option>
                    <option value="expirada">Expirada</option>
                    <option value="suspensa">Suspensa</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Renovação Automática</label>
                  <select name="renovacao_automatica" className="form-control" defaultValue={assinatura.renovacao_automatica}>
                    <option value="1">Sim</option>
                    <option value="0">Não</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="row" style={{ marginTop: '30px' }}>
              <div className="col-md-12">
                <hr />
                <button type="submit" className="btn btn-success">
                  <i className="lni lni-checkmark"></i> Atualizar Assinatura
                </button>
                <Link href="/administracao/assinaturas" className="btn btn-default" style={{ marginLeft: '10px' }}>
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
