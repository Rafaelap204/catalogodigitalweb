-- ============================================
-- FIX: Remover trigger problemático
-- ============================================

-- 1. Remover o trigger que pode estar causando erro
DROP TRIGGER IF EXISTS update_users_updated_at ON auth.users;

-- 2. Remover a função
DROP FUNCTION IF EXISTS auth.update_updated_at_column();
DROP FUNCTION IF EXISTS auth.update_updated_at();

-- 3. Verificar se há outros triggers na tabela
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
AND event_object_schema = 'auth';

-- 4. Remover todos os triggers exceto os essenciais (se houver)
DO $$
DECLARE
    trig RECORD;
BEGIN
    FOR trig IN 
        SELECT trigger_name 
        FROM information_schema.triggers
        WHERE event_object_table = 'users'
        AND event_object_schema = 'auth'
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || trig.trigger_name || ' ON auth.users';
        RAISE NOTICE 'Trigger % removido', trig.trigger_name;
    END LOOP;
END $$;

-- 5. Garantir que o usuário admin existe (sem trigger)
INSERT INTO auth.users (
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmed_at,
    last_sign_in_at,
    is_super_admin
) 
SELECT 
    '00000000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    'contato@ilinkbio.com.br',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    '{"nome": "Administrador"}'::jsonb,
    NOW(),
    NOW(),
    NOW(),
    NOW(),
    true
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'contato@ilinkbio.com.br'
);

-- 6. Se já existe, apenas atualizar
UPDATE auth.users 
SET 
    encrypted_password = crypt('admin123', gen_salt('bf')),
    is_super_admin = true,
    updated_at = NOW()
WHERE email = 'contato@ilinkbio.com.br';

-- 7. Verificar resultado
SELECT 'Usuário criado/atualizado:' as status;
SELECT id, email, is_super_admin, created_at 
FROM auth.users 
WHERE email = 'contato@ilinkbio.com.br';

-- ============================================
-- ALTERNATIVA: Desativar RLS se estiver ativo
-- ============================================

-- Verificar se RLS está ativo
SELECT 
    relname as table_name,
    relrowsecurity as rls_enabled
FROM pg_class
WHERE relname = 'users' 
AND relnamespace = 'auth'::regnamespace;

-- Desativar RLS na tabela auth.users (se necessário)
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;

-- ============================================
-- Instruções
-- ============================================
/*
Após executar:
1. Tente criar o usuário pelo painel novamente
2. Se ainda der erro, o problema é no GoTrue (backend)
3. Nesse caso, use a alternativa abaixo

ALTERNATIVA RECOMENDADA:
Se o Supabase Auth continuar com problemas, modifique o código
para usar APENAS a tabela public.users que já existe.

Me avise se precisar dessa modificação!
*/
