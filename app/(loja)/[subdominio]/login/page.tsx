'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  User,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const subdominio = params.subdominio as string;
  const redirect = searchParams.get('redirect') || `/${subdominio}`;
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.senha) {
      toast.error('Preencha todos os campos');
      return;
    }

    setLoading(true);
    
    // Simular login - em produção, integrar com API de autenticação
    setTimeout(() => {
      toast.success('Login realizado com sucesso!');
      router.push(redirect);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Voltar */}
        <Link 
          href={`/${subdominio}`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para a loja
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Entrar</CardTitle>
            <CardDescription>
              Faça login para acessar sua conta
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Input
                    id="senha"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    placeholder="Sua senha"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 rounded" />
                  Lembrar-me
                </label>
                <Link 
                  href={`/${subdominio}/recuperar-senha`}
                  className="text-blue-600 hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Ainda não tem conta?{' '}
                <Link 
                  href={`/${subdominio}/cadastro`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
