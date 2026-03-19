/**
 * Server Actions para autenticação customizada
 * Usa Supabase para conectar ao banco, mas valida na tabela public.users
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { createSession, removeSession } from '@/lib/session';
import crypto from 'crypto';

export interface LoginResult {
  success: boolean;
  error?: string;
  redirectUrl?: string;
}

export interface User {
  id: string | number;
  email: string;
  nome: string;
  password: string;
  level: number;
  status: number | boolean;
  estabelecimento_id?: string;
  afiliado_id?: string;
}

/**
 * Gera hash MD5 (compatível com o sistema PHP legado)
 */
function md5(text: string): string {
  return crypto.createHash('md5').update(text).digest('hex');
}

/**
 * Realiza login consultando a tabela public.users
 */
export async function login(email: string, senha: string): Promise<LoginResult> {
  try {
    console.log('Tentando login para:', email);
    
    const supabase = await createClient();
    
    // Busca usuário pelo email (sem estabelecimento_id que não existe na tabela)
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, nome, password, level, status')
      .eq('email', email.toLowerCase().trim())
      .single() as { data: User | null; error: any };
    
    // Se for estabelecimento (level 2), busca o estabelecimento relacionado
    let estabelecimentoId = null;
    if (user && parseInt(String(user.level), 10) === 2) {
      const { data: estabelecimento } = await (supabase
        .from('estabelecimentos') as any)
        .select('id')
        .eq('rel_users_id', user.id)
        .single();
      if (estabelecimento) {
        estabelecimentoId = estabelecimento.id;
      }
    }
    
    // Se for afiliado (level 3), busca o afiliado relacionado
    let afiliadoId = null;
    if (user && parseInt(String(user.level), 10) === 3) {
      const { data: afiliado } = await (supabase
        .from('afiliados') as any)
        .select('id')
        .eq('rel_users_id', user.id)
        .single();
      if (afiliado) {
        afiliadoId = afiliado.id;
      }
    }
    
    console.log('Resultado da query:', { user: user ? 'encontrado' : 'não encontrado', error });
    
    if (error) {
      console.error('Erro na consulta:', error);
      return { success: false, error: 'Erro ao consultar usuário: ' + error.message };
    }
    
    if (!user) {
      console.log('Usuário não encontrado');
      return { success: false, error: 'Email ou senha incorretos' };
    }
    
    // Converte level para número (vem como string do banco)
    const userLevel = parseInt(String(user.level), 10);
    console.log('Usuário encontrado:', { email: user.email, level: userLevel, status: user.status });
    
    // Verifica se o usuário está ativo
    if (user.status === 0 || user.status === false) {
      return { success: false, error: 'Conta desativada. Entre em contato com o suporte.' };
    }
    
    // Valida a senha (hash MD5)
    const senhaHash = md5(senha);
    console.log('Hash MD5 calculado:', senhaHash);
    console.log('Hash no banco:', user.password);
    console.log('Senha digitada (length):', senha.length);
    console.log('Senha digitada:', JSON.stringify(senha));
    console.log('Senhas coincidem:', user.password === senhaHash);
    
    // Comparação case-insensitive e trim
    const passwordFromDb = String(user.password).toLowerCase().trim();
    const passwordCalculated = senhaHash.toLowerCase().trim();
    console.log('Comparação normalizada:', passwordFromDb === passwordCalculated);
    
    if (passwordFromDb !== passwordCalculated) {
      return { success: false, error: 'Email ou senha incorretos' };
    }
    
    // Cria a sessão
    await createSession({
      id: user.id.toString(),
      email: user.email,
      nome: user.nome,
      nivel: userLevel, // mapeia level para nivel na sessão
      estabelecimento_id: estabelecimentoId || undefined,
      afiliado_id: afiliadoId || undefined,
    });
    
    console.log('Sessão criada com sucesso');
    
    // Retorna URL de redirecionamento baseado no level
    let redirectUrl = '/login';
    switch (userLevel) {
      case 1:
        redirectUrl = '/administracao/inicio';
        break;
      case 2:
        redirectUrl = '/painel/inicio';
        break;
      case 3:
        redirectUrl = '/afiliado/inicio';
        break;
      default:
        redirectUrl = '/painel/inicio';
    }
    
    console.log('Redirecionando para:', redirectUrl);
    return { success: true, redirectUrl };
  } catch (error: any) {
    console.error('Erro no login:', error);
    return { success: false, error: 'Erro ao realizar login: ' + error.message };
  }
}

/**
 * Realiza logout
 */
export async function logout(): Promise<void> {
  await removeSession();
}

/**
 * Verifica se o email existe
 */
export async function checkEmail(email: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single() as { data: { id: string | number } | null; error: any };
    
    return !error && data !== null;
  } catch {
    return false;
  }
}

/**
 * Testa a conexão com o banco
 */
export async function testConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    
    // Tenta fazer uma query simples
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      return { success: false, message: 'Erro na conexão: ' + error.message };
    }
    
    return { success: true, message: 'Conexão OK' };
  } catch (error: any) {
    return { success: false, message: 'Erro: ' + error.message };
  }
}

/**
 * Solicita recuperação de senha
 */
export async function requestPasswordReset(email: string): Promise<LoginResult> {
  try {
    const supabase = await createClient();
    
    // Verifica se o email existe
    const { data: user, error } = await supabase
      .from('users')
      .select('id, nome')
      .eq('email', email.toLowerCase().trim())
      .single() as { data: { id: string | number; nome: string } | null; error: any };
    
    if (error || !user) {
      // Retorna sucesso mesmo se não existir (segurança)
      return { success: true };
    }
    
    // Gera token de recuperação
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token válido por 1 hora
    
    // Salva token no banco (tabela password_resets precisa existir)
    try {
      await supabase
        .from('password_resets')
        .insert({
          user_id: user.id,
          token: token,
          expires_at: expiresAt.toISOString(),
          used: false,
        } as any);
    } catch (e) {
      // Se a tabela não existir, apenas loga
      console.log('Tabela password_resets pode não existir');
    }
    
    // TODO: Enviar email com link de recuperação
    // Por enquanto apenas retorna sucesso
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao solicitar recuperação:', error);
    return { success: false, error: 'Erro ao processar solicitação' };
  }
}

/**
 * Redefine a senha
 */
export async function resetPassword(token: string, newPassword: string): Promise<LoginResult> {
  try {
    const supabase = await createClient();
    
    // Busca token válido
    const { data: resetData, error } = await supabase
      .from('password_resets')
      .select('user_id, expires_at, used')
      .eq('token', token)
      .eq('used', false)
      .single() as { data: { user_id: string | number; expires_at: string; used: boolean } | null; error: any };
    
    if (error || !resetData) {
      return { success: false, error: 'Token inválido ou expirado' };
    }
    
    // Verifica se expirou
    if (new Date(resetData.expires_at) < new Date()) {
      return { success: false, error: 'Token expirado. Solicite uma nova recuperação.' };
    }
    
    // Atualiza senha
    const senhaHash = md5(newPassword);
    
    await (supabase
      .from('users') as any)
      .update({ password: senhaHash })
      .eq('id', resetData.user_id);
    
    // Marca token como usado
    await (supabase
      .from('password_resets') as any)
      .update({ used: true })
      .eq('token', token);
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return { success: false, error: 'Erro ao redefinir senha' };
  }
}

/**
 * Registra novo usuário
 */
export async function register(userData: {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  whatsapp?: string;
}): Promise<LoginResult> {
  try {
    const supabase = await createClient();
    
    // Verifica se email já existe
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', userData.email.toLowerCase().trim())
      .single() as { data: { id: string | number } | null; error: any };
    
    if (existing) {
      return { success: false, error: 'Este email já está cadastrado' };
    }
    
    // Cria hash da senha
    const senhaHash = md5(userData.senha);
    
    // Insere novo usuário
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        nome: userData.nome,
        email: userData.email.toLowerCase().trim(),
        password: senhaHash,
        telefone: userData.telefone,
        whatsapp: userData.whatsapp,
        level: 2, // Usuário comum
        status: 1,
        data_cadastro: new Date().toISOString(),
      } as any)
      .select('id, email, nome, level')
      .single() as { data: User | null; error: any };
    
    if (error || !newUser) {
      console.error('Erro ao criar usuário:', error);
      return { success: false, error: 'Erro ao criar conta. Tente novamente.' };
    }
    
    // Cria sessão automaticamente
    await createSession({
      id: newUser.id.toString(),
      email: newUser.email,
      nome: newUser.nome,
      nivel: newUser.level,
      estabelecimento_id: (newUser as any).estabelecimento_id || undefined,
      afiliado_id: (newUser as any).afiliado_id || undefined,
    });
    
    return { success: true, redirectUrl: '/painel/inicio' };
  } catch (error) {
    console.error('Erro no registro:', error);
    return { success: false, error: 'Erro ao criar conta' };
  }
}
