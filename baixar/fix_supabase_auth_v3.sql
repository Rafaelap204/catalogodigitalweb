-- ============================================
-- FIX v3: Adicionar colunas faltantes na tabela auth.users
-- ============================================

-- Adicionar colunas que estão faltando na tabela auth.users
DO $$
BEGIN
    -- Adicionar coluna last_sign_in_at se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'last_sign_in_at'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN last_sign_in_at TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Adicionar outras colunas comuns que podem estar faltando
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'instance_id'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN instance_id uuid;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'aud'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN aud VARCHAR(255);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'invited_at'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN invited_at TIMESTAMP WITH TIME ZONE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'confirmation_token'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN confirmation_token VARCHAR(255);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'confirmation_sent_at'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN confirmation_sent_at TIMESTAMP WITH TIME ZONE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'recovery_token'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN recovery_token VARCHAR(255);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'recovery_sent_at'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN recovery_sent_at TIMESTAMP WITH TIME ZONE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'email_change_token_new'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN email_change_token_new VARCHAR(255);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'email_change'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN email_change VARCHAR(255);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'email_change_sent_at'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN email_change_sent_at TIMESTAMP WITH TIME ZONE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'new_email'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN new_email VARCHAR(255);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'phone'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN phone VARCHAR(255) UNIQUE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'phone_confirmed_at'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN phone_confirmed_at TIMESTAMP WITH TIME ZONE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'phone_change'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN phone_change VARCHAR(255) DEFAULT '';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'phone_change_token'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN phone_change_token VARCHAR(255) DEFAULT '';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'phone_change_sent_at'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN phone_change_sent_at TIMESTAMP WITH TIME ZONE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'confirmed_at'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'email_change_token_current'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN email_change_token_current VARCHAR(255) DEFAULT '';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'email_change_confirm_status'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN email_change_confirm_status INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'banned_until'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN banned_until TIMESTAMP WITH TIME ZONE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'reauthentication_token'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN reauthentication_token VARCHAR(255) DEFAULT '';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'reauthentication_sent_at'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN reauthentication_sent_at TIMESTAMP WITH TIME ZONE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'is_sso_user'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN is_sso_user BOOLEAN DEFAULT false;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'deleted_at'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'is_anonymous'
    ) THEN
        ALTER TABLE auth.users ADD COLUMN is_anonymous BOOLEAN DEFAULT false;
    END IF;

END $$;

-- Atualizar o usuário admin se existir
UPDATE auth.users 
SET last_sign_in_at = NOW()
WHERE email = 'contato@ilinkbio.com.br';

-- Criar índices se não existirem
CREATE INDEX IF NOT EXISTS users_instance_id_idx ON auth.users (instance_id);
CREATE INDEX IF NOT EXISTS users_email_idx ON auth.users (email);

-- Verificar estrutura da tabela
SELECT 'Colunas adicionadas com sucesso!' as status;
SELECT column_name 
FROM information_schema.columns 
WHERE table_schema = 'auth' AND table_name = 'users'
ORDER BY ordinal_position;
