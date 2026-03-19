import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { salvarBanner } from '@/lib/server/actions/banners';
import { posicoesOptions } from '@/lib/helpers';
import { listarEstabelecimentos } from '@/lib/server/actions/estabelecimentos';

export default async function AdicionarBannerPage() {
  const session = await getSession();
  if (!session || session.nivel !== 1) redirect('/login');

  const { estabelecimentos } = await listarEstabelecimentos({ limite: 100 });

  async function handleSubmit(formData: FormData) {
    'use server';
    const result = await salvarBanner(formData);
    if (result.success) redirect('/administracao/banners?success=adicionado');
    else redirect(`/administracao/banners/adicionar?error=${encodeURIComponent(result.error || 'Erro')}`);
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-md-8"><h2><i className="lni lni-plus"></i> Novo Banner</h2></div>
          <div className="col-md-4 text-right">
            <Link href="/administracao/banners" className="btn btn-default" style={{ marginTop: '10px' }}><i className="lni lni-arrow-left"></i> Voltar</Link>
          </div>
        </div>

        <div className="box box-white">
          <form action={handleSubmit}>
            <div className="row">
              <div className="col-md-12">
                <div className="form-field">
                  <label>Imagem (URL) *</label>
                  <input type="text" name="imagem" className="form-control" placeholder="https://exemplo.com/imagem.jpg" required />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Título</label>
                  <input type="text" name="titulo" className="form-control" placeholder="Título do banner" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Subtítulo</label>
                  <input type="text" name="subtitulo" className="form-control" placeholder="Subtítulo" />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Link</label>
                  <input type="text" name="link" className="form-control" placeholder="https://exemplo.com/promocao" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Posição *</label>
                  <select name="posicao" className="form-control" required>
                    {posicoesOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Ordem</label>
                  <input type="number" name="ordem" className="form-control" defaultValue="0" />
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
                  <label>Estabelecimento Específico</label>
                  <select name="estabelecimento_id" className="form-control">
                    <option value="">Todos (Global)</option>
                    {estabelecimentos.map((est) => <option key={est.id} value={est.id}>{est.nome}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="row" style={{ marginTop: '30px' }}>
              <div className="col-md-12">
                <hr />
                <button type="submit" className="btn btn-success"><i className="lni lni-checkmark"></i> Salvar Banner</button>
                <Link href="/administracao/banners" className="btn btn-default" style={{ marginLeft: '10px' }}>Cancelar</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
