import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function PlanosPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Catálogo Digital Web
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Planos e Preços
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Escolha o plano ideal para o seu negócio. Comece grátis e evolua conforme cresce.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Plano Grátis */}
            <div className="bg-white border rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Grátis</h3>
              <p className="text-gray-600 mb-6">Para começar</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                R$ 0<span className="text-lg font-normal text-gray-600">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <PlanFeature text="Até 20 produtos" />
                <PlanFeature text="Subdomínio personalizado" />
                <PlanFeature text="Pedidos via WhatsApp" />
                <PlanFeature text="Relatórios básicos" />
                <PlanFeature text="Suporte por e-mail" />
              </ul>
              <Link href="/comece/cadastrar">
                <Button variant="outline" className="w-full">
                  Começar grátis
                </Button>
              </Link>
            </div>

            {/* Plano Pro */}
            <div className="bg-white border-2 border-blue-600 rounded-2xl p-8 relative hover:shadow-lg transition-shadow">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Mais popular
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <p className="text-gray-600 mb-6">Para crescer</p>
              <div className="text-4xl font-bold text-blue-600 mb-6">
                R$ 29<span className="text-lg font-normal text-gray-600">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <PlanFeature text="Produtos ilimitados" />
                <PlanFeature text="Todas as funcionalidades" />
                <PlanFeature text="Banners promocionais" />
                <PlanFeature text="Cupons de desconto" />
                <PlanFeature text="Relatórios avançados" />
                <PlanFeature text="Suporte prioritário" />
              </ul>
              <Link href="/comece/cadastrar">
                <Button className="w-full">
                  Escolher Pro
                </Button>
              </Link>
            </div>

            {/* Plano Premium */}
            <div className="bg-white border rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
              <p className="text-gray-600 mb-6">Para escalar</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                R$ 79<span className="text-lg font-normal text-gray-600">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <PlanFeature text="Tudo do Pro" />
                <PlanFeature text="Múltiplos usuários" />
                <PlanFeature text="API de integração" />
                <PlanFeature text="Customizações" />
                <PlanFeature text="Suporte dedicado" />
                <PlanFeature text="Treinamento incluso" />
              </ul>
              <Link href="/comece/cadastrar">
                <Button variant="outline" className="w-full">
                  Fale conosco
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Catálogo Digital Web. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}

function PlanFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2 text-gray-600">
      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
      <span>{text}</span>
    </li>
  );
}
