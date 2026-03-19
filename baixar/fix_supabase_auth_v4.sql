-- ============================================
-- FIX v4: Verificar e recriar usuário admin
-- ============================================

-- 1. Verificar se o schema auth existe
CREATE SCHEMA IF NOT EXISTS auth;

-- 2. Verificar se a tabela auth.users existe e criar se necessário
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'auth' 
        AND table_name = 'users'
    ) THEN
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
            phone VARCHAR(255) UNIQUE,
            phone_confirmed_at TIMESTAMP WITH TIME ZONE,
            phone_change VARCHAR(255) DEFAULT '',
            phone_change_token VARCHAR(255) DEFAULT '',
            phone_change_sent_at TIMESTAMP WITH TIME ZONE,
            confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            email_change_token_current VARCHAR(255) DEFAULT '',
            email_change_confirm_status INTEGER DEFAULT 0,
            last_sign_in_at TIMESTAMP WITH TIME ZONE,
            banned_until TIMESTAMP WITH TIME ZONE,
            reauthentication_token VARCHAR(255) DEFAULT '',
            reauthentication_sent_at TIMESTAMP WITH TIME ZONE,
            is_sso_user BOOLEAN DEFAULT false,
            deleted_at TIMESTAMP WITH TIME ZONE,
            is_anonymous BOOLEAN DEFAULT false
        );
    END IF;
END $$;

-- 3. Verificar se o usuário admin existe
DO $$
DECLARE
    user_exists BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM auth.users WHERE email = 'contato@ilinkbio.com.br'
    ) INTO user_exists;
    
    IF NOT user_exists THEN
        -- Inserir usuário admin
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
        ) VALUES (
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
        );
        
        RAISE NOTICE 'Usuário admin criado com sucesso!';
    ELSE
        -- Atualizar senha do usuário existente
        UPDATE auth.users 
        SET 
            encrypted_password = crypt('admin123', gen_salt('bf')),
            email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
            confirmed_at = COALESCE(confirmed_at, NOW()),
            updated_at = NOW(),
            is_super_admin = true
        WHERE email = 'contato@ilinkbio.com.br';
        
        RAISE NOTICE 'Usuário admin atualizado com sucesso!';
    END IF;
END $$;

-- 4. Garantir permissões completas
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, service_role;
GRANT SELECT ON auth.users TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON auth.users TO authenticated;

-- 5. Criar índices se não existirem
CREATE INDEX IF NOT EXISTS users_instance_id_idx ON auth.users (instance_id);
CREATE INDEX IF NOT EXISTS users_email_idx ON auth.users (email);

-- 6. Verificar se o usuário foi criado
SELECT 
    'Usuários na tabela auth.users:' as info,
    COUNT(*) as total_users
FROM auth.users;

-- 7. Mostrar dados do usuário admin
SELECT 
    id,
    email,
    role,
    is_super_admin,
    created_at,
    email_confirmed_at,
    last_sign_in_at
FROM auth.users 
WHERE email = 'contato@ilinkbio.com.br';

-- ============================================
-- Instruções adicionais
-- ============================================
/*
Se o usuário ainda não aparecer no painel:

1. Recarregue a página (F5)
2. Limpe o cache do navegador (Ctrl+Shift+R)
3. Verifique se há algum filtro ativo no painel
4. Tente criar um usuário pelo botão "Add user" no painel

Se estiver usando Supabase self-hosted, verifique se o serviço GoTrue está rodando:
  docker ps | grep gotrue

Se necessário, reinicie os containers:
  docker-compose restart

Credenciais do admin:
  Email: contato@ilinkbio.com.br
  Senha: admin123
*/
