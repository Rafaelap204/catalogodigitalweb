"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle, AlertCircle, Store, User, Phone, Lock } from "lucide-react";

export default function CadastrarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  // Dados do formulário
  const [formData, setFormData] = useState({
    // Dados do usuário
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    telefone: "",
    
    // Dados do estabelecimento
    nomeLoja: "",
    subdominio: "",
    descricao: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    whatsapp: "",
  });

  const [subdominioDisponivel, setSubdominioDisponivel] = useState<boolean | null>(null);
  const [verificandoSubdominio, setVerificandoSubdominio] = useState(false);

  const supabase = createClient();

  // Verificar disponibilidade do subdomínio
  async function verificarSubdominio(subdominio: string) {
    if (!subdominio || subdominio.length < 3) {
      setSubdominioDisponivel(null);
      return;
    }

    setVerificandoSubdominio(true);
    
    const { data, error } = await supabase
      .from("estabelecimentos")
      .select("id")
      .eq("subdominio", subdominio.toLowerCase())
      .single();

    setSubdominioDisponivel(!data);
    setVerificandoSubdominio(false);
  }

  // Formatadores
  function formatarSubdominio(valor: string) {
    return valor
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }

  function formatarTelefone(valor: string) {
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length <= 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validações
    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (formData.senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    if (subdominioDisponivel === false) {
      setError("Este subdomínio já está em uso");
      setLoading(false);
      return;
    }

    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error("Erro ao criar usuário");
      }

      // 2. Inserir na tabela users
      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert({
          email: formData.email,
          nome: formData.nome,
          nivel: "2", // Estabelecimento
        } as any)
        .select()
        .single();

      if (userError) {
        throw new Error("Erro ao salvar dados do usuário");
      }

      // 3. Inserir na tabela estabelecimentos
      const { error: estabError } = await supabase
        .from("estabelecimentos")
        .insert({
          nome: formData.nomeLoja,
          subdominio: formData.subdominio.toLowerCase(),
          rel_users_id: (userData as any).id,
          descricao: formData.descricao,
          endereco: formData.endereco,
          numero: formData.numero,
          bairro: formData.bairro,
          whatsapp: formData.whatsapp,
          telefone: formData.telefone,
          email: formData.email,
          status: 1,
        } as any);

      if (estabError) {
        throw new Error("Erro ao criar estabelecimento");
      }

      setSuccess(true);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (err: any) {
      setError(err.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Conta criada com sucesso!
            </h2>
            <p className="text-gray-600">
              Sua loja foi criada. Você será redirecionado para o login.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Crie sua loja gratuita
          </h1>
          <p className="text-gray-600 mt-2">
            Comece a vender pelo WhatsApp em poucos minutos
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Dados do Usuário */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Dados do Responsável
                </CardTitle>
                <CardDescription>
                  Informações de acesso à plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: formatarTelefone(e.target.value) })}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senha">Senha *</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar senha *</Label>
                  <Input
                    id="confirmarSenha"
                    type="password"
                    value={formData.confirmarSenha}
                    onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Dados da Loja */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  Dados da Loja
                </CardTitle>
                <CardDescription>
                  Informações do seu estabelecimento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeLoja">Nome da loja *</Label>
                  <Input
                    id="nomeLoja"
                    value={formData.nomeLoja}
                    onChange={(e) => setFormData({ ...formData, nomeLoja: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subdominio">
                    Subdomínio *
                    <span className="text-sm text-gray-500 ml-1">
                      (sualoja.catalogodigitalweb.com.br)
                    </span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="subdominio"
                      value={formData.subdominio}
                      onChange={(e) => {
                        const valor = formatarSubdominio(e.target.value);
                        setFormData({ ...formData, subdominio: valor });
                        verificarSubdominio(valor);
                      }}
                      required
                      className={subdominioDisponivel === true ? "border-green-500" : subdominioDisponivel === false ? "border-red-500" : ""}
                    />
                    {verificandoSubdominio && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                    )}
                    {subdominioDisponivel === true && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                    )}
                  </div>
                  {subdominioDisponivel === false && (
                    <p className="text-sm text-red-500">Este subdomínio já está em uso</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp para pedidos *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: formatarTelefone(e.target.value) })}
                      placeholder="(00) 00000-0000"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numero">Número</Label>
                    <Input
                      id="numero"
                      value={formData.numero}
                      onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input
                      id="bairro"
                      value={formData.bairro}
                      onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full md:w-auto px-12"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar minha loja grátis"
              )}
            </Button>
            <p className="mt-4 text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
