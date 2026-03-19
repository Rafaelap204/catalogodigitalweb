import Link from "next/link";

export default function TermosPage() {
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
            Termos de Uso
          </h1>
          
          <div className="prose prose-lg text-gray-600">
            <p className="mb-6">
              Ao utilizar o Catálogo Digital Web, você concorda com estes termos de uso.
              Leia atentamente antes de utilizar nossos serviços.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              1. Aceitação dos Termos
            </h2>
            <p className="mb-4">
              Ao acessar e usar o Catálogo Digital Web, você aceita e concorda em ficar
              vinculado aos termos e condições deste acordo.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              2. Descrição do Serviço
            </h2>
            <p className="mb-4">
              O Catálogo Digital Web é uma plataforma que permite criar catálogos digitais
              e receber pedidos via WhatsApp. Reservamo-nos o direito de
              modificar ou descontinuar o serviço a qualquer momento.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              3. Conta do Usuário
            </h2>
            <p className="mb-4">
              Você é responsável por manter a confidencialidade de sua conta 
              e senha. Você concorda em aceitar responsabilidade por todas 
              as atividades que ocorrem em sua conta.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              4. Conduta do Usuário
            </h2>
            <p className="mb-4">
              Você concorda em não usar o serviço para qualquer propósito 
              ilegal ou proibido por estes termos.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              5. Limitação de Responsabilidade
            </h2>
            <p className="mb-4">
              O Catálogo Digital Web não será responsável por quaisquer danos diretos,
              indiretos, incidentais ou consequenciais resultantes do uso
              ou incapacidade de usar o serviço.
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
