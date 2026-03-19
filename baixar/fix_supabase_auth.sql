-- ============================================
-- FIX: Criar schema auth e tabelas necessárias
-- para o Supabase Auth funcionar corretamente
-- ============================================

-- 1. Habilitar extensão UUID se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Criar schema auth
CREATE SCHEMA IF NOT EXISTS auth;

-- 3. Criar tabela auth.users (simplificada para compatibilidade)
CREATE TABLE IF NOT EXISTS auth.users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    email_change_token VARCHAR(255),
    email_change VARCHAR(255),
    email_change_sent_at TIMESTAMP WITH TIME ZONE,
    new_email VARCHAR(255),
    raw_app_meta_data JSONB DEFAULT '{}'::jsonb,
    raw_user_meta_data JSONB DEFAULT '{}'::jsonb,
    is_super_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    phone VARCHAR(255) UNIQUE,
    phone_confirmed_at TIMESTAMP WITH TIME ZONE,
    phone_change VARCHAR(255),
    phone_change_token VARCHAR(255),
    phone_change_sent_at TIMESTAMP WITH TIME ZONE,
    confirmed_at TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (
        LEAST(email_confirmed_at, phone_confirmed_at)
    ) STORED,
    email_change_confirm_status INTEGER DEFAULT 0,
    banned_until TIMESTAMP WITH TIME ZONE,
    reauthentication_token VARCHAR(255),
    reauthentication_sent_at TIMESTAMP WITH TIME ZONE,
    is_sso_user BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_anonymous BOOLEAN DEFAULT false
);

-- 4. Criar índices
CREATE INDEX IF NOT EXISTS users_email_idx ON auth.users (email);
CREATE INDEX IF NOT EXISTS users_instance_email_idx ON auth.users (id, email);
CREATE INDEX IF NOT EXISTS users_instance_id_idx ON auth.users (id);

-- 5. Inserir usuário admin na tabela auth.users (se não existir)
-- O ID será gerado automaticamente, depois você pode atualizar a tabela public.users
INSERT INTO auth.users (
    email, 
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at
) 
SELECT 
    'contato@ilinkbio.com.br',
    crypt('admin123', gen_salt('bf')), -- Senha temporária: admin123
    NOW(),
    '{"nome": "Administrador"}'::jsonb,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'contato@ilinkbio.com.br'
);

-- 6. Criar tabela auth.refresh_tokens (necessária para sessões)
CREATE TABLE IF NOT EXISTS auth.refresh_tokens (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    token VARCHAR(255) UNIQUE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Criar tabela auth.instances (se necessário)
CREATE TABLE IF NOT EXISTS auth.instances (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    uuid uuid,
    raw_base_config TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION auth.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Criar trigger para auth.users
DROP TRIGGER IF EXISTS update_users_updated_at ON auth.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION auth.update_updated_at();

-- ============================================
-- Sincronizar com tabela public.users existente
-- ============================================

-- Atualizar a tabela public.users para referenciar auth.users
-- Adicionar coluna auth_id se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'auth_id'
    ) THEN
        ALTER TABLE public.users ADD COLUMN auth_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Sincronizar usuário admin
UPDATE public.users 
SET auth_id = (SELECT id FROM auth.users WHERE email = 'contato@ilinkbio.com.br')
WHERE email = 'contato@ilinkbio.com.br';

-- ============================================
-- Permissões
-- ============================================

-- Grant permissions (ajustar conforme seu usuário do banco)
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO anon, authenticated;

-- ============================================
-- Instruções pós-execução
-- ============================================
/*
Após executar este script:

1. O schema auth.users será criado
2. O usuário admin será criado com senha temporária: admin123
3. Você deve conseguir ver os usuários no painel do Supabase

IMPORTANTE: 
- Se estiver usando Supabase self-hosted, reinicie os containers do auth
- Verifique se o serviço GoTrue está rodando corretamente
- A senha foi definida como 'admin123' - altere-a após o primeiro login

Para alterar a senha do admin, use:
UPDATE auth.users 
SET encrypted_password = crypt('NOVA_SENHA', gen_salt('bf'))
WHERE email = 'contato@ilinkbio.com.br';
*/
