'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { login } from '@/lib/server/actions/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '';
  const msg = searchParams.get('msg') || '';
  const emailParam = searchParams.get('email') || '';
  
  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password);

      if (!result.success) {
        router.push(`/login?msg=erro&email=${email}&redirect=${redirect}`);
        return;
      }

      if (result.redirectUrl) {
        router.push(result.redirectUrl);
      }

      router.refresh();
    } catch (error) {
      router.push(`/login?msg=erro&email=${email}&redirect=${redirect}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray fullfit">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="login">
              <form onSubmit={handleSubmit}>
                <div className="container">
                  <div className="row align-center">
                    {/* Login Box */}
                    <div className="login-box box-white">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="brand brand-login text-center">
                            <img src="/logo.png" alt="Catálogo Digital Web" />
                          </div>
                        </div>
                      </div>

                      {msg === 'erro' && (
                        <div className="row">
                          <div className="col-md-12">
                            <div className="msg msg-error bg-gray mt-10">
                              <i className="lni lni-close"></i>
                              <span>Dados incorretos, tente novamente!</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {msg === 'alterada' && (
                        <div className="row">
                          <div className="col-md-12">
                            <div className="msg msg-done bg-gray mt-10">
                              <i className="lni lni-checkmark"></i>
                              <span>Senha alterada com sucesso, faça login para continuar!</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-field form-field-icon form-field-text">
                            <i className="form-icon lni lni-user"></i>
                            <input
                              type="text"
                              name="email"
                              placeholder="E-mail"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-field form-field-icon form-field-password">
                            <i className="form-icon lni lni-lock"></i>
                            <input
                              type="password"
                              name="pass"
                              placeholder="Senha"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-8">
                          <div className="form-field form-field-icon form-field-checkbox">
                            <input type="checkbox" name="keepalive" value="1" defaultChecked />
                            <span>Mantenha-me conectado</span>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="form-field form-field-icon form-field-submit">
                            <button type="submit" disabled={loading}>
                              <span>{loading ? 'Entrando...' : 'Entrar'}</span>
                              <i className="lni lni-chevron-right"></i>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-12">
                          <div className="forgetpass">
                            <a href="/comece/cadastrar" className="text-center">
                              <i className="lni lni-license"></i> Cadastrar-se
                            </a>
                            <a href="/" className="text-center">
                              <i className="icone icone-sacola"></i> Voltar
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* / Login Box */}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Página com Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="bg-gray fullfit"><div className="container"><div className="row"><div className="col-md-12" style={{textAlign: 'center', padding: '50px'}}>Carregando...</div></div></div></div>}>
      <LoginForm />
    </Suspense>
  );
}
