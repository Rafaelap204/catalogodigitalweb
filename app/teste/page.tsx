'use client';

import { useState } from 'react';
import { testConnection, login } from '@/lib/server/actions/auth';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TestePage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('contato@catalogodigitalweb.com.br');
  const [senha, setSenha] = useState('');

  async function testarConexao() {
    setLoading(true);
    try {
      const res = await testConnection();
      setResult('Teste de conexão:\n' + JSON.stringify(res, null, 2));
    } catch (error: any) {
      setResult('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function testarBuscaUsuario() {
    setLoading(true);
    try {
      const supabase = createClient();
      console.log('Buscando usuário:', email);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single();
      
      console.log('Resultado:', { data, error });
      
      if (error) {
        setResult('Erro na busca:\n' + JSON.stringify(error, null, 2));
      } else if (data) {
        const user = data as any;
        setResult('Usuário encontrado:\n' + JSON.stringify({
          id: user.id,
          email: user.email,
          nome: user.nome,
          level: user.level,
          status: user.status,
          tem_password: !!user.password,
        }, null, 2));
      } else {
        setResult('Usuário não encontrado');
      }
    } catch (error: any) {
      setResult('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function testarLogin() {
    setLoading(true);
    try {
      const res = await login(email, senha);
      setResult('Resultado do login:\n' + JSON.stringify(res, null, 2));
    } catch (error: any) {
      setResult('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full space-y-4">
        <h1 className="text-2xl font-bold mb-4">Teste de Login</h1>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Email:</label>
          <Input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplo.com"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Senha:</label>
          <Input 
            type="password"
            value={senha} 
            onChange={(e) => setSenha(e.target.value)}
            placeholder="senha"
          />
        </div>
        
        <div className="space-y-2">
          <Button onClick={testarConexao} disabled={loading} className="w-full" variant="outline">
            {loading ? 'Testando...' : '1. Testar Conexão'}
          </Button>
          
          <Button onClick={testarBuscaUsuario} disabled={loading} className="w-full" variant="outline">
            {loading ? 'Buscando...' : '2. Buscar Usuário'}
          </Button>
          
          <Button onClick={testarLogin} disabled={loading} className="w-full">
            {loading ? 'Testando...' : '3. Testar Login Completo'}
          </Button>
        </div>
        
        {result && (
          <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto max-h-96">
            {result}
          </pre>
        )}
      </div>
    </div>
  );
}
