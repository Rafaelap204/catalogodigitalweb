import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Catálogo Digital Web - Sistema de Gestão",
  description: "Sistema de gestão para estabelecimentos",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Bootstrap CSS - Mantido para compatibilidade */}
        <link rel="stylesheet" href="/_core/_cdn/bootstrap/css/bootstrap.min.css" />
        
        {/* Panel CSS - Mantido para compatibilidade */}
        <link rel="stylesheet" href="/_core/_cdn/panel/css/class.css" />
        <link rel="stylesheet" href="/_core/_cdn/panel/css/forms.css" />
        <link rel="stylesheet" href="/_core/_cdn/panel/css/typography.css" />
        <link rel="stylesheet" href="/_core/_cdn/panel/css/template.css" />
        <link rel="stylesheet" href="/_core/_cdn/panel/css/theme.css" />
        <link rel="stylesheet" href="/_core/_cdn/panel/css/default.css" />
        
        {/* LineIcons */}
        <link rel="stylesheet" href="/_core/_cdn/lineicons/css/LineIcons.min.css" />
        
        {/* Fonts */}
        <link rel="stylesheet" href="/_core/_cdn/fonts/style.min.css" />
        <link rel="stylesheet" href="/_core/_cdn/fonts/logo/logofont.css" />
        
        {/* Favicon */}
        <link rel="shortcut icon" href="/_core/_cdn/img/favicon.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
        
        {/* Scripts legados */}
        <script src="/_core/_cdn/jquery/js/jquery.min.js" defer></script>
        <script src="/_core/_cdn/bootstrap/js/bootstrap.min.js" defer></script>
        <script src="/_core/_cdn/panel/js/template.js" defer></script>
      </body>
    </html>
  )
}
