import Link from 'next/link';

export default function EsqueceuSenhaPage() {
  return (
    <div className="row" style={{ marginTop: '50px' }}>
      <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
        <div className="box box-white" style={{ padding: '30px' }}>
          <div className="text-center" style={{ marginBottom: '30px' }}>
            <img src="/logo.png" alt="Logo" style={{ maxHeight: '80px' }} />
            <h2 style={{ marginTop: '20px' }}>Recuperar Senha</h2>
            <p className="text-muted">Digite seu email para receber um link de recuperação</p>
          </div>
          
          <form action="/api/esqueceu-senha" method="POST">
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="email">Email</label>
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
              <button type="submit" className="btn btn-success btn-lg btn-block">
                <i className="lni lni-envelope"></i> Enviar Link de Recuperação
              </button>
            </div>
          </form>
          
          <div className="text-center" style={{ marginTop: '20px' }}>
            <Link href="/login" className="btn btn-link">
              <i className="lni lni-arrow-left"></i> Voltar para o Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
