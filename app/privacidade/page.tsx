import Link from "next/link";

export default function PrivacidadePage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Política de Privacidade
          </h1>
          
          <div className="prose prose-lg text-gray-600">
            <p className="mb-6">
              Sua privacidade é importante para nós. Esta política descreve 
              como coletamos, usamos e protegemos suas informações.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              1. Informações Coletadas
            </h2>
            <p className="mb-4">
              Coletamos informações que você nos fornece diretamente, como 
              nome, e-mail, telefone e informações do seu estabelecimento.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              2. Uso das Informações
            </h2>
            <p className="mb-4">
              Utilizamos suas informações para fornecer e melhorar nossos 
              serviços, processar pedidos e comunicar-nos com você.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              3. Proteção de Dados
            </h2>
            <p className="mb-4">
              Implementamos medidas de segurança para proteger suas informações 
              contra acesso não autorizado, alteração ou destruição.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              4. Compartilhamento de Informações
            </h2>
            <p className="mb-4">
              Não vendemos ou compartilhamos suas informações pessoais com 
              terceiros, exceto quando necessário para fornecer nossos serviços 
              ou quando exigido por lei.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              5. Seus Direitos
            </h2>
            <p className="mb-4">
              Você tem o direito de acessar, corrigir ou excluir suas 
              informações pessoais. Entre em contato conosco para exercer 
              esses direitos.
            </p>
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
