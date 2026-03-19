import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { buscarCupom, atualizarCupom } from '@/lib/server/actions/cupons';
import { listarEstabelecimentos } from '@/lib/server/actions/estabelecimentos';

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function EditarCupomPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session || session.nivel !== 1) redirect('/login');

  const { id } = await searchParams;
  if (!id) redirect('/administracao/cupons');

  const cupom = await buscarCupom(id);
  if (!cupom) redirect('/administracao/cupons?error=nao_encontrado');

  const { estabelecimentos } = await listarEstabelecimentos({ limite: 100 });

  async function handleSubmit(formData: FormData) {
    'use server';
    const result = await atualizarCupom(id!, formData);
    if (result.success) redirect('/administracao/cupons?success=atualizado');
    else redirect(`/administracao/cupons/editar?id=${id}&error=${encodeURIComponent(result.error || 'Erro')}`);
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-md-8"><h2><i className="lni lni-pencil"></i> Editar Cupom</h2></div>
          <div className="col-md-4 text-right">
            <Link href="/administracao/cupons" className="btn btn-default" style={{ marginTop: '10px' }}><i className="lni lni-arrow-left"></i> Voltar</Link>
          </div>
        </div>

        <div className="box box-white">
          <form action={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Código *</label>
                  <input type="text" name="codigo" className="form-control" defaultValue={cupom.codigo} required style={{ textTransform: 'uppercase' }} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Tipo *</label>
                  <select name="tipo" className="form-control" defaultValue={cupom.tipo} required>
                    <option value="percentual">Percentual (%)</option>
                    <option value="fixo">Valor Fixo (R$)</option>
                    <option value="frete_gratis">Frete Grátis</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Valor *</label>
                  <input type="number" name="valor" className="form-control" defaultValue={cupom.valor} step="0.01" min="0" required />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Valor Mínimo</label>
                  <input type="number" name="valor_minimo" className="form-control" defaultValue={cupom.valor_minimo || ''} step="0.01" min="0" />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Limite de Usos</label>
                  <input type="number" name="limite_uso" className="form-control" defaultValue={cupom.limite_uso || ''} min="1" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Status</label>
                  <select name="status" className="form-control" defaultValue={cupom.status}>
                    <option value="1">Ativo</option>
                    <option value="0">Inativo</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Data de Início</label>
                  <input type="date" name="data_inicio" className="form-control" defaultValue={cupom.data_inicio?.split('T')[0]} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Data de Término</label>
                  <input type="date" name="data_fim" className="form-control" defaultValue={cupom.data_fim?.split('T')[0]} />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Estabelecimento Específico</label>
                  <select name="estabelecimento_id" className="form-control" defaultValue={cupom.estabelecimento_id || ''}>
                    <option value="">Todos</option>
                    {estabelecimentos.map((est) => <option key={est.id} value={est.id}>{est.nome}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="row" style={{ marginTop: '30px' }}>
              <div className="col-md-12">
                <hr />
                <button type="submit" className="btn btn-success"><i className="lni lni-checkmark"></i> Atualizar Cupom</button>
                <Link href="/administracao/cupons" className="btn btn-default" style={{ marginLeft: '10px' }}>Cancelar</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
