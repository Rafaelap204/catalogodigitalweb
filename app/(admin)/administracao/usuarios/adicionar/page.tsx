import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { salvarUsuario } from '@/lib/server/actions/usuarios';
import { listarEstabelecimentos } from '@/lib/server/actions/estabelecimentos';

export default async function AdicionarUsuarioPage() {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  // Buscar estabelecimentos para o select
  const { estabelecimentos } = await listarEstabelecimentos({ limite: 100 });

  async function handleSubmit(formData: FormData) {
    'use server';
    
    const result = await salvarUsuario(formData);
    
    if (result.success) {
      redirect('/administracao/usuarios?success=adicionado');
    } else {
      redirect(`/administracao/usuarios/adicionar?error=${encodeURIComponent(result.error || 'Erro ao salvar')}`);
    }
  }

  return (
    <div className="row">
      <div className="col-md-12">
        {/* Header */}
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-md-8">
            <h2>
              <i className="lni lni-plus"></i> Adicionar Usuário
              <small style={{ display: 'block', fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Cadastre um novo usuário no sistema
              </small>
            </h2>
          </div>
          <div className="col-md-4 text-right">
            <Link 
              href="/administracao/usuarios" 
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
                  <i className="lni lni-user"></i> Dados Básicos
                </h4>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Nome Completo *</label>
                  <input 
                    type="text" 
                    name="nome" 
                    className="form-control"
                    placeholder="Ex: João Silva"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Email *</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="form-control"
                    placeholder="Ex: joao@exemplo.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Senha *</label>
                  <input 
                    type="password" 
                    name="senha" 
                    className="form-control"
                    placeholder="Digite uma senha"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Telefone</label>
                  <input 
                    type="text" 
                    name="telefone" 
                    className="form-control"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>

            {/* Nível e Status */}
            <div className="row">
              <div className="col-md-12">
                <h4 style={{ margin: '30px 0 20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <i className="lni lni-cog"></i> Permissões
                </h4>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Nível de Acesso *</label>
                  <select name="nivel" className="form-control" required>
                    <option value="1">Administrador</option>
                    <option value="2">Estabelecimento</option>
                    <option value="3">Afiliado</option>
                    <option value="4">Cliente</option>
                  </select>
                  <small className="text-muted">
                    Define as permissões do usuário no sistema
                  </small>
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

            {/* Vinculação */}
            <div className="row">
              <div className="col-md-12">
                <h4 style={{ margin: '30px 0 20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <i className="lni lni-link"></i> Vinculação (Opcional)
                </h4>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Estabelecimento Vinculado</label>
                  <select name="estabelecimento_id" className="form-control">
                    <option value="">Nenhum</option>
                    {estabelecimentos.map((est) => (
                      <option key={est.id} value={est.id}>
                        {est.nome}
                      </option>
                    ))}
                  </select>
                  <small className="text-muted">
                    Para nível "Estabelecimento"
                  </small>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Avatar (URL)</label>
                  <input 
                    type="text" 
                    name="avatar" 
                    className="form-control"
                    placeholder="https://exemplo.com/avatar.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="row" style={{ marginTop: '30px' }}>
              <div className="col-md-12">
                <hr />
                <button type="submit" className="btn btn-success">
                  <i className="lni lni-checkmark"></i> Salvar Usuário
                </button>
                <Link href="/administracao/usuarios" className="btn btn-default" style={{ marginLeft: '10px' }}>
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
