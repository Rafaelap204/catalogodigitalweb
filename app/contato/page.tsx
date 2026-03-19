import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContatoPage() {
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
              Entre em Contato
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Estamos aqui para ajudar. Envie sua mensagem e responderemos em breve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Formulário */}
            <Card>
              <CardContent className="p-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome</Label>
                      <Input id="nome" placeholder="Seu nome" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assunto">Assunto</Label>
                    <Input id="assunto" placeholder="Assunto da mensagem" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mensagem">Mensagem</Label>
                    <Textarea id="mensagem" rows={5} placeholder="Sua mensagem..." />
                  </div>
                  <Button type="submit" className="w-full">
                    Enviar mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Informações de contato */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Informações de Contato
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-600">contato@catalogodigitalweb.com.br</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-600">(11) 99999-9999</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-600">São Paulo, SP</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Horário de Atendimento
                </h3>
                <p className="text-gray-600">
                  Segunda a Sexta: 9h às 18h<br />
                  Sábado: 9h às 13h
                </p>
              </div>
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
