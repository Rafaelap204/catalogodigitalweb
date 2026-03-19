import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { salvarCupom } from '@/lib/server/actions/cupons';
import { listarEstabelecimentos } from '@/lib/server/actions/estabelecimentos';

export default async function AdicionarCupomPage() {
  const session = await getSession();
  if (!session || session.nivel !== 1) redirect('/login');

  const { estabelecimentos } = await listarEstabelecimentos({ limite: 100 });

  async function handleSubmit(formData: FormData) {
    'use server';
    const result = await salvarCupom(formData);
    if (result.success) redirect('/administracao/cupons?success=adicionado');
    else redirect(`/administracao/cupons/adicionar?error=${encodeURIComponent(result.error || 'Erro')}`);
  }

  const hoje = new Date().toISOString().split('T')[0];
  const daqui30Dias = new Date(); daqui30Dias.setDate(daqui30Dias.getDate() + 30);

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-md-8">
            <h2><i className="lni lni-plus"></i> Novo Cupom</h2>
          </div>
          <div className="col-md-4 text-right">
            <Link href="/administracao/cupons" className="btn btn-default" style={{ marginTop: '10px' }}>
              <i className="lni lni-arrow-left"></i> Voltar
            </Link>
          </div>
        </div>

        <div className="box box-white">
          <form action={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Código *</label>
                  <input type="text" name="codigo" className="form-control" placeholder="DESCONTO10" required style={{ textTransform: 'uppercase' }} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Tipo *</label>
                  <select name="tipo" className="form-control" required>
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
                  <input type="number" name="valor" className="form-control" placeholder="10" step="0.01" min="0" required />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Valor Mínimo (opcional)</label>
                  <input type="number" name="valor_minimo" className="form-control" placeholder="R$ 0,00" step="0.01" min="0" />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Limite de Usos (opcional)</label>
                  <input type="number" name="limite_uso" className="form-control" placeholder="Ilimitado" min="1" />
                </div>
              </div>
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

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Data de Início</label>
                  <input type="date" name="data_inicio" className="form-control" defaultValue={hoje} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Data de Término</label>
                  <input type="date" name="data_fim" className="form-control" defaultValue={daqui30Dias.toISOString().split('T')[0]} />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Estabelecimento Específico (opcional)</label>
                  <select name="estabelecimento_id" className="form-control">
                    <option value="">Todos</option>
                    {estabelecimentos.map((est) => <option key={est.id} value={est.id}>{est.nome}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="row" style={{ marginTop: '30px' }}>
              <div className="col-md-12">
                <hr />
                <button type="submit" className="btn btn-success"><i className="lni lni-checkmark"></i> Salvar Cupom</button>
                <Link href="/administracao/cupons" className="btn btn-default" style={{ marginLeft: '10px' }}>Cancelar</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
