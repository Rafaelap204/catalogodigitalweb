# Plano de Correção: Erro 404 e Conexão Supabase

## Problema Identificado

O erro 404 ocorre porque as rotas referenciadas na landing page não existem no projeto Next.js:
- `/comece/cadastrar` - Botão "Começar Agora"
- `/conheca` - Botão "Saiba Mais"
- `/planos`, `/sobre`, `/contato`, etc. - Links do footer

## Estrutura de Rotas a Criar

### 1. Rotas Públicas (app/(public)/)

```
app/(public)/
├── layout.tsx              # Layout simplificado sem auth
├── comece/
│   └── cadastrar/
│       └── page.tsx        # Formulário de cadastro
└── conheca/
    └── page.tsx            # Página de funcionalidades
```

### 2. Páginas Auxiliares (na raiz)

```
app/
├── planos/
│   └── page.tsx
├── sobre/
│   └── page.tsx
├── contato/
│   └── page.tsx
├── termos/
│   └── page.tsx
└── privacidade/
    └── page.tsx
```

### 3. Autenticação (app/(auth)/)

```
app/(auth)/
├── login/
│   └── page.tsx            # Já existe
├── esqueci/
│   └── page.tsx            # NOVO
└── novasenha/
    └── page.tsx            # NOVO
```

### 4. Painel Administrativo (app/(admin)/)

```
app/(admin)/
├── layout.tsx              # Layout com auth + nível 1
└── administracao/
    └── inicio/
        └── page.tsx
```

### 5. Painel Estabelecimento (app/(painel)/)

```
app/(painel)/
├── layout.tsx              # Layout com auth + nível 2
└── painel/
    └── inicio/
        └── page.tsx
```

### 6. Painel Afiliado (app/(afiliado)/)

```
app/(afiliado)/
├── layout.tsx              # Layout com auth + nível 3
└── afiliado/
    └── inicio/
        └── page.tsx
```

## Funcionalidades da Página /comece/cadastrar

Baseado no sistema PHP original, o cadastro deve incluir:

1. **Dados do Usuário:**
   - Nome completo
   - E-mail
   - Senha
   - Telefone/WhatsApp

2. **Dados do Estabelecimento:**
   - Nome da loja
   - Subdomínio (verificar disponibilidade)
   - Segmento (dropdown com opções do banco)
   - Cidade/Estado
   - Endereço completo
   - Descrição

3. **Fluxo:**
   - Validar subdomínio (único)
   - Criar usuário no Supabase Auth
   - Inserir registro na tabela `users`
   - Inserir registro na tabela `estabelecimentos`
   - Redirecionar para painel

## Verificação do Supabase

As variáveis de ambiente já estão configuradas em `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - URL do Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave anônima
- `SUPABASE_SERVICE_ROLE_KEY` - Chave de serviço

## Layouts Protegidos

Cada área (admin, painel, afiliado) precisa de um layout que:
1. Verifica se usuário está autenticado
2. Verifica se nível de acesso é permitido
3. Redireciona para login se não autorizado

## Componentes Necessários

- Formulário de cadastro com validação
- Formulário de recuperação de senha
- Sidebar navegação para painéis
- Header com user info e logout
