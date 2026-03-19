import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { salvarEstabelecimento } from '@/lib/server/actions/estabelecimentos';

export default async function AdicionarEstabelecimentoPage() {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  async function handleSubmit(formData: FormData) {
    'use server';
    
    const result = await salvarEstabelecimento(formData);
    
    if (result.success) {
      redirect('/administracao/estabelecimentos?success=adicionado');
    } else {
      redirect(`/administracao/estabelecimentos/adicionar?error=${encodeURIComponent(result.error || 'Erro ao salvar')}`);
    }
  }

  return (
    <div className="row">
      <div className="col-md-12">
        {/* Header */}
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-md-8">
            <h2>
              <i className="lni lni-plus"></i> Adicionar Estabelecimento
              <small style={{ display: 'block', fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Cadastre um novo estabelecimento no sistema
              </small>
            </h2>
          </div>
          <div className="col-md-4 text-right">
            <Link 
              href="/administracao/estabelecimentos" 
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
                  <i className="lni lni-information"></i> Dados Básicos
                </h4>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Nome do Estabelecimento *</label>
                  <input 
                    type="text" 
                    name="nome" 
                    className="form-control"
                    placeholder="Ex: Restaurante do João"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Perfil / Slogan</label>
                  <input 
                    type="text" 
                    name="perfil" 
                    className="form-control"
                    placeholder="Ex: O melhor da região"
                  />
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
                    rows={4}
                    placeholder="Descrição do estabelecimento..."
                  />
                </div>
              </div>
            </div>

            {/* Subdomínio */}
            <div className="row">
              <div className="col-md-12">
                <h4 style={{ margin: '30px 0 20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <i className="lni lni-world"></i> Subdomínio
                </h4>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Subdomínio</label>
                  <div className="input-group">
                    <input 
                      type="text" 
                      name="subdominio" 
                      className="form-control"
                      placeholder="Ex: meuestabelecimento"
                    />
                    <span className="input-group-addon">.catalogodigitalweb.com.br</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="form-control"
                    placeholder="contato@exemplo.com"
                  />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="row">
              <div className="col-md-12">
                <h4 style={{ margin: '30px 0 20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <i className="lni lni-map-marker"></i> Endereço
                </h4>
              </div>
            </div>

            <div className="row">
              <div className="col-md-8">
                <div className="form-field">
                  <label>Endereço</label>
                  <input 
                    type="text" 
                    name="endereco" 
                    className="form-control"
                    placeholder="Rua, Avenida, etc."
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-field">
                  <label>Número</label>
                  <input 
                    type="text" 
                    name="numero" 
                    className="form-control"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <div className="form-field">
                  <label>Complemento</label>
                  <input 
                    type="text" 
                    name="complemento" 
                    className="form-control"
                    placeholder="Sala, Apto, etc."
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-field">
                  <label>Bairro</label>
                  <input 
                    type="text" 
                    name="bairro" 
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-field">
                  <label>CEP</label>
                  <input 
                    type="text" 
                    name="cep" 
                    className="form-control"
                    placeholder="00000-000"
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Cidade</label>
                  <input 
                    type="text" 
                    name="cidade" 
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Estado</label>
                  <select name="estado" className="form-control">
                    <option value="">Selecione...</option>
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option>
                    <option value="SE">Sergipe</option>
                    <option value="TO">Tocantins</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contato */}
            <div className="row">
              <div className="col-md-12">
                <h4 style={{ margin: '30px 0 20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <i className="lni lni-phone"></i> Contato
                </h4>
              </div>
            </div>

            <div className="row">
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

            {/* Configurações */}
            <div className="row">
              <div className="col-md-12">
                <h4 style={{ margin: '30px 0 20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <i className="lni lni-palette"></i> Configurações
                </h4>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-field">
                  <label>Cor Primária</label>
                  <input 
                    type="color" 
                    name="cor_primaria" 
                    className="form-control"
                    defaultValue="#007bff"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-field">
                  <label>Cor Secundária</label>
                  <input 
                    type="color" 
                    name="cor_secundaria" 
                    className="form-control"
                    defaultValue="#6c757d"
                  />
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="row" style={{ marginTop: '30px' }}>
              <div className="col-md-12">
                <hr />
                <button type="submit" className="btn btn-success">
                  <i className="lni lni-checkmark"></i> Salvar Estabelecimento
                </button>
                <Link href="/administracao/estabelecimentos" className="btn btn-default" style={{ marginLeft: '10px' }}>
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
