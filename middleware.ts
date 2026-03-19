/**
 * Middleware de autenticação
 * Protege rotas baseado na sessão do usuário
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas que requerem autenticação
const PROTECTED_ROUTES = {
  '/administracao': 1,  // Nível 1: Administrador
  '/painel': 2,         // Nível 2: Usuário
  '/afiliado': 3,       // Nível 3: Afiliado
};

// Rotas públicas (não precisam de autenticação)
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/esqueci',
  '/novasenha',
  '/comece',
  '/conheca',
  '/planos',
  '/sobre',
  '/contato',
  '/termos',
  '/privacidade',
  '/cadastrar',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verifica se é uma rota pública
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Verifica se é uma rota protegida
  const protectedRoute = Object.entries(PROTECTED_ROUTES).find(([route]) =>
    pathname.startsWith(route)
  );
  
  if (!protectedRoute) {
    // Se não for rota protegida, permite acesso
    return NextResponse.next();
  }
  
  // Verifica se existe sessão
  const sessionCookie = request.cookies.get('ilink_session');
  
  if (!sessionCookie?.value) {
    // Redireciona para login se não estiver autenticado
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  try {
    // Decodifica a sessão
    const sessionData = Buffer.from(sessionCookie.value, 'base64').toString('utf-8');
    const session = JSON.parse(sessionData);
    
    const [route, requiredNivel] = protectedRoute;
    
    // Verifica se o nível do usuário permite acesso
    if (session.nivel > requiredNivel) {
      // Redireciona para o painel correto baseado no nível
      let redirectUrl = '/login';
      switch (session.nivel) {
        case 1:
          redirectUrl = '/administracao/inicio';
          break;
        case 2:
          redirectUrl = '/painel/inicio';
          break;
        case 3:
          redirectUrl = '/afiliado/inicio';
          break;
      }
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    
    // Usuário tem permissão, permite acesso
    return NextResponse.next();
  } catch {
    // Sessão inválida, redireciona para login
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    // Ignora arquivos estáticos
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
