import Link from 'next/link';

export default function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="row" style={{ marginTop: '50px' }}>
      <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
        <div className="box box-white" style={{ padding: '30px' }}>
          <div className="text-center" style={{ marginBottom: '30px' }}>
            <img src="/logo.png" alt="Logo" style={{ maxHeight: '80px' }} />
            <h2 style={{ marginTop: '20px' }}>Criar Conta</h2>
            <p className="text-muted">Cadastre-se gratuito e comece a vender!</p>
          </div>
          
          <form action="/api/cadastro" method="POST">
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="nome">Nome Completo *</label>
              <input 
                type="text" 
                id="nome" 
                name="nome" 
                className="form-control input-lg" 
                placeholder="Seu nome completo"
                required 
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="email">Email *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className="form-control input-lg" 
                placeholder="seu@email.com"
                required 
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="senha">Senha *</label>
              <input 
                type="password" 
                id="senha" 
                name="senha" 
                className="form-control input-lg" 
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required 
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="telefone">Telefone</label>
              <input 
                type="tel" 
                id="telefone" 
                name="telefone" 
                className="form-control input-lg" 
                placeholder="(00) 00000-0000"
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="whatsapp">WhatsApp</label>
              <input 
                type="tel" 
                id="whatsapp" 
                name="whatsapp" 
                className="form-control input-lg" 
                placeholder="(00) 00000-0000"
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <div className="checkbox">
                <label>
                  <input type="checkbox" name="termos" required /> 
                  Li e aceito os <a href="/termos" target="_blank">Termos de Uso</a> e <a href="/privacidade" target="_blank">Política de Privacidade</a>
                </label>
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <button type="submit" className="btn btn-success btn-lg btn-block">
                <i className="lni lni-checkmark"></i> Criar Conta Grátis
              </button>
            </div>
          </form>
          
          <div className="text-center" style={{ marginTop: '20px' }}>
            <p>Já tem uma conta? <Link href="/login" className="btn btn-link">Faça login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
