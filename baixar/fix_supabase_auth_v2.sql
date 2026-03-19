-- ============================================
-- FIX v2: Corrigir schema auth.users
-- ============================================

-- 1. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Criar schema auth se não existir
CREATE SCHEMA IF NOT EXISTS auth;

-- 3. Dropar e recriar a tabela auth.users com a estrutura completa
-- (somente se existir com estrutura incompleta)
DROP TABLE IF EXISTS auth.refresh_tokens CASCADE;
DROP TABLE IF EXISTS auth.users CASCADE;

-- 4. Criar tabela auth.users com estrutura completa
CREATE TABLE auth.users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    instance_id uuid,
    aud VARCHAR(255),
    role VARCHAR(255) DEFAULT 'authenticated',
    email VARCHAR(255) UNIQUE,
    encrypted_password VARCHAR(255),
    email_confirmed_at TIMESTAMP WITH TIME ZONE,
    invited_at TIMESTAMP WITH TIME ZONE,
    confirmation_token VARCHAR(255),
    confirmation_sent_at TIMESTAMP WITH TIME ZONE,
    recovery_token VARCHAR(255),
    recovery_sent_at TIMESTAMP WITH TIME ZONE,
    email_change_token_new VARCHAR(255),
    email_change VARCHAR(255),
    email_change_sent_at TIMESTAMP WITH TIME ZONE,
    new_email VARCHAR(255),
    raw_app_meta_data JSONB DEFAULT '{}'::jsonb,
    raw_user_meta_data JSONB DEFAULT '{}'::jsonb,
    is_super_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    phone VARCHAR(255) DEFAULT NULL UNIQUE,
    phone_confirmed_at TIMESTAMP WITH TIME ZONE,
    phone_change VARCHAR(255) DEFAULT '',
    phone_change_token VARCHAR(255) DEFAULT '',
    phone_change_sent_at TIMESTAMP WITH TIME ZONE,
    confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email_change_token_current VARCHAR(255) DEFAULT '',
    email_change_confirm_status INTEGER DEFAULT 0,
    banned_until TIMESTAMP WITH TIME ZONE,
    reauthentication_token VARCHAR(255) DEFAULT '',
    reauthentication_sent_at TIMESTAMP WITH TIME ZONE,
    is_sso_user BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_anonymous BOOLEAN DEFAULT false
);

-- 5. Criar índices
CREATE INDEX users_instance_id_idx ON auth.users (instance_id);
CREATE INDEX users_email_idx ON auth.users (email);

-- 6. Inserir usuário admin com senha: admin123
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email, 
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmed_at,
    is_super_admin
) VALUES (
    '00000000-0000-0000-0000-000000000001', -- ID fixo para fácil referência
    NULL,
    'authenticated',
    'authenticated',
    'contato@ilinkbio.com.br',
    crypt('admin123', gen_salt('bf')), -- Senha: admin123
    NOW(),
    '{"nome": "Administrador", "nivel": "1"}'::jsonb,
    NOW(),
    NOW(),
    NOW(),
    true -- is_super_admin
);

-- 7. Criar tabela refresh_tokens
CREATE TABLE auth.refresh_tokens (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) UNIQUE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION auth.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Criar triggers
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION auth.update_updated_at_column();

-- 10. Sincronizar com tabela public.users
DO $$
BEGIN
    -- Adicionar coluna auth_id se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND table_schema = 'public'
        AND column_name = 'auth_id'
    ) THEN
        ALTER TABLE public.users ADD COLUMN auth_id UUID;
    END IF;
    
    -- Atualizar referência do admin
    UPDATE public.users 
    SET auth_id = '00000000-0000-0000-0000-000000000001'
    WHERE email = 'contato@ilinkbio.com.br';
    
END $$;

-- 11. Configurar permissões
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA auth TO authenticated;
GRANT SELECT ON auth.users TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA auth TO authenticated, service_role;

-- ============================================
-- Conferir resultado
-- ============================================
SELECT 'Usuário admin criado com sucesso!' as status;
SELECT id, email, role, is_super_admin, created_at 
FROM auth.users 
WHERE email = 'contato@ilinkbio.com.br';
