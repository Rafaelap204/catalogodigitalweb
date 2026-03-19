import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';

export default async function AdicionarCategoriaPage() {
  const session = await getSession();
  
  if (!session || session.nivel !== 2) {
    redirect('/login');
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="box box-white">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <div className="row">
              <div className="col-sm-8">
                <h2><i className="lni lni-plus"></i> Adicionar Categoria</h2>
              </div>
              <div className="col-sm-4 text-right">
                <Link href="/painel/categorias" className="btn btn-default">
                  <i className="lni lni-arrow-left"></i> Voltar
                </Link>
              </div>
            </div>
          </div>
          
          <form action="/api/painel/categorias" method="POST" className="form-horizontal">
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-2 control-label">Nome <span className="text-danger">*</span></label>
              <div className="col-sm-10">
                <input type="text" name="nome" className="form-control" required placeholder="Nome da categoria" />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-2 control-label">Ícone</label>
              <div className="col-sm-10">
                <input type="text" name="icone" className="form-control" placeholder="lni-tag (classe do ícone)" defaultValue="lni-tag" />
                <small className="text-muted">Use classes do LineIcons. Ex: lni-tag, lni-food, lni-drink</small>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-2 control-label">Status</label>
              <div className="col-sm-10">
                <select name="status" className="form-control">
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <div className="col-sm-offset-2 col-sm-10">
                <button type="submit" className="btn btn-success">
                  <i className="lni lni-checkmark"></i> Salvar Categoria
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
