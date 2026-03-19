import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function AdicionarProdutoPage() {
  const session = await getSession();
  
  if (!session || session.nivel !== 2) {
    redirect('/login');
  }

  const supabase = await createClient();
  const estabelecimentoId = session.estabelecimento_id || '0';
  
  // Busca categorias para o select
  const { data: categorias } = await (supabase
    .from('categorias') as any)
    .select('id, nome')
    .order('nome');

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="box box-white">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <div className="row">
              <div className="col-sm-8">
                <h2><i className="lni lni-plus"></i> Adicionar Produto</h2>
              </div>
              <div className="col-sm-4 text-right">
                <Link href="/painel/produtos" className="btn btn-default">
                  <i className="lni lni-arrow-left"></i> Voltar
                </Link>
              </div>
            </div>
          </div>
          
          <form action="/api/painel/produtos" method="POST" className="form-horizontal">
            <input type="hidden" name="estabelecimento_id" value={estabelecimentoId} />
            
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-2 control-label">Nome <span className="text-danger">*</span></label>
              <div className="col-sm-10">
                <input type="text" name="nome" className="form-control" required />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-2 control-label">Categoria</label>
              <div className="col-sm-10">
                <select name="categoria_id" className="form-control">
                  <option value="">Selecione uma categoria</option>
                  {categorias?.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-2 control-label">Preço <span className="text-danger">*</span></label>
              <div className="col-sm-10">
                <div className="input-group">
                  <span className="input-group-addon">R$</span>
                  <input type="number" name="preco" step="0.01" min="0" className="form-control" required />
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-2 control-label">Preço Promocional</label>
              <div className="col-sm-10">
                <div className="input-group">
                  <span className="input-group-addon">R$</span>
                  <input type="number" name="preco_promocional" step="0.01" min="0" className="form-control" />
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-2 control-label">Foto URL</label>
              <div className="col-sm-10">
                <input type="url" name="foto" className="form-control" placeholder="https://exemplo.com/imagem.jpg" />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-2 control-label">Descrição</label>
              <div className="col-sm-10">
                <textarea name="descricao" className="form-control" rows={4}></textarea>
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
                  <i className="lni lni-checkmark"></i> Salvar Produto
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
