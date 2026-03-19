import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { salvarProduto } from '@/lib/server/actions/produtos';
import { listarEstabelecimentos } from '@/lib/server/actions/estabelecimentos';

export default async function AdicionarProdutoPage() {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  // Buscar estabelecimentos para o select
  const { estabelecimentos } = await listarEstabelecimentos({ limite: 100 });

  async function handleSubmit(formData: FormData) {
    'use server';
    
    const result = await salvarProduto(formData);
    
    if (result.success) {
      redirect('/administracao/produtos?success=adicionado');
    } else {
      redirect(`/administracao/produtos/adicionar?error=${encodeURIComponent(result.error || 'Erro ao salvar')}`);
    }
  }

  return (
    <div className="row">
      <div className="col-md-12">
        {/* Header */}
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-md-8">
            <h2>
              <i className="lni lni-plus"></i> Adicionar Produto
              <small style={{ display: 'block', fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Cadastre um novo produto no sistema
              </small>
            </h2>
          </div>
          <div className="col-md-4 text-right">
            <Link 
              href="/administracao/produtos" 
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
            {/* Estabelecimento */}
            <div className="row">
              <div className="col-md-12">
                <h4 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <i className="lni lni-shop"></i> Estabelecimento
                </h4>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Estabelecimento *</label>
                  <select name="estabelecimento_id" className="form-control" required>
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
                  <label>Categoria</label>
                  <select name="categoria_id" className="form-control">
                    <option value="">Sem categoria</option>
                    {/* TODO: Carregar categorias dinamicamente */}
                  </select>
                </div>
              </div>
            </div>

            {/* Dados do Produto */}
            <div className="row">
              <div className="col-md-12">
                <h4 style={{ margin: '30px 0 20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <i className="lni lni-cart"></i> Dados do Produto
                </h4>
              </div>
            </div>

            <div className="row">
              <div className="col-md-8">
                <div className="form-field">
                  <label>Nome do Produto *</label>
                  <input 
                    type="text" 
                    name="nome" 
                    className="form-control"
                    placeholder="Ex: Pizza de Calabresa"
                    required
                  />
                </div>
              </div>
              <div className="col-md-4">
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
              <div className="col-md-12">
                <div className="form-field">
                  <label>Descrição</label>
                  <textarea 
                    name="descricao" 
                    className="form-control"
                    rows={3}
                    placeholder="Descrição do produto..."
                  />
                </div>
              </div>
            </div>

            {/* Preços */}
            <div className="row">
              <div className="col-md-12">
                <h4 style={{ margin: '30px 0 20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <i className="lni lni-coin"></i> Preços
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
                  <label>Preço Promocional</label>
                  <div className="input-group">
                    <span className="input-group-addon">R$</span>
                    <input 
                      type="number" 
                      name="preco_promocional" 
                      className="form-control"
                      placeholder="0,00"
                      step="0.01"
                      min="0"
                    />
                  </div>
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
                  <label>Imagem (URL)</label>
                  <input 
                    type="text" 
                    name="imagem" 
                    className="form-control"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
              </div>
              <div className="col-md-3">
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
              <div className="col-md-3">
                <div className="form-field">
                  <label>Destaque</label>
                  <select name="destaque" className="form-control">
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="row" style={{ marginTop: '30px' }}>
              <div className="col-md-12">
                <hr />
                <button type="submit" className="btn btn-success">
                  <i className="lni lni-checkmark"></i> Salvar Produto
                </button>
                <Link href="/administracao/produtos" className="btn btn-default" style={{ marginLeft: '10px' }}>
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
