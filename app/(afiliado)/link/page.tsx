import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function LinkPage() {
  const session = await getSession();
  
  if (!session || session.nivel !== 3) {
    redirect('/login');
  }

  const afiliadoId = session.afiliado_id || session.id;
  
  // Gera o link de indicação
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://catalogodigitalweb.com.br';
  const linkReferencia = `${baseUrl}/cadastro?ref=${afiliadoId}`;

  return (
    <div className="row">
      <div className="col-md-8">
        <div className="box box-white">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <h2><i className="lni lni-share"></i> Meu Link de Indicação</h2>
          </div>
          
          <div className="alert alert-success">
            <i className="lni lni-checkmark-circle"></i> Compartilhe seu link e ganhe comissões sobre as assinaturas dos seus indicados!
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label>Seu Link de Indicação:</label>
            <div className="input-group">
              <input type="text" id="linkRef" className="form-control" value={linkReferencia} readOnly />
              <span className="input-group-btn">
                <button className="btn btn-success" type="button" onClick={() => {}}>
                  <i className="lni lni-clipboard"></i> Copiar
                </button>
              </span>
            </div>
          </div>

          <hr />

          <h4><i className="lni lni-share"></i> Compartilhar nas Redes</h4>
          <div className="row" style={{ marginTop: '15px' }}>
            <div className="col-sm-4">
              <a href={`https://wa.me/?text=${encodeURIComponent('Cadastre-se no Catálogo Digital Web e tenha seu delivery próprio! ' + linkReferencia)}`} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-block" style={{ backgroundColor: '#25D366' }}>
                <i className="lni lni-whatsapp"></i> WhatsApp
              </a>
            </div>
            <div className="col-sm-4">
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(linkReferencia)}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-block" style={{ backgroundColor: '#3B5998' }}>
                <i className="lni lni-facebook"></i> Facebook
              </a>
            </div>
            <div className="col-sm-4">
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(linkReferencia)}&text=${encodeURIComponent('Cadastre-se no Catálogo Digital Web!')}`} target="_blank" rel="noopener noreferrer" className="btn btn-info btn-block" style={{ backgroundColor: '#1DA1F2' }}>
                <i className="lni lni-twitter"></i> Twitter
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="box box-white" style={{ background: '#f9f9f9' }}>
          <h4><i className="lni lni-information"></i> Como funciona?</h4>
          <hr />
          <ol style={{ paddingLeft: '20px' }}>
            <li style={{ marginBottom: '10px' }}><strong>Cadastro:</strong> Indique pessoas usando seu link único.</li>
            <li style={{ marginBottom: '10px' }}><strong>Assinatura:</strong> Quando seu indicado se tornar assinante pago, você ganha comissão.</li>
            <li style={{ marginBottom: '10px' }}><strong>Pagamento:</strong> Sua comissão será creditada em sua conta e disponibilizada para saque.</li>
          </ol>
          <hr />
          <p className="text-muted">* A comissão é paga mensalmente enquanto seu indicado for assinante.</p>
        </div>
      </div>
    </div>
  );
}
