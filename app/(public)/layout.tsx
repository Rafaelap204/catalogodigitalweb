import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header simples */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Catálogo Digital Web
          </Link>
        </div>
      </header>
      
      {/* Conteúdo */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer simples */}
      <footer className="border-t bg-gray-50 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Catálogo Digital Web. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
