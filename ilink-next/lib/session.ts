/**
 * Gerenciamento de sessão customizada
 * Usa cookies do Next.js para manter a sessão do usuário
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface UserSession {
  id: string;
  email: string;
  nome: string;
  nivel: number;
  avatar?: string;
  estabelecimento_id?: string;
  afiliado_id?: string;
}

const SESSION_COOKIE_NAME = 'ilink_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 dias

/**
 * Cria uma nova sessão para o usuário
 */
export async function createSession(user: UserSession): Promise<void> {
  const cookieStore = await cookies();
  
  // Codifica os dados do usuário em base64
  const sessionData = Buffer.from(JSON.stringify(user)).toString('base64');
  
  cookieStore.set(SESSION_COOKIE_NAME, sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

/**
 * Obtém a sessão atual do usuário
 */
export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  
  if (!sessionCookie?.value) {
    return null;
  }
  
  try {
    const sessionData = Buffer.from(sessionCookie.value, 'base64').toString('utf-8');
    return JSON.parse(sessionData) as UserSession;
  } catch {
    return null;
  }
}

/**
 * Remove a sessão do usuário (logout)
 */
export async function removeSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Verifica se o usuário está autenticado
 * Se não estiver, redireciona para o login
 */
export async function requireAuth(minNivel?: number): Promise<UserSession> {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  if (minNivel !== undefined && session.nivel > minNivel) {
    redirect('/login?error=unauthorized');
  }
  
  return session;
}

/**
 * Verifica se o usuário está autenticado (sem redirecionar)
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

/**
 * Obtém o nível do usuário logado
 */
export async function getUserNivel(): Promise<number | null> {
  const session = await getSession();
  return session?.nivel ?? null;
}

/**
 * Redireciona baseado no nível do usuário
 */
export function redirectByNivel(nivel: number): never {
  switch (nivel) {
    case 1:
      redirect('/administracao/inicio');
    case 2:
      redirect('/painel/inicio');
    case 3:
      redirect('/afiliado/inicio');
    default:
      redirect('/login');
  }
}
