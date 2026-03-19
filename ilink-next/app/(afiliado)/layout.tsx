import { redirect } from "next/navigation";
import { getSession, removeSession } from "@/lib/session";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Users, DollarSign } from "lucide-react";

export default async function AfiliadoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verificar sessão customizada
  const session = await getSession();
  
  if (!session) {
    redirect("/login?redirect=/afiliado");
  }
  
  // Verificar nível do usuário (3 = Afiliado)
  // Nível 1 (admin) também pode acessar
  if (session.nivel !== 3 && session.nivel !== 1) {
    redirect("/login");
  }

  async function handleLogout() {
    'use server';
    await removeSession();
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Afiliado */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/afiliado/inicio" className="text-xl font-bold text-blue-600">
              Painel do Afiliado
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/afiliado/inicio" className="text-sm text-gray-600 hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/afiliado/estabelecimentos" className="text-sm text-gray-600 hover:text-blue-600">
                Estabelecimentos
              </Link>
              <Link href="/afiliado/comissoes" className="text-sm text-gray-600 hover:text-blue-600">
                Comissões
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{session.nome}</span>
            <form action={handleLogout}>
              <Button type="submit" variant="ghost" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </form>
          </div>
        </div>
      </header>
      
      {/* Conteúdo */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
