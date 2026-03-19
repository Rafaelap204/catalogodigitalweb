import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  Store, 
  TrendingUp, 
  Zap, 
  Smartphone, 
  CreditCard, 
  BarChart3, 
  Headphones,
  Check
} from "lucide-react";

export default function ConhecaPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Venda pelo WhatsApp de forma profissional
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Crie seu catálogo digital em minutos e comece a receber pedidos hoje mesmo
            </p>
            <Link href="/comece/cadastrar">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8">
                Criar minha loja grátis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para vender mais
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ferramentas completas para gerenciar seus pedidos, produtos e clientes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Store className="w-8 h-8" />}
              title="Sua Loja Virtual"
              description="Tenha uma loja própria com subdomínio personalizado. Seucatalogo.catalogodigitalweb.com.br"
            />
            <FeatureCard
              icon={<ShoppingBag className="w-8 h-8" />}
              title="Catálogo Digital"
              description="Mostre seus produtos de forma organizada e profissional com fotos e descrições"
            />
            <FeatureCard
              icon={<Smartphone className="w-8 h-8" />}
              title="Pedidos via WhatsApp"
              description="Receba pedidos diretamente no seu WhatsApp com todos os detalhes automaticamente"
            />
            <FeatureCard
              icon={<CreditCard className="w-8 h-8" />}
              title="Múltiplas Formas de Pagamento"
              description="Aceite PIX, cartão via MercadoPago, PagSeguro e outras formas de pagamento"
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Relatórios e Analytics"
              description="Acompanhe suas vendas, produtos mais vendidos e evolução do seu negócio"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Entrega e Retirada"
              description="Configure delivery, retirada no local ou qualquer forma de entrega que precisar"
            />
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Como funciona
            </h2>
            <p className="text-xl text-gray-600">
              Comece a vender em 3 passos simples
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StepCard
              number="1"
              title="Crie sua conta"
              description="Cadastre-se gratuitamente e configure sua loja em poucos minutos"
            />
            <StepCard
              number="2"
              title="Cadastre seus produtos"
              description="Adicione fotos, descrições e preços dos seus produtos"
            />
            <StepCard
              number="3"
              title="Comece a vender"
              description="Compartilhe seu link e receba pedidos pelo WhatsApp"
            />
          </div>
        </div>
      </section>

      {/* Planos */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Planos e Preços
            </h2>
            <p className="text-xl text-gray-600">
              Escolha o plano ideal para o seu negócio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Plano Grátis */}
            <div className="border rounded-2xl p-8 hover:shadow-lg transition-shadow">
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
              </ul>
              <Link href="/comece/cadastrar">
                <Button variant="outline" className="w-full">
                  Começar grátis
                </Button>
              </Link>
            </div>

            {/* Plano Pro */}
            <div className="border-2 border-blue-600 rounded-2xl p-8 relative hover:shadow-lg transition-shadow">
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
                <PlanFeature text="Suporte prioritário" />
              </ul>
              <Link href="/comece/cadastrar">
                <Button className="w-full">
                  Escolher Pro
                </Button>
              </Link>
            </div>

            {/* Plano Premium */}
            <div className="border rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
              <p className="text-gray-600 mb-6">Para escalar</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                R$ 79<span className="text-lg font-normal text-gray-600">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <PlanFeature text="Tudo do Pro" />
                <PlanFeature text="Múltiplos usuários" />
                <PlanFeature text="API de integração" />
                <PlanFeature text="Suporte dedicado" />
                <PlanFeature text="Customizações" />
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

      {/* CTA Final */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para começar a vender mais?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Crie sua loja gratuita em menos de 5 minutos e comece a receber pedidos hoje mesmo.
          </p>
          <Link href="/comece/cadastrar">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8">
              Criar minha loja agora
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StepCard({ 
  number, 
  title, 
  description 
}: { 
  number: string; 
  title: string; 
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
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
