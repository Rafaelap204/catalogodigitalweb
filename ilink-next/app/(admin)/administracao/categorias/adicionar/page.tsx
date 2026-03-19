import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { salvarCategoria } from '@/lib/server/actions/categorias';
import { listarEstabelecimentos } from '@/lib/server/actions/estabelecimentos';

export default async function AdicionarCategoriaPage() {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  // Buscar estabelecimentos para o select
  const { estabelecimentos } = await listarEstabelecimentos({ limite: 100 });

  async function handleSubmit(formData: FormData) {
    'use server';
    
    const result = await salvarCategoria(formData);
    
    if (result.success) {
      redirect('/administracao/categorias?success=adicionado');
    } else {
      redirect(`/administracao/categorias/adicionar?error=${encodeURIComponent(result.error || 'Erro ao salvar')}`);
    }
  }

  return (
    <div className="row">
      <div className="col-md-12">
        {/* Header */}
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-md-8">
            <h2>
              <i className="lni lni-plus"></i> Adicionar Categoria
              <small style={{ display: 'block', fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Cadastre uma nova categoria de produtos
              </small>
            </h2>
          </div>
          <div className="col-md-4 text-right">
            <Link 
              href="/administracao/categorias" 
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
            </div>

            {/* Dados da Categoria */}
            <div className="row">
              <div className="col-md-12">
                <h4 style={{ margin: '30px 0 20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <i className="lni lni-tag"></i> Dados da Categoria
                </h4>
              </div>
            </div>

            <div className="row">
              <div className="col-md-8">
                <div className="form-field">
                  <label>Nome da Categoria *</label>
                  <input 
                    type="text" 
                    name="nome" 
                    className="form-control"
                    placeholder="Ex: Pizzas"
                    required
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-field">
                  <label>Ícone (classe LNI)</label>
                  <input 
                    type="text" 
                    name="icone" 
                    className="form-control"
                    placeholder="Ex: pizza"
                  />
                  <small className="text-muted">
                    Ex: pizza, burger, drink, etc. <a href="https://lineicons.com/icons/" target="_blank" rel="noopener noreferrer">Ver ícones</a>
                  </small>
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
                    placeholder="Descrição da categoria..."
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
                  <label>Ordem</label>
                  <input 
                    type="number" 
                    name="ordem" 
                    className="form-control"
                    placeholder="0"
                    defaultValue="0"
                  />
                  <small className="text-muted">Define a ordem de exibição (menor primeiro)</small>
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

            {/* Botões */}
            <div className="row" style={{ marginTop: '30px' }}>
              <div className="col-md-12">
                <hr />
                <button type="submit" className="btn btn-success">
                  <i className="lni lni-checkmark"></i> Salvar Categoria
                </button>
                <Link href="/administracao/categorias" className="btn btn-default" style={{ marginLeft: '10px' }}>
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
