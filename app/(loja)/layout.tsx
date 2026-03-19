import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'iLink - Sua Loja Online',
  description: 'Sistema de delivery e pedidos online',
};

export default function LojaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link 
        rel="stylesheet" 
        href="https://fonts.googleapis.com/css?family=Google+Sans:100,300,400,500,700,900|Roboto:300,400,500,700,900&display=swap" 
      />
      <link 
        rel="stylesheet" 
        href="/_core/_cdn/lineicons/css/lineicons.css" 
        type="text/css" 
      />
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}
