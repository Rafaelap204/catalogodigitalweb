import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export default async function ConfiguracoesPage() {
  const session = await getSession();
  if (!session || session.nivel !== 1) redirect('/login');

  const supabase = await createClient();
  
  // Buscar configurações atuais
  const { data: configs } = await supabase.from('configuracoes').select('*').maybeSingle() || { data: null };

  async function handleSubmit(formData: FormData) {
    'use server';
    
    const supabase = await createClient();
    const dados = {
      nome_site: formData.get('nome_site') as string,
      descricao_site: formData.get('descricao_site') as string,
      email_contato: formData.get('email_contato') as string,
      telefone_contato: formData.get('telefone_contato') as string,
      whatsapp: formData.get('whatsapp') as string,
      facebook: formData.get('facebook') as string,
      instagram: formData.get('instagram') as string,
      youtube: formData.get('youtube') as string,
      endereco: formData.get('endereco') as string,
      horario_funcionamento: formData.get('horario_funcionamento') as string,
      paginacao_padrao: parseInt(formData.get('paginacao_padrao') as string) || 20,
      manutencao: parseInt(formData.get('manutencao') as string) || 0,
    };

    if (configs?.id) {
      await (supabase.from('configuracoes') as any).update(dados).eq('id', configs.id);
    } else {
      await (supabase.from('configuracoes') as any).insert([dados]);
    }

    revalidatePath('/administracao/configuracoes');
    redirect('/administracao/configuracoes?success=salvo');
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-md-8">
            <h2><i className="lni lni-cog"></i> Configurações</h2>
          </div>
          <div className="col-md-4 text-right">
            <Link href="/administracao" className="btn btn-default" style={{ marginTop: '10px' }}>
              <i className="lni lni-arrow-left"></i> Voltar
            </Link>
          </div>
        </div>

        <div className="box box-white">
          <form action={handleSubmit}>
            <div className="row">
              <div className="col-md-12">
                <h4 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <i className="lni lni-world"></i> Informações do Site
                </h4>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Nome do Site *</label>
                  <input type="text" name="nome_site" className="form-control" defaultValue={configs?.nome_site} required />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Email de Contato *</label>
                  <input type="email" name="email_contato" className="form-control" defaultValue={configs?.email_contato} required />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="form-field">
                  <label>Descrição do Site</label>
                  <textarea name="descricao_site" className="form-control" rows={3} defaultValue={configs?.descricao_site} />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <h4 style={{ margin: '30px 0 20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <i className="lni lni-phone"></i> Contato
                </h4>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <div className="form-field">
                  <label>Telefone</label>
                  <input type="text" name="telefone_contato" className="form-control" defaultValue={configs?.telefone_contato} placeholder="(00) 0000-0000" />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-field">
                  <label>WhatsApp</label>
                  <input type="text" name="whatsapp" className="form-control" defaultValue={configs?.whatsapp} placeholder="(00) 00000-0000" />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-field">
                  <label>Endereço</label>
                  <input type="text" name="endereco" className="form-control" defaultValue={configs?.endereco} />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <h4 style={{ margin: '30px 0 20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <i className="lni lni-facebook"></i> Redes Sociais
                </h4>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <div className="form-field">
                  <label>Facebook</label>
                  <input type="text" name="facebook" className="form-control" defaultValue={configs?.facebook} placeholder="https://facebook.com/..." />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-field">
                  <label>Instagram</label>
                  <input type="text" name="instagram" className="form-control" defaultValue={configs?.instagram} placeholder="https://instagram.com/..." />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-field">
                  <label>YouTube</label>
                  <input type="text" name="youtube" className="form-control" defaultValue={configs?.youtube} placeholder="https://youtube.com/..." />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <h4 style={{ margin: '30px 0 20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <i className="lni lni-cog"></i> Sistema
                </h4>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Paginação Padrão</label>
                  <input type="number" name="paginacao_padrao" className="form-control" defaultValue={configs?.paginacao_padrao || 20} min="5" max="100" />
                  <small className="text-muted">Itens por página nas listagens</small>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Modo Manutenção</label>
                  <select name="manutencao" className="form-control" defaultValue={configs?.manutencao || 0}>
                    <option value="0">Desativado</option>
                    <option value="1">Ativado</option>
                  </select>
                  <small className="text-danger">Apenas admins podem acessar quando ativado</small>
                </div>
              </div>
            </div>

            <div className="row" style={{ marginTop: '30px' }}>
              <div className="col-md-12">
                <hr />
                <button type="submit" className="btn btn-success">
                  <i className="lni lni-checkmark"></i> Salvar Configurações
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
