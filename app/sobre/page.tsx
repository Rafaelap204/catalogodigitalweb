import Link from "next/link";

export default function SobrePage() {
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Sobre o Catálogo Digital Web
          </h1>
          
          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="mb-6">
              O Catálogo Digital Web é uma plataforma completa para criar catálogos digitais e
              vender pelo WhatsApp. Nascemos com a missão de ajudar pequenos e médios
              empreendedores a digitalizarem seus negócios de forma simples e acessível.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Nossa Missão
            </h2>
            <p className="mb-6">
              Democratizar o acesso à tecnologia para pequenos negócios, permitindo 
              que qualquer pessoa possa criar sua loja virtual e vender online sem 
              necessidade de conhecimentos técnicos.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Nossa Visão
            </h2>
            <p className="mb-6">
              Ser a plataforma líder em catálogos digitais no Brasil, ajudando 
              milhares de empreendedores a alcançarem mais clientes e aumentarem 
              suas vendas.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Nossos Valores
            </h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Simplicidade em tudo que fazemos</li>
              <li>Acessibilidade para todos</li>
              <li>Excelência no atendimento</li>
              <li>Inovação constante</li>
              <li>Compromisso com o sucesso dos nossos clientes</li>
            </ul>
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
