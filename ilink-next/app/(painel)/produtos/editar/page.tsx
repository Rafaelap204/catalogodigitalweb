import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function EditarProdutoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  
  if (!session || session.nivel !== 2) {
    redirect('/login');
  }

  const params = await searchParams;
  const produtoId = params.id;
  
  if (!produtoId) {
    redirect('/painel/produtos');
  }

  const supabase = await createClient();
  const estabelecimentoId = session.estabelecimento_id || '0';
  
  // Busca produto
  const { data: produto } = await (supabase
    .from('produtos') as any)
    .select('id, nome, preco, preco_promocional, foto, categoria_id, descricao, status')
    .eq('id', produtoId)
    .eq('estabelecimento_id', estabelecimentoId)
    .single();

  // Busca categorias
  const { data: categorias } = await (supabase
    .from('categorias') as any)
    .select('id, nome')
    .order('nome');

  if (!produto) {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="alert alert-danger">
            <i className="lni lni-close"></i> Produto não encontrado.
          </div>
          <Link href="/painel/produtos" className="btn btn-default">
            <i className="lni lni-arrow-left"></i> Voltar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="box box-white">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <div className="row">
              <div className="col-sm-8">
                <h2><i className="lni lni-pencil"></i> Editar Produto</h2>
              </div>
              <div className="col-sm-4 text-right">
                <Link href="/painel/produtos" className="btn btn-default">
                  <i className="lni lni-arrow-left"></i> Voltar
                </Link>
              </div>
            </div>
          </div>
          
          <form action={`/api/painel/produtos/editar?id=${produtoId}`} method="POST" className="form-horizontal">
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-2 control-label">Nome <span className="text-danger">*</span></label>
              <div className="col-sm-10">
                <input type="text" name="nome" className="form-control" defaultValue={produto.nome} required />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-2 control-label">Categoria</label>
              <div className="col-sm-10">
                <select name="categoria_id" className="form-control" defaultValue={produto.categoria_id || ''}>
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
                  <input type="number" name="preco" step="0.01" min="0" className="form-control" defaultValue={produto.preco} required />
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-2 control-label">Preço Promocional</label>
              <div className="col-sm-10">
                <div className="input-group">
                  <span className="input-group-addon">R$</span>
                  <input type="number" name="preco_promocional" step="0.01" min="0" className="form-control" defaultValue={produto.preco_promocional || ''} />
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-2 control-label">Foto URL</label>
              <div className="col-sm-10">
                <input type="url" name="foto" className="form-control" defaultValue={produto.foto || ''} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-2 control-label">Descrição</label>
              <div className="col-sm-10">
                <textarea name="descricao" className="form-control" rows={4} defaultValue={produto.descricao || ''}></textarea>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-2 control-label">Status</label>
              <div className="col-sm-10">
                <select name="status" className="form-control" defaultValue={produto.status}>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <div className="col-sm-offset-2 col-sm-10">
                <button type="submit" className="btn btn-success">
                  <i className="lni lni-checkmark"></i> Salvar Alterações
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
