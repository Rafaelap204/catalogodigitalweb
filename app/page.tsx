import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Store, TrendingUp, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
              Crie seu Catálogo Digital
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Venda pelo WhatsApp de forma profissional. 
              Simples, rápido e sem complicação.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/comece/cadastrar">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8">
                  Começar Grátis
                </Button>
              </Link>
              <Link href="/conheca">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8">
                  Saiba Mais
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Tudo que você precisa para vender mais
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Store className="w-8 h-8" />}
              title="Sua Loja Virtual"
              description="Tenha uma loja própria com seu subdomínio personalizado"
            />
            <FeatureCard
              icon={<ShoppingBag className="w-8 h-8" />}
              title="Catálogo Digital"
              description="Mostre seus produtos de forma organizada e profissional"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Pedidos via WhatsApp"
              description="Receba pedidos diretamente no seu WhatsApp automaticamente"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Cresça seu Negócio"
              description="Ferramentas para impulsionar suas vendas online"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Pronto para começar?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Crie sua conta gratuita em menos de 5 minutos e comece a vender pelo WhatsApp hoje mesmo.
          </p>
          <Link href="/comece/cadastrar">
            <Button size="lg" className="text-lg px-8">
              Criar Minha Loja
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Catálogo Digital Web</h3>
              <p className="text-sm">
                A plataforma mais simples para criar seu catálogo digital e vender pelo WhatsApp.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/conheca" className="hover:text-white transition-colors">Funcionalidades</Link></li>
                <li><Link href="/planos" className="hover:text-white transition-colors">Planos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/sobre" className="hover:text-white transition-colors">Sobre</Link></li>
                <li><Link href="/contato" className="hover:text-white transition-colors">Contato</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link></li>
                <li><Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            © {new Date().getFullYear()} Catálogo Digital Web. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
