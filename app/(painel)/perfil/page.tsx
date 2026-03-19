import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function PerfilPage() {
  const session = await getSession();
  
  if (!session || session.nivel !== 2) {
    redirect('/login');
  }

  const supabase = await createClient();
  const estabelecimentoId = session.estabelecimento_id;
  
  if (!estabelecimentoId) {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="box box-white">
            <div className="alert alert-warning">
              <i className="lni lni-warning"></i> Este usuário não está vinculado a nenhum estabelecimento.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { data: estabelecimento } = await (supabase
    .from('estabelecimentos') as any)
    .select('id, nome, email, telefone, whatsapp, endereco, cidade, estado, descricao, avatar, status')
    .eq('id', estabelecimentoId)
    .single();

  if (!estabelecimento) {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="box box-white">
            <div className="alert alert-danger">
              <i className="lni lni-close"></i> Estabelecimento não encontrado.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-md-8">
        <div className="box box-white">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <h2><i className="lni lni-user"></i> Perfil do Estabelecimento</h2>
          </div>
          
          <form action="/api/perfil" method="POST" className="form-horizontal">
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-3 control-label">Nome *</label>
              <div className="col-sm-9">
                <input type="text" name="nome" className="form-control" defaultValue={estabelecimento.nome} required />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-3 control-label">Email</label>
              <div className="col-sm-9">
                <input type="email" name="email" className="form-control" defaultValue={estabelecimento.email || ''} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-3 control-label">Telefone</label>
              <div className="col-sm-9">
                <input type="text" name="telefone" className="form-control" defaultValue={estabelecimento.telefone || ''} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-3 control-label">WhatsApp</label>
              <div className="col-sm-9">
                <input type="text" name="whatsapp" className="form-control" defaultValue={estabelecimento.whatsapp || ''} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-3 control-label">Endereço</label>
              <div className="col-sm-9">
                <input type="text" name="endereco" className="form-control" defaultValue={estabelecimento.endereco || ''} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-3 control-label">Cidade</label>
              <div className="col-sm-9">
                <input type="text" name="cidade" className="form-control" defaultValue={estabelecimento.cidade || ''} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-3 control-label">Estado</label>
              <div className="col-sm-9">
                <input type="text" name="estado" maxLength={2} className="form-control" defaultValue={estabelecimento.estado || ''} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="col-sm-3 control-label">Descrição</label>
              <div className="col-sm-9">
                <textarea name="descricao" className="form-control" rows={5} defaultValue={estabelecimento.descricao || ''}></textarea>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <div className="col-sm-offset-3 col-sm-9">
                <button type="submit" className="btn btn-success">
                  <i className="lni lni-checkmark"></i> Salvar Alterações
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="col-md-4">
        <div className="box box-white">
          <h4><i className="lni lni-image"></i> Logo</h4>
          <hr />
          {estabelecimento.avatar ? (
            <img src={estabelecimento.avatar} alt="Logo" className="img-responsive" />
          ) : (
            <div style={{ background: '#f5f5f5', padding: '40px', textAlign: 'center' }}>
              <i className="lni lni-image" style={{ fontSize: '48px', color: '#999' }}></i>
            </div>
          )}
          <hr />
          <form action="/api/perfil/logo" method="POST" encType="multipart/form-data">
            <input type="file" name="logo" accept="image/*" className="form-control" style={{ marginBottom: '10px' }} />
            <button type="submit" className="btn btn-primary btn-block">
              <i className="lni lni-upload"></i> Atualizar Logo
            </button>
          </form>
        </div>

        <div className="box box-white">
          <h4><i className="lni lni-information"></i> Informações</h4>
          <hr />
          <p><strong>Status:</strong> <span className={`badge ${estabelecimento.status === 'ativo' ? 'badge-success' : 'badge-danger'}`}>{estabelecimento.status === 'ativo' ? 'Ativo' : 'Inativo'}</span></p>
          <p><strong>ID:</strong> #{estabelecimento.id}</p>
        </div>
      </div>
    </div>
  );
}
