import './globals.css'

export const metadata = {
  title: 'iLinkBio - Plataforma de Delivery',
  description: 'Sua plataforma completa de delivery',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
